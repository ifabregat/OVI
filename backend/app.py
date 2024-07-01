from flask import Flask
from flask_cors import CORS
from models import db, Avion, LineaAerea, AvionesLineas

app = Flask(__name__)
CORS(app)
port = 5000
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://ifabregat:ifabregat@localhost:5432/ovi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/')
def home():
    return "Hola mundo!"