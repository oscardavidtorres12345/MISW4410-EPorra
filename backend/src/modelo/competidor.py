from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship

from modelo.declarative_base import Base

class Competidor(Base):
    __tablename__ = 'competidor'

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    probabilidad = Column(Float, nullable=False)
    carrera_id = Column(Integer, ForeignKey('carrera.id'))
    carrera = relationship('Carrera', back_populates='competidores', foreign_keys=[carrera_id])
    apuestas = relationship("Apuesta", back_populates="competidor")