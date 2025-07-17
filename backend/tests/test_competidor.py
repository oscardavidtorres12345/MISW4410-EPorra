import unittest
from src.modelo.carrera import Carrera
from src.modelo.competidor import Competidor
from src.logica.Logica import Logica
from src.modelo.declarative_base import Session
from sqlalchemy import func

class CompetidorTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.logica = Logica()
        self.session = Session()
        self.session.close()

    def tearDown(self):
        '''Abre la sesión'''
        self.session = Session()

        '''Consulta todos las carreras'''
        busqueda = self.session.query(Carrera).all()

        '''Borra todos las carreras'''
        for carrera in busqueda:
            self.session.delete(carrera)

        self.session.commit()
        self.session.close()

    def test_agregar_competidor_validar_nombre_vacio(self):
        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [{'Nombre':'', 'Probabilidad':0}])
        self.assertEqual(validacion, 'No debe haber competidores con nombre vacío')

    def test_agregar_competidor_validar_nombre_alfanumerico(self):
        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [{'Nombre':'#-@£^` ', 'Probabilidad':0}])
        self.assertEqual(validacion, 'No debe haber competidores con nombre con caracteres no alfanuméricos')

    def test_agregar_competidor_validar_probabilidad(self):
        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [{'Nombre':'Nuevo Competidor', 'Probabilidad':1.2}])
        self.assertEqual(validacion, 'No debe haber competidores con probabilidad mayor que 1 y menor que 0')

        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [{'Nombre':'Nuevo Competidor', 'Probabilidad':-0.5}])
        self.assertEqual(validacion, 'No debe haber competidores con probabilidad mayor que 1 y menor que 0')
    
    def test_agregar_competidores_validar_suma_probabilidades(self):
        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [{'Nombre':'Nuevo Competidor 1', 'Probabilidad':0.5}, {'Nombre':'Nuevo Competidor 2', 'Probabilidad':0.6}])
        self.assertEqual(validacion, 'La suma de las probabilidades de los competidores debe ser 1')

    def test_agregar_carrera_competidores(self):
        nombre_competidor = 'Nueva Competidor de Prueba'
        self.logica.crear_carrera('Nueva Carrera de Prueba')
        self.logica.aniadir_competidor(-1, nombre_competidor, 0.5)
        competidor_insertado = self.session.query(func.count(Competidor.id)).filter(Competidor.nombre == nombre_competidor).scalar()
        self.assertEqual(competidor_insertado, 1)
