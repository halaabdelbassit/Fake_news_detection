from flask import Blueprint, request, jsonify, make_response
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse

scraper_bp = Blueprint("scraper", __name__)

SUPPORTED_DOMAINS = {
    "aljazeera.net": {
        "title_tag": {"name": "h1"},
        "content_tag": {"name": "p", "attrs": {"class": "x_MsoNormal"}},
        "date_tag": {"name": "span", "attrs": {"class": "article-dates__published"}}
    },
    "echoroukonline.com": {
        "title_tag": {"name": "h1", "attrs": {"class": "ech-sgmn__title ech-sgmn__sdpd"}},
        "content_tag": {"name": "p"},
        "date_tag": {"name": "time", "attrs": {"class": "ech-card__mtil"}}
    },
    "alarabiya.net": {
        "title_tag": {"name": "h1", "attrs": {"class": "headingInfo_title"}},
        "content_tag": {"name": "p", "attrs":{"class": "body-1 paragraph"}},
        "date_tag": {"name": "time"}
    },
    "bbc.com/arabic": {
        "title_tag": {"name": "span", "attrs": {"class": "css-s2yxgf"}},
        "content_tag": {"name": "p", "attrs": {"class": "css-1bamlcy"}},
    },
    "elkhabar.com": {
        "title_tag": {"name": "h1"},
        "content_tag": {"name": "p", "attrs": {"class": "module-article-section overlay-wine"}},
        "date_tag": {"name": "li", "attrs": {"class":"stronger overlay-theme size-26 text-uppercase"}}
    },
}

def scrape_article(url):
    domain = urlparse(url).netloc.replace("www.", "")
    
    if domain not in SUPPORTED_DOMAINS:
        return None, f"Unsupported domain: {domain}"
    
    rules = SUPPORTED_DOMAINS[domain]

    try:
        headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
        }
        res = requests.get(url,headers=headers)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        title_element = soup.find(**rules["title_tag"])
        content_element = soup.find(**rules["content_tag"])
        date_element = soup.find(**rules["date_tag"])

        title = title_element.get_text(strip=True) if title_element else None
        content = content_element.get_text(strip=True) if content_element else None
        pub_date = date_element.get_text(strip=True) if date_element else None

        if not content or content.strip() == "":
            return None, "لم نتمكن من العثور على محتوى في هذا الرابط"
        
        if not title:
            title = "عنوان غير متوفر"
        
        if not pub_date:
            pub_date = "تاريخ النشر غير متوفر"

        return {"title": title, "content": content, "publication_date": pub_date}, None

    except Exception as e:
        return None, f"Scraping error: {str(e)}"

@scraper_bp.route("/scrape/", methods=["POST", "OPTIONS"])
@scraper_bp.route("/scrape", methods=["POST", "OPTIONS"])
def scrape():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response

    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    result, error = scrape_article(url)
    if error:
        response = make_response(jsonify({"error": error}))
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 400

    if not result or not result.get("content"):
        response = make_response(jsonify({"error": "محتوى المقال غير متوفر"}))
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 400

    response = make_response(jsonify(result))
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, 200

