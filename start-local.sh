#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf '%s\n' 'Open http://localhost:8765 in your browser.'
python3 -m http.server 8765
