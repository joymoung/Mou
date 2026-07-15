#!/usr/bin/env bash
# set-github-secret.sh
# Usage (recommended):
#   1. Install GitHub CLI: https://cli.github.com/
#   2. Authenticate: gh auth login
#   3. Export your key locally: export GOOGLE_API_KEY="your_key_here"
#   4. Run: ./scripts/set-github-secret.sh joymoung/Mou

REPO="$1"
if [ -z "$REPO" ]; then
  echo "Usage: $0 owner/repo"
  exit 1
fi

if [ -z "$GOOGLE_API_KEY" ]; then
  echo "Please export GOOGLE_API_KEY in your shell, e.g. export GOOGLE_API_KEY=your_key"
  exit 1
fi

# Use GitHub CLI to set repository secret
gh secret set GOOGLE_API_KEY --repo "$REPO" --body "$GOOGLE_API_KEY"

if [ $? -eq 0 ]; then
  echo "GOOGLE_API_KEY secret set for $REPO"
else
  echo "Failed to set secret. Ensure gh is authenticated and has repo access."
fi
