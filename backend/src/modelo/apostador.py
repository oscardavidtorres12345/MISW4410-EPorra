from .declarative_base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Apostador(Base):
    __tablename__ = 'apostador'

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    apuestas = relationship('Apuesta', back_populates='apostador', cascade='all, delete', foreign_keys='Apuesta.apostador_id', primaryjoin='Apuesta.apostador_id == Apostador.id' )