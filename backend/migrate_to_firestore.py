"""Migrate Solution and Collection entities from Datastore (default) to Firestore (solutionsportaldb)."""

import os

from google.cloud import datastore
from google.cloud import firestore

GCP_PROJECT = os.environ.get("GCP_PROJECT", "ogsmdataandanalyticsbfs-801193")
FIRESTORE_DB = "solutionsportaldb"

ds = datastore.Client(project=GCP_PROJECT)
fs = firestore.Client(project=GCP_PROJECT, database=FIRESTORE_DB)


def migrate_kind(kind: str):
    query = ds.query(kind=kind)
    entities = list(query.fetch())
    print(f"Found {len(entities)} {kind} entities in Datastore")

    collection_ref = fs.collection(kind)
    for entity in entities:
        doc_id = entity.key.name or str(entity.key.id)
        data = dict(entity)
        collection_ref.document(doc_id).set(data)
        print(f"  -> {kind}/{doc_id}")

    print(f"Migrated {len(entities)} {kind} documents to Firestore\n")


if __name__ == "__main__":
    for kind in ["Solution", "Collection", "Submission"]:
        migrate_kind(kind)
    print("Migration complete.")
