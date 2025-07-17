import unittest
import random

from faker import Faker
from src.modelo.apostador import Apostador
from src.logica.Logica import Logica
from src.modelo.declarative_base import Session

class ApostadorTestCase(unittest.TestCase):
    def setUp(self):
        self.logica = Logica()
        self.session = Session()

        self.data_factory = Faker()

        Faker.seed(1000)

        self.apostadores = []

        for _ in range(3):
            apostador = Apostador(
                nombre=self.data_factory.unique.name()
            )
            self.apostadores.append(apostador)
            self.session.add(apostador)

        self.session.commit()

    def tearDown(self):
        '''Abre la sesión'''
        self.session = Session()

        '''Consulta todos los apostadores'''
        apostadores = self.session.query(Apostador).all()

        '''Borra todas las apostadores'''
        for apostador in apostadores:
            self.session.delete(apostador)

        self.session.commit()
        self.session.close()
    
    def test_listar_apostadores(self):
        apostadores_list = self.logica.dar_apostadores()
        apostador_names = [apostador['Nombre'] for apostador in apostadores_list]
        for apostador_db in self.apostadores:
            self.assertIn(apostador_db.nombre, apostador_names)
    
    def test_listar_apostadores_alfabeticamente(self):
        apostadores_list = self.logica.dar_apostadores()
        apostador_names = [apostador['Nombre'] for apostador in apostadores_list]
        self.assertEqual(apostador_names, sorted(apostador_names))

    def test_agregar_apostador(self):
        nombre_apostador = self.data_factory.unique.name()
        self.logica.aniadir_apostador(nombre_apostador)
        apostadores = self.logica.dar_apostadores()
        apostador_nombres = [apostador['Nombre'] for apostador in apostadores]
        self.assertIn(nombre_apostador, apostador_nombres)

    def test_agregar_apostador_validar_nombre_vacio(self):
        mensaje = self.logica.validar_crear_editar_apostador("")
        self.assertEqual(mensaje, "El nombre del apostador no puede ser vacío")

    def test_agregar_apostador_validar_nombre_alfanumerico(self):
        mensaje = self.logica.validar_crear_editar_apostador("#-@£^")
        self.assertEqual(mensaje, "El nombre del apostador no es alfanumérico")

    def test_agregar_apostador_validar_nombre_repetido(self):
        apostador: Apostador = random.choice(self.apostadores)
        mensaje = self.logica.validar_crear_editar_apostador(apostador.nombre)
        self.assertEqual(mensaje, "Ya existe un apostador con este nombre")