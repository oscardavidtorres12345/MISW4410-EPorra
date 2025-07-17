from .declarative_base import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class Carrera(Base):
    __tablename__ = 'carrera'

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    terminada = Column(Boolean)
    ganador = Column(Integer, ForeignKey('competidor.id'), nullable=True)
    competidores = relationship('Competidor', back_populates='carrera', cascade='all, delete', foreign_keys='Competidor.carrera_id', primaryjoin='Competidor.carrera_id == Carrera.id' )
    apuestas = relationship('Apuesta', back_populates='carrera', cascade='all, delete', foreign_keys='Apuesta.carrera_id', primaryjoin='Apuesta.carrera_id == Carrera.id' )