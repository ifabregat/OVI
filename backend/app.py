from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Avion, LineaAerea, AvionesLineas 

app = Flask(__name__)
CORS(app)
port = 5000
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://ifabregat:ifabregat@localhost:5432/ovi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/')
def home():
    return "Hola mundo!"

@app.route('/aviones', methods=['GET'])
def get_aviones():
    try:
        aviones = Avion.query.all()
        aviones_data = []
        for avion in aviones:
            aviones_data.append({
                'id': avion.id,
                'fabricante': avion.fabricante,
                'modelo': avion.modelo,
                'propulsion': avion.propulsion,
                'aniofabricacion': avion.aniofabricacion,
                'foto': avion.foto,
                'paisfabricacion': avion.paisfabricacion
            })
        return jsonify({'aviones': aviones_data})
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/aviones", methods=["POST"])
def create_avion():
    try:
        data = request.get_json()
        fabricante = request.json.get('fabricante')
        modelo = request.json.get('modelo')
        propulsion = request.json.get('propulsion')
        aniofabricacion = request.json.get('aniofabricacion')
        foto = request.json.get('foto')
        paisfabricacion = request.json.get('paisfabricacion')

        nuevo_avion = Avion(
            fabricante=fabricante,
            modelo=modelo,
            propulsion=propulsion,
            aniofabricacion=aniofabricacion,
            foto=foto,
            paisfabricacion=paisfabricacion
        )

        db.session.add(nuevo_avion)
        db.session.commit()

        return jsonify({"mensaje": "Avión agregado exitosamente", "avion": {
            'id': nuevo_avion.id,
            'fabricante': nuevo_avion.fabricante,
            'modelo': nuevo_avion.modelo,
            'propulsion': nuevo_avion.propulsion,
            'aniofabricacion': nuevo_avion.aniofabricacion,
            'foto': nuevo_avion.foto,
            'paisfabricacion': nuevo_avion.paisfabricacion,
        }}), 201
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

if __name__ == '__main__':
    print("Starting server...")
    with app.app_context():
        db.create_all()
        print("Tables created")
    app.run(host='0.0.0.0', debug=True, port=port)
