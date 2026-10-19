"""Generate placeholder images for solutions and collections, upload to GCS, update Datastore."""

import io
import math

from google.cloud import storage as gcs
from PIL import Image, ImageDraw, ImageFont

from datastore_client import get_ds

BUCKET_NAME = "solutions-portal-assets-801193"
WIDTH, HEIGHT = 1600, 900

PALETTES = {
    "accent": [(99, 102, 241), (139, 92, 246), (236, 72, 153)],
    "dark": [(30, 41, 59), (51, 65, 85), (71, 85, 105)],
    "default": [(14, 165, 233), (56, 189, 248), (125, 211, 252)],
}

SOLUTIONS_META = [
    ("fraud-shield", "FraudShield AI", "accent", "BFSI · Accelerator"),
    ("claims-copilot", "Claims Copilot", "default", "Insurance · Solution"),
    ("patient360", "Patient360 Mesh", "default", "Healthcare · Platform"),
    ("shelf-iq", "ShelfIQ", "default", "Retail · POC"),
    ("core-mod", "CoreMod Migrator", "dark", "BFSI · Accelerator"),
    ("rx-trace", "RxTrace", "default", "Healthcare · Solution"),
    ("omni-cart", "OmniCart Engine", "accent", "Retail · Platform"),
    ("tele-twin", "TelcoTwin", "dark", "Telecom · POC"),
    ("kyc-flow", "KYC Flow", "default", "BFSI · Solution"),
    ("edge-vision", "EdgeVision SDK", "default", "Manufacturing · Accelerator"),
    ("risk-radar", "RiskRadar", "default", "BFSI · Solution"),
    ("studio-deploy", "Studio Deploy", "dark", "Cross-industry · Accelerator"),
]

COLLECTIONS_META = [
    ("bfsi-starter", "BFSI Modernization Starter Kit", "accent"),
    ("genai-regulated", "GenAI for Regulated Industries", "default"),
    ("edge-cv", "Edge & Computer Vision", "dark"),
    ("cloud-foundation", "Cloud Foundation Pack", "default"),
    ("healthcare-data", "Healthcare Data Fabric", "accent"),
    ("retail-pre-sales", "Retail Pre-sales Bundle", "default"),
]


def draw_gradient(draw, w, h, colors):
    c1, c2 = colors[0], colors[-1]
    for y in range(h):
        t = y / h
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))


def draw_grid_pattern(draw, w, h, color):
    r, g, b = color
    line_color = (min(r + 30, 255), min(g + 30, 255), min(b + 30, 255), 40)
    step = 60
    for x in range(0, w, step):
        draw.line([(x, 0), (x, h)], fill=line_color, width=1)
    for y in range(0, h, step):
        draw.line([(0, y), (w, y)], fill=line_color, width=1)


def draw_circles(draw, w, h, colors):
    mid = colors[len(colors) // 1 - 1] if len(colors) > 1 else colors[0]
    r, g, b = mid
    circle_color = (min(r + 40, 255), min(g + 40, 255), min(b + 40, 255), 50)
    for i in range(5):
        cx = int(w * (0.2 + i * 0.15))
        cy = int(h * (0.3 + (i % 3) * 0.15))
        radius = 80 + i * 30
        draw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            outline=circle_color,
            width=2,
        )


def generate_image(title, subtitle, tone):
    colors = PALETTES.get(tone, PALETTES["default"])
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    draw_gradient(draw, WIDTH, HEIGHT, colors)
    draw_grid_pattern(draw, WIDTH, HEIGHT, colors[0])
    draw_circles(draw, WIDTH, HEIGHT, colors)

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except OSError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    text_color = (255, 255, 255, 220)
    sub_color = (255, 255, 255, 140)

    bbox = draw.textbbox((0, 0), title, font=font_large)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) / 2, HEIGHT / 2 - 50), title, fill=text_color, font=font_large)

    if subtitle:
        bbox2 = draw.textbbox((0, 0), subtitle, font=font_small)
        tw2 = bbox2[2] - bbox2[0]
        draw.text(((WIDTH - tw2) / 2, HEIGHT / 2 + 40), subtitle, fill=sub_color, font=font_small)

    return img.convert("RGB")


def upload_to_gcs(img, filename):
    client = gcs.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"images/{filename}")

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    buf.seek(0)

    blob.upload_from_file(buf, content_type="image/jpeg")
    return f"https://storage.googleapis.com/{BUCKET_NAME}/images/{filename}"


def update_datastore_entity(kind, entity_id, image_url):
    ds = get_ds()
    key = ds.key(kind, entity_id)
    entity = ds.get(key)
    if entity:
        entity["imageUrl"] = image_url
        ds.put(entity)


def main():
    print("Generating solution images...")
    for sol_id, title, tone, subtitle in SOLUTIONS_META:
        img = generate_image(title, subtitle, tone)
        filename = f"{sol_id}.jpg"
        url = upload_to_gcs(img, filename)
        update_datastore_entity("Solution", sol_id, url)
        print(f"  {sol_id}: {url}")

    print("\nGenerating collection images...")
    for col_id, title, tone in COLLECTIONS_META:
        img = generate_image(title, "Collection", tone)
        filename = f"col-{col_id}.jpg"
        url = upload_to_gcs(img, filename)
        update_datastore_entity("Collection", col_id, url)
        print(f"  {col_id}: {url}")

    print(f"\nDone. {len(SOLUTIONS_META)} solution + {len(COLLECTIONS_META)} collection images uploaded.")


if __name__ == "__main__":
    main()
