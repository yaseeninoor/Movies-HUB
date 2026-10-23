#!/usr/bin/env python3
"""Build a small public RSS metadata catalogue for LOOP. Does not download media."""
import json, os, re, urllib.request, urllib.error
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
import xml.etree.ElementTree as ET

FEED_URL = os.environ.get("RSS_FEED_URL", "https://www.tamilsexzone.com/feed/").strip()
OUT = Path("data/rss-feed.json")
MAX_ITEMS = 60
HEADERS = {"User-Agent": "LOOP-RSS-Reader/1.0 (+https://yaseeninoor.github.io/Movies-HUB/)"}

def local_name(tag):
    return tag.rsplit("}", 1)[-1].lower()

def text_of(node, names):
    for child in list(node):
        if local_name(child.tag) in names:
            value = "".join(child.itertext()).strip()
            if value:
                return value
    return ""

def safe_text(value, limit=500):
    value = re.sub(r"<[^>]*>", " ", value or "")
    value = unescape(re.sub(r"\s+", " ", value)).strip()
    return value[:limit]

def item_link(node):
    for child in list(node):
        if local_name(child.tag) == "link":
            href = child.attrib.get("href", "").strip()
            rel = child.attrib.get("rel", "alternate")
            if href and rel in ("alternate", ""):
                return href
            if child.text and child.text.strip():
                return child.text.strip()
    return text_of(node, {"guid", "link"})

def item_media(node):
    for element in node.iter():
        name = local_name(element.tag)
        media_type = element.attrib.get("type", "").lower()
        url = (element.attrib.get("url") or element.attrib.get("href") or "").strip()
        rel = element.attrib.get("rel", "").lower()
        if not url.startswith("https://"):
            continue
        if name == "enclosure" and (media_type.startswith("video/") or media_type in {"application/x-mpegurl", "application/vnd.apple.mpegurl"}):
            return url
        if name == "link" and rel in {"enclosure", "player"} and (media_type.startswith("video/") or rel == "player"):
            return url
    return ""

def item_embed(node):
    for element in node.iter():
        name = local_name(element.tag)
        rel = element.attrib.get("rel", "").lower()
        url = (element.attrib.get("href") or element.attrib.get("url") or "").strip()
        if name == "link" and rel == "player" and url.startswith("https://"):
            return url
    return ""

def item_image(node):
    for element in node.iter():
        name = local_name(element.tag)
        if name in {"thumbnail", "content"} and element.attrib.get("url"):
            url = element.attrib["url"].strip()
            if url.startswith("https://"):
                return url
        if name == "enclosure" and element.attrib.get("type", "").startswith("image/"):
            url = element.attrib.get("url", "").strip()
            if url.startswith("https://"):
                return url
    description = text_of(node, {"description", "summary", "encoded"})
    match = re.search(r'<img[^>]+src=["\'](https://[^"\']+)["\']', description, re.I)
    return match.group(1) if match else ""

def main():
    result = {"source": FEED_URL, "updatedAt": datetime.now(timezone.utc).isoformat(), "items": [], "status": "ok"}
    try:
        if not FEED_URL.startswith("https://"):
            raise ValueError("RSS_FEED_URL must use HTTPS")
        request = urllib.request.Request(FEED_URL, headers=HEADERS)
        with urllib.request.urlopen(request, timeout=25) as response:
            raw = response.read(5_000_000)
        root = ET.fromstring(raw)
        nodes = [node for node in root.iter() if local_name(node.tag) in {"item", "entry"}]
        seen = set()
        for node in nodes:
            title = safe_text(text_of(node, {"title"}), 180)
            link = item_link(node)
            if not title or not link or not link.startswith("https://") or link in seen:
                continue
            seen.add(link)
            categories = [safe_text("".join(c.itertext()), 60) for c in list(node) if local_name(c.tag) == "category"]
            result["items"].append({
                "title": title,
                "url": link,
                "description": safe_text(text_of(node, {"description", "summary", "subtitle", "encoded"}), 320),
                "published": safe_text(text_of(node, {"pubdate", "published", "updated", "date"}), 80),
                "categories": [c for c in categories if c][:5],
                "image": item_image(node),
                "mediaUrl": item_media(node),
                "embedUrl": item_embed(node)
            })
            if len(result["items"]) >= MAX_ITEMS:
                break
    except Exception as exc:
        result["status"] = "unavailable"
        result["message"] = f"Feed could not be refreshed ({type(exc).__name__}). Check RSS_FEED_URL and source availability."
        print(result["message"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(result['items'])} RSS items; status={result['status']}")

if __name__ == "__main__":
    main()
