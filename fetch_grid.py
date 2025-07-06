import os
import math
import time
import json
import requests
from dotenv import load_dotenv
import re

load_dotenv(".env")
API_KEY = os.getenv("GOOGLE_API_KEY")

# bounding box for Waterloo–Kitchener, changed it up real quick
LAT_MIN = 43.411510
LAT_MAX = 43.492104
LNG_MIN = -80.606232
LNG_MAX = -80.411313

POSTAL_RE = re.compile(r"[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d")
RADIUS = 1000 
TYPE = "restaurant"
MAX_RESULTS = 20
OUTPUT_FILE = "restaurants_v1.json"
# need headers!!
HEADERS = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.name,places.displayName,places.formattedAddress,places.types"
}

def get_address_parts(formatted_address: str):
    parts = [p.strip() for p in formatted_address.split(",")]
    street = parts[0] if len(parts) > 0 else None
    city   = parts[1] if len(parts) > 1 else None

    # extract the full postal code (e.g. "N2R 0R3")
    m = POSTAL_RE.search(formatted_address)
    postal = m.group() if m else None
    return street, city, postal

def nearby_search_v1(lat, lng):
    url = "https://places.googleapis.com/v1/places:searchNearby"
    body = {
        "includedTypes": [TYPE],
        "maxResultCount": MAX_RESULTS,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(RADIUS)
            }
        }
    }
    resp = requests.post(url, headers=HEADERS, json=body)
    data = resp.json()
    if resp.status_code != 200:
        print("ERROR", data.get("error", data))
        return []
    return data.get("places", [])

def make_grid():
    # convert meters→degrees lat/lng
    deg_per_m = 1 / 111000
    step_lat = RADIUS * deg_per_m * 0.8
    latitudes = []
    lat = LAT_MIN
    while lat <= LAT_MAX:
        latitudes.append(lat)
        lat += step_lat

    # adjust lng step by cos(lat_center)
    lat_c = (LAT_MIN + LAT_MAX)/2
    deg_per_m_lng = 1/(111000 * math.cos(math.radians(lat_c)))
    step_lng = RADIUS * deg_per_m_lng * 0.9
    longitudes = []
    lng = LNG_MIN
    while lng <= LNG_MAX:
        longitudes.append(lng)
        lng += step_lng

    return [(lat, lng) for lat in latitudes for lng in longitudes]

def fetch_all():
    seen = set()
    out = []
    # lord keep us safe from rate limits
    grid = make_grid()
    for i, (lat, lng) in enumerate(grid, 1):
        print(f"[{i}/{len(grid)}] Searching at {lat:.5f},{lng:.5f}")
        for place in nearby_search_v1(lat, lng):
            # resource name: "places/PLACE_ID"
            res_name = place.get("name", "")
            pid = res_name.split("/")[-1]
            if pid in seen:
                continue
            seen.add(pid)

            disp = place.get("displayName", {})
            fam = place.get("formattedAddress", "")
            street, city, postal = get_address_parts(fam)
            print(f"  Found {disp.get('text', 'Unknown')} ({pid}) at {street}, {city}, {postal}")
            if not (street and city and postal):
                continue

            out.append({
                "placeId": pid,
                "name": disp.get("text"),
                "street": street,
                "city": city,
                "postalCode": postal
            })

        time.sleep(1)  # rate limit GGs

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"\n✅ Saved {len(out)} unique restaurants to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_all()
