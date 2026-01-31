from flask import Flask
from flask_cors import CORS
from database import db
from routes import bp
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, 
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )
    
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    
    app.register_blueprint(bp)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.drop_all() # For debugging and table changes
        db.create_all()
    app.run(debug=True)