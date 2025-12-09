#!/bin/bash
echo "Starting NexusPhi offline (2B model)..."
cd "$(dirname "$0")"
ollama serve & sleep 3
ollama pull OSAI-2b-q4
echo "OSAI ready! Open in browser: http://localhost:11434"
echo "Or open chat.html"
