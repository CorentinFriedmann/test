#!/usr/bin/env bash
# Hook PostToolUse (outil Agent) : après le travail d'un agent du studio,
# rappelle à la session principale qu'il faut faire valider le livrable par la Boss.
# La liste des agents est lue dans .claude/agents/ : un agent recruté depuis
# l'interface graphique est donc pris en compte automatiquement.
input="$(cat)"

# Agent lancé en arrière-plan : rien n'est encore remis, le rappel viendra avec la notification de fin.
if printf '%s' "$input" | grep -Eqi 'async_launched|Async agent launched|"run_in_background"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

racine="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cible="$(printf '%s' "$input" | grep -Eo '"subagent_type"[[:space:]]*:[[:space:]]*"[a-z0-9-]+"' | head -n1 | sed -E 's/.*"([a-z0-9-]+)"$/\1/')"

if [ -n "$cible" ] && [ "$cible" != "boss" ] && [ -f "$racine/.claude/agents/$cible.md" ]; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"RÈGLE DU STUDIO : un agent vient de rendre un travail. Si c'est la remise d'une tâche T-XXX, passe-la au statut EN REVUE BOSS dans production/BACKLOG.md et invoque maintenant l'agent `boss` pour validation (après la revue de pôle si elle est prévue). La tâche n'est terminée qu'avec production/validations/T-XXX.md au verdict VALIDÉ."}}
EOF
fi
exit 0
