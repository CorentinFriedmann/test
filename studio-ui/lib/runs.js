'use strict';

// Lance des sessions Claude Code non interactives (claude -p --output-format stream-json)
// et transforme leur flux en un journal lisible : qui fait quoi, quel agent travaille, etc.

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const MAX_ENTREES = 4000;
const MAX_TEXTE = 20000;

function texteDe(contenu) {
  if (typeof contenu === 'string') return contenu;
  if (Array.isArray(contenu)) {
    return contenu.map((c) => (typeof c === 'string' ? c : c && c.type === 'text' ? c.text : '')).filter(Boolean).join('\n');
  }
  return '';
}

class RunManager {
  constructor({ root, dir, bin = 'claude' }) {
    this.root = root;
    this.dir = dir;
    this.bin = bin;
    this.runs = new Map();
    this.internes = new Map(); // id -> { proc, outils: Map(toolUseId -> agent), arrete }
    try {
      fs.mkdirSync(dir, { recursive: true });
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.json')) continue;
        try {
          const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
          if (r.statut === 'en cours') r.statut = 'interrompu';
          r.agentsActifs = [];
          this.runs.set(r.id, r);
        } catch { /* fichier corrompu : ignoré */ }
      }
    } catch { /* dossier non accessible : historique désactivé */ }
  }

  resume(r) {
    return {
      id: r.id, titre: r.titre, type: r.type, tache: r.tache, agent: r.agent, statut: r.statut,
      debut: r.debut, fin: r.fin, cout: r.cout, duree: r.duree, permissionMode: r.permissionMode,
      model: r.model, nbEntrees: r.entrees.length, agentsActifs: r.agentsActifs,
    };
  }

  list() {
    return [...this.runs.values()].sort((a, b) => b.debut.localeCompare(a.debut)).slice(0, 100).map((r) => this.resume(r));
  }

  get(id, depuis = 0) {
    const r = this.runs.get(id);
    if (!r) return null;
    return { ...this.resume(r), prompt: r.prompt, resultat: r.resultat, depuis, entrees: r.entrees.slice(depuis) };
  }

  enCours() {
    return [...this.runs.values()].filter((r) => r.statut === 'en cours').length;
  }

  start({ titre, type, tache, agent, prompt, permissionMode, model, budget }) {
    const horodatage = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const id = `${horodatage}-${crypto.randomBytes(2).toString('hex')}`;
    const run = {
      id, titre, type, tache: tache || null, agent: agent || null, prompt, permissionMode,
      model: model || '', budget: budget || null, statut: 'en cours', debut: new Date().toISOString(),
      fin: null, cout: null, duree: null, resultat: null, entrees: [], agentsActifs: [],
    };
    const interne = { proc: null, outils: new Map(), arrete: false };
    this.runs.set(id, run);
    this.internes.set(id, interne);

    const args = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--permission-mode', permissionMode];
    if (model) args.push('--model', model);
    if (budget) args.push('--max-budget-usd', String(budget));
    this.ajouter(run, 'info', `Session lancée (mode de permission : ${permissionMode}${model ? `, modèle : ${model}` : ''}${budget ? `, budget max : ${budget} $` : ''})`);

    let proc;
    try {
      proc = spawn(this.bin, args, { cwd: this.root, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      this.ajouter(run, 'erreur', err.message);
      this.terminer(run, 'échec');
      return this.resume(run);
    }
    interne.proc = proc;

    let tampon = '';
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (d) => {
      tampon += d;
      let i;
      while ((i = tampon.indexOf('\n')) >= 0) {
        const ligne = tampon.slice(0, i).trim();
        tampon = tampon.slice(i + 1);
        if (ligne) this.traiterLigne(run, ligne);
      }
    });
    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', (d) => {
      for (const l of String(d).split('\n')) if (l.trim()) this.ajouter(run, 'stderr', l.trim());
    });
    proc.on('error', (err) => {
      this.ajouter(run, 'erreur', err.code === 'ENOENT'
        ? `Commande « ${this.bin} » introuvable. Installez Claude Code (https://code.claude.com) puis relancez l'interface.`
        : err.message);
      this.terminer(run, 'échec');
    });
    proc.on('close', (code) => {
      if (tampon.trim()) this.traiterLigne(run, tampon.trim());
      this.terminer(run, interne.arrete ? 'arrêté' : code === 0 ? 'terminé' : 'échec');
    });
    this.sauver(run);
    return this.resume(run);
  }

  stop(id) {
    const r = this.runs.get(id);
    const interne = this.internes.get(id);
    if (!r || !interne || !interne.proc || r.statut !== 'en cours') return false;
    interne.arrete = true;
    interne.proc.kill('SIGTERM');
    setTimeout(() => { if (r.statut === 'en cours') interne.proc.kill('SIGKILL'); }, 5000).unref();
    this.ajouter(r, 'alerte', "Arrêt demandé depuis l'interface");
    return true;
  }

  ajouter(run, type, texte, acteur = 'coordination', extra = {}) {
    run.entrees.push({ t: Date.now(), type, acteur, texte: String(texte ?? '').slice(0, MAX_TEXTE), ...extra });
    if (run.entrees.length > MAX_ENTREES) run.entrees.splice(1, run.entrees.length - MAX_ENTREES);
  }

  acteur(run, parentId) {
    if (!parentId) return 'coordination';
    return this.internes.get(run.id)?.outils.get(parentId) || 'coordination';
  }

  traiterLigne(run, ligne) {
    let msg;
    try { msg = JSON.parse(ligne); } catch { this.ajouter(run, 'stderr', ligne); return; }
    const interne = this.internes.get(run.id);
    switch (msg.type) {
      case 'system':
        if (msg.subtype === 'init') {
          const n = Array.isArray(msg.agents) ? ` · ${msg.agents.length} agents disponibles` : '';
          this.ajouter(run, 'info', `Session Claude Code prête (modèle ${msg.model || '?'}${n})`);
        }
        break;
      case 'assistant': {
        const acteur = this.acteur(run, msg.parent_tool_use_id);
        for (const c of msg.message?.content || []) {
          if (c.type === 'text' && c.text && c.text.trim()) {
            this.ajouter(run, 'texte', c.text.trim(), acteur);
          } else if (c.type === 'tool_use') {
            const input = c.input || {};
            if ((c.name === 'Agent' || c.name === 'Task') && interne) {
              const cible = input.subagent_type || 'agent';
              interne.outils.set(c.id, cible);
              if (!run.agentsActifs.includes(cible)) run.agentsActifs.push(cible);
              this.ajouter(run, 'delegation', `Confie le travail à « ${cible} » : ${input.description || ''}`, acteur, { cible });
            } else {
              this.ajouter(run, 'outil', this.decrireOutil(c.name, input), acteur);
            }
          }
        }
        break;
      }
      case 'user': {
        const contenus = Array.isArray(msg.message?.content) ? msg.message.content : [];
        for (const c of contenus) {
          if (c.type !== 'tool_result') continue;
          const agent = interne?.outils.get(c.tool_use_id);
          if (agent) {
            run.agentsActifs = run.agentsActifs.filter((a) => a !== agent);
            this.ajouter(run, 'fin-agent', `« ${agent} » a rendu son travail`, this.acteur(run, msg.parent_tool_use_id), {
              cible: agent, extrait: texteDe(c.content).slice(0, 6000),
            });
          } else if (c.is_error) {
            this.ajouter(run, 'erreur-outil', texteDe(c.content).slice(0, 1500), this.acteur(run, msg.parent_tool_use_id));
          }
        }
        break;
      }
      case 'result': {
        run.cout = typeof msg.total_cost_usd === 'number' ? msg.total_cost_usd : null;
        run.duree = msg.duration_ms ?? null;
        run.resultat = msg.result || null;
        const refus = Array.isArray(msg.permission_denials) ? msg.permission_denials : [];
        if (refus.length) {
          const noms = [...new Set(refus.map((d) => d.tool_name))].join(', ');
          this.ajouter(run, 'alerte', `${refus.length} action(s) refusée(s) par le mode de permission (${noms}). Choisissez un mode plus permissif si besoin.`);
        }
        this.ajouter(run, msg.is_error ? 'erreur' : 'resultat', msg.result || msg.subtype || 'Terminé');
        break;
      }
      default:
        break;
    }
  }

  decrireOutil(nom, input) {
    const rel = (p) => (p ? path.relative(this.root, p) || p : '');
    switch (nom) {
      case 'Skill': return `Utilise le skill « ${input.skill} »${input.args ? ` ${input.args}` : ''}`;
      case 'Write': return `Écrit ${rel(input.file_path)}`;
      case 'Edit': case 'MultiEdit': return `Modifie ${rel(input.file_path)}`;
      case 'Read': return `Lit ${rel(input.file_path)}`;
      case 'Bash': return `$ ${input.command || ''}`;
      case 'Glob': return `Cherche des fichiers : ${input.pattern || ''}`;
      case 'Grep': return `Cherche « ${input.pattern || ''} »`;
      case 'WebSearch': return `Recherche web : ${input.query || ''}`;
      case 'WebFetch': return `Consulte ${input.url || ''}`;
      case 'TodoWrite': case 'TaskCreate': case 'TaskUpdate': return 'Met à jour sa liste de tâches';
      default: return nom;
    }
  }

  terminer(run, statut) {
    if (run.fin) return;
    run.fin = new Date().toISOString();
    run.statut = statut;
    run.agentsActifs = [];
    const interne = this.internes.get(run.id);
    if (interne) interne.proc = null;
    this.sauver(run);
  }

  sauver(run) {
    try { fs.writeFileSync(path.join(this.dir, `${run.id}.json`), JSON.stringify(run)); } catch { /* best effort */ }
  }
}

module.exports = { RunManager };
