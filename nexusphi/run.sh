#!/bin/bash
echo "Starting NexusPhi offline (2B model)..."
cd "$(dirname "$0")"
ollama serve & sleep 3
ollama pull nexusphi-2b-q4
echo "NexusPhi ready! Open in browser: http://localhost:11434"
echo "Or open chat.html"
