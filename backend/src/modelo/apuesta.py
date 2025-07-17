from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from modelo.declarative_base import Base

class Apuesta(Base):
    __tablename__ = 'apuesta'

    id = Column(Integer, primary_key=True)
    valor = Column(Integer, nullable=False)
    apostador_id = Column(Integer, ForeignKey('apostador.id'))
    carrera_id = Column(Integer, ForeignKey('carrera.id'))
    competidor_id = Column(Integer, ForeignKey('competidor.id'))
    apostador = relationship('Apostador', back_populates='apuestas', foreign_keys=[apostador_id])
    carrera = relationship('Carrera', back_populates='apuestas', foreign_keys=[carrera_id])
    competidor = relationship('Competidor', back_populates='apuestas', foreign_keys=[competidor_id])