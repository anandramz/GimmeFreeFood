import os, json, datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from supabase import create_client, Client
import resend

load_dotenv("/Users/anandramaswamy/gimme_free_food/.env")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")          
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = "Acme <onboarding@resend.dev>" 
TO_EMAILS = [""]      # I took out my email for privacy

print(RESEND_API_KEY)
resend.api_key = RESEND_API_KEY
sb: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ET = ZoneInfo("America/New_York")

def tomorrow_bounds_iso_utc():
    today_et = datetime.datetime.now(ET).date()
    start_et = datetime.datetime.combine(today_et + datetime.timedelta(days=1), datetime.time(0,0,0, tzinfo=ET))
    end_et   = start_et + datetime.timedelta(days=1)
    return (start_et.astimezone(datetime.timezone.utc).isoformat(),
            end_et.astimezone(datetime.timezone.utc).isoformat())

def fetch_tomorrow_events():
    start_iso, end_iso = tomorrow_bounds_iso_utc()
    # If your column is timestamp without tz and you insert UTC, this still works consistently.
    resp = (sb.table("events")
              .select("*")
              .gte("date_time", start_iso)
              .lt("date_time", end_iso)
              .order("date_time", desc=False)
              .execute())
    return resp.data or []

def render_html(events: list[dict]) -> str:
    if not events:
        return "<p>No qualifying events for tomorrow.</p>"

    rows = []
    for e in events:
        title = e.get("title","")
        url = e.get("url") or "#"
        dt = (e.get("date_time") or "").replace("T", " ").replace("Z", " UTC")
        loc = e.get("location") or ""
        perks = e.get("perks") or ""
        img = e.get("image_url")

        img_html = f'<div><img src="{img}" alt="" style="max-width:100%;border-radius:10px;margin-top:6px"/></div>' if img else ""
        perks_html = f'<div style="font-size:12px;opacity:.8">{perks}</div>' if perks else ""

        rows.append(f"""
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #eee">
              <a href="{url}" style="font-size:16px;text-decoration:none;color:#0b72e7">{title}</a>
              <div style="font-size:13px;color:#444;margin-top:2px">{dt} — {loc}</div>
              {perks_html}
              {img_html}
            </td>
          </tr>
        """)

    body = "\n".join(rows)
    return f"""
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:16px">
      <h2 style="margin:0 0 12px">Tomorrow’s UNC perks</h2>
      <table width="100%" cellpadding="0" cellspacing="0">{body}</table>
      <p style="font-size:12px;color:#777;margin-top:16px">Sent by HeelLife Tracker.</p>
    </div>
    """

def render_text(events: list[dict]) -> str:
    if not events:
        return "No qualifying events for tomorrow."
    lines = []
    for e in events:
        lines.append(f"- {e.get('title','')} | {e.get('date_time','')} | {e.get('location','')} | {e.get('url','')}")
    return "\n".join(lines)

def send_digest():
    events = fetch_tomorrow_events()
    html = render_html(events)
    text = render_text(events)

    params = {
        "from": FROM_EMAIL,             # must be under your verified domain
        "to": TO_EMAILS,
        "subject": "Tomorrow’s UNC free food / credit / merch",
        "html": html,
        "text": text,                   # good for deliverability
        # "reply_to": "you@yourdomain.com",
    }

    email = resend.Emails.send(params)
    print("Resend response:", email)

if __name__ == "__main__":
    send_digest()
