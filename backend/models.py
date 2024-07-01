from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Avion(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fabricante = db.Column(db.String(255), nullable=False)
    modelo = db.Column(db.String(255), nullable=False)
    propulsion = db.Column(db.String(255), nullable=False)
    aniofabricacion = db.Column(db.Integer)
    foto = db.Column(db.String(255))

class LineaAerea(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(255), nullable=False)
    codigo = db.Column(db.String(255))
    foto = db.Column(db.String(255))

class AvionesLineas(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idavion = db.Column(db.Integer, db.ForeignKey('avion.id'))
    idlinea = db.Column(db.Integer, db.ForeignKey('linea_aerea.id'))