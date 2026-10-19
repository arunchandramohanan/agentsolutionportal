import os
from functools import lru_cache

from google.cloud import datastore


@lru_cache(maxsize=1)
def get_ds() -> datastore.Client:
    project = os.environ.get("GCP_PROJECT")
    if project:
        return datastore.Client(project=project)
    return datastore.Client()
