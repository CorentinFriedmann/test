#!/usr/bin/env bash
# Hook PostToolUse (outil Agent) : après le travail d'un agent du studio,
# rappelle à la session principale qu'il faut faire valider le livrable par la Boss.
input="$(cat)"

agents='producer|game-director|marketing-publishing|game-designer|level-designer|narrative-designer|ui-ux-designer|technical-director|gameplay-programmer|graphics-programmer|platform-engineer|build-engineer|art-director|environment-artist|character-artist|technical-artist|animator|audio-director|qa-lead'

if printf '%s' "$input" | grep -Eq "\"subagent_type\"[[:space:]]*:[[:space:]]*\"(${agents})\""; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"RÈGLE DU STUDIO : un agent vient de rendre un travail. Si c'est la remise d'une tâche T-XXX, passe-la au statut EN REVUE BOSS dans production/BACKLOG.md et invoque maintenant l'agent `boss` pour validation (après la revue de pôle si elle est prévue). La tâche n'est terminée qu'avec production/validations/T-XXX.md au verdict VALIDÉ."}}
EOF
fi
exit 0
