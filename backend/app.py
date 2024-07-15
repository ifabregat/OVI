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
        # Capturar parámetros de la URL
        fabricante = request.args.get('fabricante')
        propulsion = request.args.get('propulsion')
        paisfabricacion = request.args.get('paisfabricacion')
        aniofabricacion = request.args.get('aniofabricacion')

        # Iniciar consulta base
        query = Avion.query
        
        # Aplicar filtros según los parámetros proporcionados
        if fabricante:
            query = query.filter(Avion.fabricante == fabricante)
        if propulsion:
            if propulsion.lower() == 'helice':
                query = query.filter(Avion.propulsion == 'helice')
            elif propulsion.lower() == 'reactor':
                query = query.filter(Avion.propulsion == 'reactor')
            elif propulsion.lower() == 'piston':
                query = query.filter(Avion.propulsion == 'piston')
        if paisfabricacion:
            query = query.filter(Avion.paisfabricacion == paisfabricacion)
        if aniofabricacion:
            if aniofabricacion.lower() == 'ascendente':
                query = query.order_by(Avion.aniofabricacion.asc())
            elif aniofabricacion.lower() == 'descendente':
                query = query.order_by(Avion.aniofabricacion.desc())
        
        # Ordenar por modelo por defecto si no se especifica el filtro de aniofabricacion
        else:
            query = query.order_by(Avion.modelo)

        # Ejecutar consulta
        aviones = query.all()
        
        # Formatear datos de respuesta
        aviones_data = [
            {
                'id': avion.id,
                'fabricante': avion.fabricante,
                'modelo': avion.modelo,
                'propulsion': avion.propulsion,
                'aniofabricacion': avion.aniofabricacion,
                'foto': avion.foto,
                'paisfabricacion': avion.paisfabricacion
            }
            for avion in aviones
        ]
        
        # Retornar datos en formato JSON
        return jsonify({'aviones': aviones_data})
    
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500



@app.route("/aviones", methods=["POST"])
def create_avion():
    try:
        data = request.get_json()
        nuevo_avion = Avion(
            fabricante=data['fabricante'],
            modelo=data['modelo'],
            propulsion=data['propulsion'],
            aniofabricacion=data['aniofabricacion'],
            foto=data['foto'],
            paisfabricacion=data['paisfabricacion']
        )

        db.session.add(nuevo_avion)
        db.session.commit()

        return jsonify({
            "mensaje": "Avión agregado exitosamente",
            "avion": {
                'id': nuevo_avion.id,
                'fabricante': nuevo_avion.fabricante,
                'modelo': nuevo_avion.modelo,
                'propulsion': nuevo_avion.propulsion,
                'aniofabricacion': nuevo_avion.aniofabricacion,
                'foto': nuevo_avion.foto,
                'paisfabricacion': nuevo_avion.paisfabricacion,
            }
        }), 201
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/aviones/<int:id>", methods=["GET"])
def get_avion_by_id(id):
    try:
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
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/aviones/<int:id>", methods=["DELETE"])
def delete_avion(id):
    try:
        avion = Avion.query.get(id)
        if avion:
            db.session.delete(avion)
            db.session.commit()
            return jsonify({"mensaje": "Avión eliminado exitosamente"})
        else:
            return jsonify({"mensaje": "Avión no encontrado"}), 404
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/aviones/<int:id>", methods=["PUT"])
def edit_avion(id):
    try:
        avion = Avion.query.get(id)
        if avion:
            data = request.get_json()
            avion.fabricante = data.get('fabricante', avion.fabricante)
            avion.modelo = data.get('modelo', avion.modelo)
            avion.propulsion = data.get('propulsion', avion.propulsion)
            avion.aniofabricacion = data.get('aniofabricacion', avion.aniofabricacion)
            avion.foto = data.get('foto', avion.foto)
            avion.paisfabricacion = data.get('paisfabricacion', avion.paisfabricacion)
            db.session.commit()
            return jsonify({"mensaje": "Avión editado exitosamente"})
        else:
            return jsonify({"mensaje": "Avión no encontrado"}), 404
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route('/lineasaereas', methods=['GET'])
def get_lineasaereas():
    try:
        lineas = LineaAerea.query.order_by(LineaAerea.nombre).all()
        lineas_data = [
            {
                'id': linea.id,
                'nombre': linea.nombre,
                'codigo': linea.codigo,
                'foto': linea.foto
            }
            for linea in lineas
        ]
        return jsonify({'lineas': lineas_data})
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/lineasaereas", methods=["POST"])
def create_lineasaereas():
    try:
        data = request.get_json()
        nueva_linea = LineaAerea(
            nombre=data['nombre'],
            codigo=data['codigo'],
            foto=data['foto']
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

@app.route("/lineasaereas/<int:id>", methods=["GET"])
def get_lineaaerea_by_id(id):
    try:
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
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/lineasaereas/<int:id>", methods=["PUT"])
def edit_lineaaerea(id):
    try:
        linea = LineaAerea.query.get(id)
        if linea:
            data = request.get_json()
            linea.nombre = data.get('nombre', linea.nombre)
            linea.codigo = data.get('codigo', linea.codigo)
            linea.foto = data.get('foto', linea.foto)
            db.session.commit()
            return jsonify({"mensaje": "Linea editada exitosamente"})
        else:
            return jsonify({"mensaje": "Linea no encontrada"}), 404
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/lineasaereas/<int:id>", methods=["DELETE"])
def delete_lineaaerea(id):
    try:
        linea = LineaAerea.query.get(id)
        if linea:
            db.session.delete(linea)
            db.session.commit()
            return jsonify({"mensaje": "Linea eliminada exitosamente"})
        else:
            return jsonify({"mensaje": "Linea no encontrada"}), 404
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/flotas", methods=["GET"])
def get_flotas():
    try:
        flotas = AvionesLineas.query.all()
        flotas_data = [
            {
                'id': flota.id,
                'avion_id': flota.id_avion,
                'linea_id': flota.id_linea
            }
            for flota in flotas
        ]
        return jsonify({'flotas': flotas_data})
    except Exception as error:
        print(f"Error: {error}")
        return jsonify({'mensaje': 'Error en el servidor'}), 500

@app.route("/flotas/<int:id_linea>", methods=["GET"])
def get_flotas_by_linea(id_linea):
    try:
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

@app.route("/flotas", methods=["POST"])
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

@app.route("/flotas/<int:id_linea>", methods=["DELETE"])
def delete_flota(id_linea):
    try:
        data = request.get_json()
        if not data or 'avion_id' not in data:
            return jsonify({"mensaje": "ID de avión no proporcionado"}), 400

        avion_id = data['avion_id']

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

if __name__ == '__main__':
    print("Starting server...")
    with app.app_context():
        db.create_all()
        print("Tables created")
    app.run(host='0.0.0.0', debug=True, port=port)
