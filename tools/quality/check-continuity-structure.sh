#!/usr/bin/env bash
set -euo pipefail

echo "Checking continuity guardrails..."

# 1) Disallow new root-level versioned files like *-v2.html in continuity/
bad_files=$(find continuity -maxdepth 1 -type f | grep -E -- '-v[0-9]+(\.[a-z0-9]+)?$' || true)
if [[ -n "${bad_files}" ]]; then
  echo "❌ Found versioned files at continuity root (move to archive or canonical folder):"
  echo "${bad_files}"
  exit 1
fi

# 2) Ensure key docs exist
for f in continuity/README-INDEX.md continuity/LIVE-URL-MAP.md continuity/FOUNDER-DATA-MAP.md; do
  [[ -f "$f" ]] || { echo "❌ Missing required doc: $f"; exit 1; }
done

echo "✅ continuity guardrails passed."
