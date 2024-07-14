from flask import Flask, request, jsonify, redirect
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
    return """
    <html>
    <h1>OVI API:</h1>
    <a href="/aviones">Aviones</a>
    <br>
    <a href="/lineasaereas">Lineas Aereas</a>
    <br>
    <a href="/flotas">Flotas</a>
    </html>
"""

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

@app.route("/aviones/<id>", methods=["GET"])
def get_avion_by_id(id):
    try:
        id = int(id)
        avion = Avion.query.get(id)
        if avion:
            avion_data = {
                'id': avion.id,
                'fabricante': avion.fabricante,
                'modelo': avion.modelo,
                'propulsion': avion.propulsion,
                'aniofabricacion': avion.aniofabricacion,
                'foto': avion.foto,
                'paisfabricacion': avion.paisfabricacion
            }
            return jsonify({'avion': avion_data})
        else:
            return jsonify({'error': 'Avión no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route("/aviones/<id>", methods=["DELETE"])
def delete_avion(id):
    avion = Avion.query.get(id)
    if avion:
        db.session.delete(avion)
        db.session.commit()
        return jsonify({"mensaje": "Avión eliminado exitosamente"})

@app.route("/aviones/<id>", methods=["PUT"])
def edit_avion(id):
    avion = Avion.query.get(id)
    if avion:
        data = request.get_json()
        avion.fabricante = data['fabricante']
        avion.modelo = data['modelo']
        avion.propulsion = data['propulsion']
        avion.aniofabricacion = data['aniofabricacion']
        avion.foto = data['foto']
        avion.paisfabricacion = data['paisfabricacion']
        db.session.commit()
        return jsonify({"mensaje": "Avión editado exitosamente"})
    
@app.route('/lineasaereas', methods=['GET'])
def get_lineasaereas():
    try:
        lineas = LineaAerea.query.all()
        lineas_data = []
        for linea in lineas:
            lineas_data.append({
                'id': linea.id,
                'nombre': linea.nombre,
                'codigo': linea.codigo,
                'foto': linea.foto
            })
        return jsonify({'lineas': lineas_data})
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/lineasaereas", methods=["POST"])
def create_lineasaereas():
    try:
        data = request.get_json()
        nombre = request.json.get('nombre')
        codigo = request.json.get('codigo')
        foto = request.json.get('foto')

        nueva_linea = LineaAerea(
            nombre=nombre,
            codigo=codigo,
            foto=foto
        )

        db.session.add(nueva_linea)
        db.session.commit()

        return jsonify({
            "mensaje": "Aerolinea agregada exitosamente",
            "linea": {
                'id': nueva_linea.id,
                'nombre': nueva_linea.nombre,
                'codigo': nueva_linea.codigo,
                'foto': nueva_linea.foto
            }
        }), 201
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    
@app.route("/lineasaereas/<id>", methods=["GET"])
def get_lineaaerea_by_id(id):
    try:
        id = int(id)
        linea = LineaAerea.query.get(id)
        if linea:
            linea_data = {
                'id': linea.id,
                'nombre': linea.nombre,
                'codigo': linea.codigo,
                'foto': linea.foto
            }
            return jsonify({'linea': linea_data})
        else:
            return jsonify({'error': 'Linea aerea no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route("/lineasaereas/<id>", methods=["PUT"])
def edit_lineaaerea(id):
    linea = LineaAerea.query.get(id)
    if linea:
        data = request.get_json()
        if data:
            if 'id' in data:
                linea.id = data['id']
            if 'nombre' in data:
                linea.nombre = data['nombre']
            if 'codigo' in data:
                linea.codigo = data['codigo']
            if 'foto' in data:
                linea.foto = data['foto']
            db.session.commit()
            return jsonify({"mensaje": "Linea editada exitosamente"})
        else:
            return jsonify({"mensaje": "No data provided"}), 400
    else:
        return jsonify({"mensaje": "Linea not found"}), 404
    
@app.route("/lineasaereas/<id>", methods=["DELETE"])
def delete_lineaaerea(id):
    linea = LineaAerea.query.get(id)
    if linea:
        db.session.delete(linea)
        db.session.commit()
        return jsonify({"mensaje": "Linea eliminada exitosamente"})
    
@app.route("/flotas", methods=["GET"])
def get_flotas():
    try:
        flotas = AvionesLineas.query.all()
        flotas_data = []
        for flota in flotas:
            flotas_data.append({
                'id': flota.id,
                'avion_id': flota.id_avion,
                'linea_id': flota.id_linea
            })
        return jsonify({'flotas': flotas_data})
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500
    
@app.route("/flotas/<id_linea>", methods=["GET"])
def get_flotas_by_linea(id_linea):
    try:
        id_linea = int(id_linea)
        flotas = AvionesLineas.query.filter_by(id_linea=id_linea).all()
        flotas_data = []
        for flota in flotas:
            avion = Avion.query.get(flota.id_avion)
            if avion:
                flotas_data.append({
                    'avion': {
                        'id': avion.id,
                        'fabricante': avion.fabricante,
                        'modelo': avion.modelo
                    }
                })
        return jsonify({'flotas': flotas_data}), 200
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/flotas/<id_linea>", methods=["DELETE"])
def delete_flota(id_linea):
    try:
        id_linea = int(id_linea)
        data = request.get_json()
        avion_id = data.get('avion_id')

        flota = AvionesLineas.query.filter_by(id_avion=avion_id, id_linea=id_linea).first()

        if flota:
            db.session.delete(flota)
            db.session.commit()
            return jsonify({"mensaje": "Flota eliminada exitosamente"}), 200
        else:
            return jsonify({"mensaje": "Flota no encontrada"}), 404
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500
        
@app.route("/flotas", methods=["PUT"])
def create_flota():
    try:
        data = request.get_json()
        id_avion = data.get('avion_id')
        id_linea = data.get('linea_id')

        if not id_avion or not id_linea:
            return jsonify({'mensaje': 'Datos incompletos'}), 400

        nueva_flota = AvionesLineas(
            id_avion=id_avion,
            id_linea=id_linea
        )

        db.session.add(nueva_flota)
        db.session.commit()

        return jsonify({
            "mensaje": "Flota agregada exitosamente",
            "flota": {
                'id': nueva_flota.id,
                'avion_id': nueva_flota.id_avion,
                'linea_id': nueva_flota.id_linea
            }
        }), 201
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

if __name__ == '__main__':
    print("Starting server...")
    with app.app_context():
        db.create_all()
        print("Tables created")
    app.run(host='0.0.0.0', debug=True, port=port)
