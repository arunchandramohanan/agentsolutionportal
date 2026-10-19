#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "Building frontend..."
npm run build

echo "Copying frontend build to backend/static..."
rm -rf backend/static
cp -r dist backend/static

echo "Deploying to Cloud Run..."
cd backend
gcloud run deploy solutions-portal-api \
  --source . \
  --region us-central1 \
  --project ogsmdataandanalyticsbfs-801193 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT=ogsmdataandanalyticsbfs-801193 \
  --network nspoke-ogsm-da-bfs-us-central1 \
  --subnet internal-subnet-1 \
  --vpc-egress all-traffic \
  --ingress internal

echo "Done."
