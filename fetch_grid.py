import os
import math
import time
import json
import requests
from dotenv import load_dotenv

load_dotenv(".env")
API_KEY = os.getenv("GOOGLE_API_KEY")

# 1. Bounding box for Waterloo–Kitchener
LAT_MIN, LAT_MAX = 43.36, 43.53
LNG_MIN, LNG_MAX = -80.59, -80.38

RADIUS = 3000          # meters
TYPE = "restaurant"
OUTPUT_FILE = "restaurants.json"

def get_address_components(place_id):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "address_components",
        "key": API_KEY
    }
    res = requests.get(url, params=params).json()
    if res.get("status") != "OK":
        return None, None, None

    comps = res["result"]["address_components"]
    street = city = postal = None
    num = route = None
    for c in comps:
        t = c["types"]
        if "street_number" in t: 
            num = c["long_name"]
        if "route" in t:
            route = c["long_name"]
        if "locality" in t:
            city = c["long_name"]
        if "postal_code" in t:
            postal = c["long_name"]
    if route and num:
        street = f"{num} {route}"
    elif route:      
        street = route

    return street, city, postal

def nearby_search(lat, lng):
    """Fetch all pages of Nearby Search for one center."""
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": API_KEY,
        "location": f"{lat},{lng}",
        "radius": RADIUS,
        "type": TYPE
    }
    results = []
    while True:
        r = requests.get(url, params=params).json()
        if r.get("status") not in ("OK", "ZERO_RESULTS"):
            print("NearbySearch error:", r.get("status"))
            break

        results.extend(r.get("results", []))
        token = r.get("next_page_token")
        if token:
            time.sleep(2)  # must wait for token to activate
            params = {"key": API_KEY, "pagetoken": token}
        else:
            break
    return results

def generate_grid():
    # approximate degrees per meter for latitude
    deg_per_meter = 1 / (111_000)
    step = RADIUS * deg_per_meter * 0.9  # 10% overlap
    lats = []
    lat = LAT_MIN
    while lat <= LAT_MAX:
        lats.append(lat)
        lat += step

    lngs = []
    # adjust longitude step by cos(lat_center)
    lat_center = (LAT_MIN + LAT_MAX) / 2
    deg_per_meter_lng = 1 / (111_000 * math.cos(math.radians(lat_center)))
    step_lng = RADIUS * deg_per_meter_lng * 0.9
    lng = LNG_MIN
    while lng <= LNG_MAX:
        lngs.append(lng)
        lng += step_lng

    return [(lat, lng) for lat in lats for lng in lngs]

def fetch_all():
    seen = set()
    cleaned = []
    for i, (lat, lng) in enumerate(generate_grid(), 1):
        print(f"[{i}/{len(generate_grid())}] Center: {lat:.5f},{lng:.5f}")
        places = nearby_search(lat, lng)
        for p in places:
            pid = p["place_id"]
            if pid in seen:
                continue
            seen.add(pid)

            street, city, postal = get_address_components(pid)
            if not all((street, city, postal)):
                continue

            cleaned.append({
                "placeId": pid,
                "name": p.get("name"),
                "street": street,
                "city": city,
                "postalCode": postal
            })
            time.sleep(1)  # respect rate limits

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)
    print(f"\n✅ Saved {len(cleaned)} unique restaurants to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_all()
