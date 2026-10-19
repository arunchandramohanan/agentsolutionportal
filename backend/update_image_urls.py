"""Update entities to use ID-based image proxy URLs and store GCS paths."""

from datastore_client import get_ds

GCS_PATHS = {
    "Solution": {
        "fraud-shield": "images/fraud-shield.jpg",
        "claims-copilot": "images/claims-copilot.jpg",
        "patient360": "images/patient360.jpg",
        "shelf-iq": "images/shelf-iq.jpg",
        "core-mod": "images/core-mod.jpg",
        "rx-trace": "images/rx-trace.jpg",
        "omni-cart": "images/omni-cart.jpg",
        "tele-twin": "images/tele-twin.jpg",
        "kyc-flow": "images/kyc-flow.jpg",
        "edge-vision": "images/edge-vision.jpg",
        "risk-radar": "images/risk-radar.jpg",
        "studio-deploy": "images/studio-deploy.jpg",
    },
    "Collection": {
        "bfsi-starter": "images/col-bfsi-starter.jpg",
        "genai-regulated": "images/col-genai-regulated.jpg",
        "edge-cv": "images/col-edge-cv.jpg",
        "cloud-foundation": "images/col-cloud-foundation.jpg",
        "healthcare-data": "images/col-healthcare-data.jpg",
        "retail-pre-sales": "images/col-retail-pre-sales.jpg",
    },
}


def update():
    ds = get_ds()

    for kind, paths in GCS_PATHS.items():
        api_prefix = "solutions" if kind == "Solution" else "collections"
        for entity_id, gcs_path in paths.items():
            key = ds.key(kind, entity_id)
            entity = ds.get(key)
            if entity:
                entity["gcsImage"] = gcs_path
                entity["imageUrl"] = f"/api/{api_prefix}/{entity_id}/image"
                ds.put(entity)
                print(f"  {kind}/{entity_id}: imageUrl={entity['imageUrl']}, gcsImage={gcs_path}")

    print("Done.")


if __name__ == "__main__":
    update()
