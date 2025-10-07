# pip install playwright
# playwright install chromium
from playwright.sync_api import sync_playwright
from dateutil import parser
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from pathlib import Path
from dotenv import load_dotenv
import os
from supabase import create_client, Client
import json
from pathlib import Path


env_path = Path('/Users/anandramaswamy/gimme_free_food/.env')
load_dotenv(dotenv_path=env_path)
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
# Basically we are taking a look at the events page for tomorrow for freed food, cle credit and free stuff
URL = "https://heellife.unc.edu/events?perks=Credit&perks=FreeFood&perks=Merchandise&shortcutdate=tomorrow"

BASE = "https://heellife.unc.edu"

ICON_MAP = {
    "credit.svg": "Credit",
    "free_food.svg": "FreeFood",
    "free_stuff.svg": "Merchandise",
}


CAMPUS_TZ = ZoneInfo("America/New_York")

def to_utc_iso(s: str) -> str:
    dt = parser.parse(s)
    # assume campus tz if time is naive
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=CAMPUS_TZ)
    return dt.astimezone(timezone.utc).isoformat()


def extract_perks_on_event(page):
    """Return a list of perk strings from the event detail page."""
    perks = set()

    # 1) Grab all perk icons and map by filename
    for img in page.locator("h2:has-text('Perks') ~ div img").all():
        src = (img.get_attribute("src") or "").strip()
        filename = src.rsplit("/", 1)[-1].split("?")[0].lower()
        if filename in ICON_MAP:
            perks.add(ICON_MAP[filename])

    # 2) Fallback: read any nearby text labels next to the icon
    for span in page.locator("h2:has-text('Perks') ~ div span").all():
        txt = (span.inner_text() or "").strip()
        if not txt:
            continue
        tnorm = txt.lower()
        if "credit" in tnorm:
            perks.add("Credit")
        if "free" in tnorm and "food" in tnorm:
            perks.add("FreeFood")
        if "merch" in tnorm:
            perks.add("Merchandise")

    return sorted(perks)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL, wait_until="networkidle")

    # Click "Load More" until it stops changing the count
    while True:
        try:
            load_more = page.get_by_role("button", name="Load More")
            if not load_more.is_visible():
                break
            before = page.text_content("div[aria-live='polite']") or ""
            load_more.click()
            page.wait_for_timeout(900)
            after = page.text_content("div[aria-live='polite']") or ""
            if before == after:
                break
        except Exception:
            break

    # Gather event cards on the listing page
    events = []
    cards = page.locator("#event-discovery-list a[href^='/event/']")
    n = cards.count()

    # We’ll collect the shallow fields first, then enrich with perks
    titles_visited = set()
    for i in range(n):
        a = cards.nth(i)
        href = a.get_attribute("href")
        if href is None:
            continue
        url = BASE + href if href else None

        title_el = a.locator("h3")
        title = title_el.inner_text().strip() if title_el.count() else None

        info_rows = a.locator("div[style*='font-size: 0.938rem'] > div")
        when = info_rows.nth(0).inner_text().strip() if info_rows.count() > 0 else None
        where = info_rows.nth(1).inner_text().strip() if info_rows.count() > 1 else None

        bg_style = a.locator("[role='img']").first.get_attribute("style") or ""
        image = None
        if "background-image:" in bg_style:
            start = bg_style.find('url("') + 5
            end = bg_style.find('")', start)
            if start > 4 and end > start:
                image = bg_style[start:end]
        try:
            event_dt = parser.parse(when)
        except Exception:
            event_dt = None
        if (title, when, where) in titles_visited:
            continue
        titles_visited.add((title, when, where))
        if event_dt and event_dt.date() == (datetime.now() + timedelta(days=1)).date():
            events.append({
                "title": title,
                "datetime": when,
                "location": where,
                "url": url,
                "image": image,
            })
    


    # Visit each event page to extract perks
    for e in events:
        if not e["url"]:
            e["perks"] = []
            continue
        try:
            page.goto(e["url"], wait_until="networkidle")
            page.wait_for_timeout(300)  # small debounce for content to settle
            e["perks"] = extract_perks_on_event(page)
        except Exception:
            e["perks"] = []

    browser.close()
rows = []
for e in events:
    title = (e["title"] or "").strip()
    loc   = (e.get("location") or "").strip()
    when  = (e["datetime"] or "").strip()
    if not (title and loc and when):
        # skip incomplete rows to avoid PK violation
        continue

    rows.append({
        "title": title,
        "date_time": to_utc_iso(when),
        "location": loc,
        "url": e["url"],
        "image_url": e.get("image"),
        "perks": ", ".join(e.get("perks", [])) or None,
    })
output_path = Path(__file__).resolve().parent / "events_export.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

print(f"✅ Exported {len(rows)} events to {output_path}")


supabase.table("events").upsert(rows, on_conflict="title,date_time,location").execute()
