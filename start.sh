#!/usr/bin/env bash
set -e

export GCP_PROJECT=ogsmdataandanalyticsbfs-801193

cd "$(dirname "$0")"

echo "Starting backend on :8080..."
(cd backend && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8080) &
BACKEND_PID=$!

echo "Starting frontend on :3014..."
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."

wait
