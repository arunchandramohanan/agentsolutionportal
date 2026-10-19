import os
from functools import lru_cache

from google.cloud import firestore

FIRESTORE_DB = "solutionsportaldb"


@lru_cache(maxsize=1)
def get_fs() -> firestore.Client:
    project = os.environ.get("GCP_PROJECT")
    if project:
        return firestore.Client(project=project, database=FIRESTORE_DB)
    return firestore.Client(database=FIRESTORE_DB)
