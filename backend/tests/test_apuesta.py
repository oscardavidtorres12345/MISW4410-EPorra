import random
import unittest

from faker import Faker
from src.modelo.competidor import Competidor
from src.modelo.apostador import Apostador
from src.modelo.apuesta import Apuesta
from src.modelo.carrera import Carrera
from src.logica.Logica import Logica
from src.modelo.declarative_base import Session
from sqlalchemy import and_, func

class ApuestaTestCase(unittest.TestCase):
    def setUp(self):
        self.logica = Logica()
        self.session = Session()

        self.data_factory = Faker()

        Faker.seed(1000)

        self.carreras: list[Carrera] = []
        self.apostadores = []
        self.apuestas = []

        for _ in range(3):
            carrera = Carrera(
                nombre=self.data_factory.unique.name()
            )

            for _ in range(2):
                carrera.competidores.append(Competidor(nombre=self.data_factory.unique.name(), probabilidad=0.5, carrera=carrera))

            self.carreras.append(carrera)
            self.session.add(carrera)

        for _ in range(3):
            apostador = Apostador(
                nombre=self.data_factory.unique.name()
            )
            self.apostadores.append(apostador)
            self.session.add(apostador)

        self.session.commit()

        for _ in range(10):
            carrera_seleccionada = random.choice(self.carreras)
            competidor_seleccionado = random.choice(carrera_seleccionada.competidores)
            apuesta = Apuesta(
                valor=self.data_factory.random_int(1000, 5000),
                carrera=carrera_seleccionada,
                apostador=random.choice(self.apostadores),
                competidor=competidor_seleccionado
            )
            self.apuestas.append(apuesta)
            self.session.add(apuesta)

        self.session.commit()

    def tearDown(self):
        '''Abre la sesión'''
        self.session = Session()

        '''Consulta todas las carreras'''
        carreras = self.session.query(Carrera).all()

        '''Borra todas las carreras'''
        for carrera in carreras:
            self.session.delete(carrera)

        '''Consulta todos los apostadores'''
        apostadores = self.session.query(Apostador).all()

        '''Borra todas las carreras'''
        for apostador in apostadores:
            self.session.delete(apostador)

        self.session.commit()
        self.session.close()
    
    def test_listar_apuestas_por_carrera(self):
        carrera_seleccionada = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice += 1

        lista_apuestas = self.logica.dar_apuestas_carrera(indice)

        lista_apuestas_original = []
        for apuesta in self.apuestas:
            if apuesta.carrera.id == carrera_seleccionada.id:
                lista_apuestas_original.append(apuesta)

        self.assertEqual(len(lista_apuestas), len(lista_apuestas_original))
    
    def test_listar_apuestas_por_carrera_ordenada(self):
        carrera_seleccionada = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice += 1

        lista_apuestas = self.logica.dar_apuestas_carrera(indice)

        nombres_apostadores = []
        for apuesta in lista_apuestas:
            nombres_apostadores.append(apuesta['Apostador'])
        
        self.assertEqual(nombres_apostadores, sorted(nombres_apostadores))
    
    def test_agregar_apuesta_apostador_no_vacio(self):
        carrera_seleccionada = random.choice(self.carreras)
        valor_apuesta = self.data_factory.random_int(1000, 3000)
        competidor_seleccionado = random.choice(carrera_seleccionada.competidores)
        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador='', carrera=carrera_seleccionada, valor=valor_apuesta, competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'Debe seleccionar un apostador')

    def test_agregar_apuesta_valor_entero(self):
        apostador_seleccionado = random.choice(self.apostadores)
        carrera_seleccionada = random.choice(self.carreras)
        competidor_seleccionado = random.choice(carrera_seleccionada.competidores)
        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionado, carrera=carrera_seleccionada, valor='', competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'El valor ingresado debe ser un número entero mayor que 0')

        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionado, carrera=carrera_seleccionada, valor='PRUEBA', competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'El valor ingresado debe ser un número entero mayor que 0')

    def test_agregar_apuesta_valor_entero_positivo(self):
        apostador_seleccionado = random.choice(self.apostadores)
        carrera_seleccionada = random.choice(self.carreras)
        competidor_seleccionado = random.choice(carrera_seleccionada.competidores)
        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionado, carrera=carrera_seleccionada, valor=-1000, competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'El valor ingresado debe ser un número entero mayor que 0')

        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionado, carrera=carrera_seleccionada, valor=0, competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'El valor ingresado debe ser un número entero mayor que 0')

    def test_agregar_apuesta_carrera_no_vacio(self):
        carrera_seleccionada = random.choice(self.carreras)
        apostador_seleccionada = random.choice(self.apostadores)
        valor_apuesta = self.data_factory.random_int(1000, 3000)
        competidor_seleccionado = random.choice(carrera_seleccionada.competidores)
        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionada, carrera='', valor=valor_apuesta, competidor=competidor_seleccionado)
        self.assertEqual(mensaje_error, 'La apuesta debe estar relacionada a una carrera')

    def test_agregar_apuesta_competidor_no_vacio(self):
        carrera_seleccionada = random.choice(self.carreras)
        apostador_seleccionada = random.choice(self.apostadores)
        valor_apuesta = self.data_factory.random_int(1000, 3000)
        mensaje_error = self.logica.validar_crear_editar_apuesta(apostador=apostador_seleccionada, carrera=carrera_seleccionada, valor=valor_apuesta, competidor='')
        self.assertEqual(mensaje_error, 'Debe seleccionar un competidor')

    def test_agregar_apuesta_competidor(self):
        carrera_seleccionada: Carrera = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice += 1

        apostador_seleccionada: Apostador = random.choice(self.apostadores)
        valor_apuesta = self.data_factory.random_int(1000, 3000)
        competidor_seleccionado: Competidor = random.choice(carrera_seleccionada.competidores)
        
        self.logica.crear_apuesta(apostador=apostador_seleccionada.nombre, id_carrera=indice, valor=valor_apuesta, competidor=competidor_seleccionado.nombre)
        
        creado = self.session.query(func.count(Apuesta.id))\
            .filter(and_(
                Apuesta.carrera_id == carrera_seleccionada.id, 
                Apuesta.apostador_id == apostador_seleccionada.id,
                Apuesta.competidor_id == competidor_seleccionado.id, 
                Apuesta.valor == valor_apuesta
            ))\
            .scalar()
        
        self.assertGreater(creado, 0)
    
    def test_editar_apuesta(self):
        apuesta_seleccionada = random.choice(self.apuestas)

        carreras_list = self.logica.dar_carreras()
        indice_carrera = 0
        for carrera in carreras_list:
            if carrera['Id'] == apuesta_seleccionada.carrera.id:
                break
            indice_carrera += 1

        apuestas_list = self.logica.dar_apuestas_carrera(indice_carrera)
        indice_apuesta = 0
        for apuesta in apuestas_list:
            if apuesta['Id'] == apuesta_seleccionada.id:
                break
            indice_apuesta += 1
            
        valor_apuesta = self.data_factory.random_int(1000, 3000)
        competidor_seleccionado = random.choice(apuesta_seleccionada.carrera.competidores)
        apostador_seleccionado = random.choice(self.apostadores)

        self.logica.editar_apuesta(indice_apuesta, apostador_seleccionado.nombre, indice_carrera, valor_apuesta, competidor_seleccionado.nombre)
        
        editado = self.session.query(Apuesta).filter(Apuesta.id == apuesta_seleccionada.id).first()
        self.session.refresh(editado)

        self.assertEqual(editado.valor, valor_apuesta)
        self.assertEqual(editado.competidor.nombre, competidor_seleccionado.nombre)
        self.assertEqual(editado.apostador.nombre, apostador_seleccionado.nombre)