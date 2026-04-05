#!/usr/bin/env bash
set -euo pipefail

echo "Checking continuity guardrails..."

# Allowed versioned root files (intentional compatibility wrappers)
ALLOWED=(
  "continuity/otos-ripple-effect-premium-v4.css"
  "continuity/otos-ripple-effect-premium-v4.html"
  "continuity/otos-ripple-effect-premium-v4.js"
  "continuity/founder-story-v2.html"
)

is_allowed() {
  local f="$1"
  for a in "${ALLOWED[@]}"; do
    [[ "$f" == "$a" ]] && return 0
  done
  return 1
}

bad=()
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  if ! is_allowed "$f"; then
    bad+=("$f")
  fi
done < <(find continuity -maxdepth 1 -type f | grep -E -- '-v[0-9]+(\.[a-z0-9]+)?$' || true)

if (( ${#bad[@]} > 0 )); then
  echo "❌ Found disallowed versioned files at continuity root:"
  printf '%s\n' "${bad[@]}"
  exit 1
fi

# Required docs
for f in continuity/README-INDEX.md continuity/LIVE-URL-MAP.md continuity/FOUNDER-DATA-MAP.md; do
  [[ -f "$f" ]] || { echo "❌ Missing required doc: $f"; exit 1; }
done

echo "✅ continuity guardrails passed."
