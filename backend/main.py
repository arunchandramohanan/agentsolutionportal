import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from functools import lru_cache

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from google.cloud import storage as gcs

from firestore_client import get_fs
from models import Collection, IndustryCount, Solution, StackCount, Submission

app = FastAPI(title="Solutions Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).parent / "static"
GCS_BUCKET = "solutions-portal-assets-801193"


@lru_cache(maxsize=1)
def get_gcs_bucket():
    client = gcs.Client()
    return client.bucket(GCS_BUCKET)


def doc_to_dict(doc_snapshot) -> dict:
    data = doc_snapshot.to_dict()
    data["id"] = doc_snapshot.id
    return data


@app.get("/api/solutions", response_model=list[Solution])
def list_solutions():
    fs = get_fs()
    docs = fs.collection("Solution").stream()
    return [doc_to_dict(d) for d in docs]


@app.get("/api/solutions/featured", response_model=list[Solution])
def list_featured():
    fs = get_fs()
    from google.cloud.firestore_v1.base_query import FieldFilter
    docs = fs.collection("Solution").where(filter=FieldFilter("featured", "==", True)).stream()
    return [doc_to_dict(d) for d in docs]


@app.get("/api/solutions/{solution_id}", response_model=Solution)
def get_solution(solution_id: str):
    fs = get_fs()
    doc = fs.collection("Solution").document(solution_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Solution not found")
    return doc_to_dict(doc)


@app.get("/api/industries", response_model=list[IndustryCount])
def list_industries():
    fs = get_fs()
    docs = fs.collection("Solution").stream()
    counts: dict[str, int] = {}
    for doc in docs:
        data = doc.to_dict()
        for ind in data.get("industries", []):
            counts[ind] = counts.get(ind, 0) + 1
    return [{"id": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]


@app.get("/api/stacks", response_model=list[StackCount])
def list_stacks():
    fs = get_fs()
    docs = fs.collection("Solution").stream()
    counts: dict[str, int] = {}
    for doc in docs:
        data = doc.to_dict()
        for tech in data.get("stack", []):
            counts[tech] = counts.get(tech, 0) + 1
    return [{"id": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]


@app.get("/api/collections", response_model=list[Collection])
def list_collections():
    fs = get_fs()
    docs = fs.collection("Collection").stream()
    return [doc_to_dict(d) for d in docs]


@app.get("/api/collections/{collection_id}", response_model=Collection)
def get_collection(collection_id: str):
    fs = get_fs()
    doc = fs.collection("Collection").document(collection_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Collection not found")
    return doc_to_dict(doc)


@app.post("/api/submissions", status_code=201)
def create_submission(submission: Submission):
    fs = get_fs()
    doc_id = uuid4().hex[:12]
    data = submission.model_dump()
    data["id"] = doc_id
    data["createdAt"] = datetime.now(timezone.utc).isoformat()
    data["status"] = "live"
    fs.collection("Submission").document(doc_id).set(data)

    stack_list = [s.strip() for s in submission.stack.split(",") if s.strip()]
    solution = {
        "id": doc_id,
        "title": submission.title,
        "tagline": submission.tagline,
        "description": submission.description,
        "industry": submission.industries[0] if submission.industries else "Cross-industry",
        "industries": submission.industries,
        "stack": stack_list,
        "type": submission.type,
        "status": "live",
        "team": "Community",
        "placeholderTone": "default",
        "placeholderLabel": "",
        "featured": False,
        "imageUrl": "",
    }
    fs.collection("Solution").document(doc_id).set(solution)

    return {"id": doc_id, "status": "live"}


@app.get("/api/solutions/{solution_id}/image")
def solution_image(solution_id: str):
    fs = get_fs()
    doc = fs.collection("Solution").document(solution_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Solution not found")
    gcs_path = doc.to_dict().get("gcsImage")
    if not gcs_path:
        raise HTTPException(status_code=404, detail="No image for this solution")
    blob = get_gcs_bucket().blob(gcs_path)
    if not blob.exists():
        raise HTTPException(status_code=404, detail="Image not found in storage")
    return Response(
        content=blob.download_as_bytes(),
        media_type=blob.content_type or "image/jpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@app.get("/api/collections/{collection_id}/image")
def collection_image(collection_id: str):
    fs = get_fs()
    doc = fs.collection("Collection").document(collection_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Collection not found")
    gcs_path = doc.to_dict().get("gcsImage")
    if not gcs_path:
        raise HTTPException(status_code=404, detail="No image for this collection")
    blob = get_gcs_bucket().blob(gcs_path)
    if not blob.exists():
        raise HTTPException(status_code=404, detail="Image not found in storage")
    return Response(
        content=blob.download_as_bytes(),
        media_type=blob.content_type or "image/jpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
