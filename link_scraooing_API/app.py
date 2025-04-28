
from flask import Flask
from flask_cors import CORS
from endpoints.check_news import check_news_bp
from endpoints.scrape import scraper_bp

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

app.register_blueprint(check_news_bp)
app.register_blueprint(scraper_bp)

if __name__ == "__main__":
    app.run(debug=True)
