from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Avion(db.Model):
    __tablename__ = 'avion'
    id = Column(Integer, primary_key=True)
    fabricante = Column(String)
    modelo = Column(String)
    propulsion = Column(String)
    paisfabricacion = Column(String)
    aniofabricacion = Column(Integer)
    foto = Column(String)

class LineaAerea(db.Model):
    __tablename__ = 'linea_aerea'
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    codigo = Column(String)
    foto = Column(String)

class AvionesLineas(db.Model):
    __tablename__ = 'aviones_lineas'
    id = Column(Integer, primary_key=True)
    id_avion = Column(Integer, ForeignKey('avion.id'))
    id_linea = Column(Integer, ForeignKey('linea_aerea.id'))
    avion = relationship("Avion", backref="aviones_lineas")
    linea_aerea = relationship("LineaAerea", backref="aviones_lineas")
