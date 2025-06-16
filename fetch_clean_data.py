import requests
import time
import json
import os
import dotenv
dotenv.load_dotenv(".env")

API_KEY = os.getenv("GOOGLE_API_KEY")
LOCATION = "43.4643,-80.5204"  # Waterloo, Ontario
RADIUS = 3000 # gonna change this to a larger radius for production dataset
TYPE = "restaurant"
OUTPUT_FILE = "restaurants.json"

def get_address_components(place_id):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "address_components",
        "key": API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    if data.get("status") != "OK":
        print(f"Details API error: {data.get('status')}")
        return None, None, None

    components = data["result"]["address_components"]

    street = city = postal_code = None
    street_number = route = None

    for comp in components:
        types = comp["types"]
        if "street_number" in types:
            street_number = comp["long_name"]
        if "route" in types:
            route = comp["long_name"]
        if "locality" in types:
            city = comp["long_name"]
        if "postal_code" in types:
            postal_code = comp["long_name"]

    if route and street_number:
        street = f"{street_number} {route}"
    elif route:
        street = route

    return street, city, postal_code

def fetch_and_clean():
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": API_KEY,
        "location": LOCATION,
        "radius": RADIUS,
        "type": TYPE
    }

    all_results = []
    seen_place_ids = set()

    while True:
        response = requests.get(url, params=params)
        data = response.json()

        if data.get("status") not in ("OK", "ZERO_RESULTS"):
            print("NearbySearch error:", data.get("status"))
            break

        for place in data.get("results", []):
            place_id = place.get("place_id")
            if place_id in seen_place_ids:
                continue
            seen_place_ids.add(place_id)

            name = place.get("name")
            print(f"Fetching details for {name}...")

            street, city, postal_code = get_address_components(place_id)
            if not all([street, city, postal_code]):
                print("  Skipped — missing address components.")
                continue

            all_results.append({
                "placeId": place_id,
                "name": name,
                "street": street,
                "city": city,
                "postalCode": postal_code
            })

            time.sleep(1)  # google doesnt like us like that

        next_page_token = data.get("next_page_token")
        if next_page_token:
            time.sleep(2)
            params = {"key": API_KEY, "pagetoken": next_page_token}
        else:
            break

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)

    print(f"\n✅ Saved {len(all_results)} restaurants to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_and_clean()
