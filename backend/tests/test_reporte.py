import random
import unittest
from src.modelo.apuesta import Apuesta
from src.modelo.apostador import Apostador
from src.modelo.declarative_base import Session
from src.modelo.carrera import Carrera
from src.modelo.competidor import Competidor
from src.logica.Logica import Logica
from faker import Faker

class ReporteTestCase(unittest.TestCase):

    def setUp(self) -> None:
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

    def test_validar_reporte_ganador_carrera_terminada(self):
        carreras = self.logica.dar_carreras()
        self.logica.dar_reporte_ganancias(1, 0)
        carreras = self.logica.dar_carreras()
        self.assertFalse(carreras[1]['Abierta'])
        self.assertEqual(0, carreras[1]['Ganador'])

    def test_validar_reporte_ganador_validar_lista_ganancias(self):
        carrera_seleccionada = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice_carrera = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice_carrera += 1

        competidor_seleccionado: Competidor = random.choice(carrera_seleccionada.competidores)
        competidores_list = self.logica.dar_competidores_carrera(indice_carrera)
        indice_competidor = 0
        for competidor in competidores_list:
            if competidor['Id'] == competidor_seleccionado.id:
                break
            indice_competidor += 1

        result = self.logica.dar_reporte_ganancias(indice_carrera, indice_competidor)
        apuestas = carrera_seleccionada.apuestas

        if len(apuestas) > 0:
            lista_ganancias, ganancias_casa = result
            self.assertIsNotNone(lista_ganancias)
            self.assertIsNotNone(ganancias_casa)

            self.assertEqual(len(apuestas), len(lista_ganancias))
        else:
            self.assertIsNone(result)
    
    def test_validar_reporte_ganador_validar_lista_ganacias_apostador(self):
        carrera_seleccionada = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice_carrera = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice_carrera += 1

        competidor_seleccionado: Competidor = random.choice(carrera_seleccionada.competidores)
        competidores_list = self.logica.dar_competidores_carrera(indice_carrera)
        indice_competidor = 0
        for competidor in competidores_list:
            if competidor['Id'] == competidor_seleccionado.id:
                break
            indice_competidor += 1

        result = self.logica.dar_reporte_ganancias(indice_carrera, indice_competidor)
        apuestas = carrera_seleccionada.apuestas

        if len(apuestas) > 0:
            lista_ganancias, ganancias_casa = result
            self.assertEqual(len(apuestas), len(lista_ganancias))
            ganancias_apuestas =[]
            for apuesta in apuestas:
                if apuesta.competidor.id == competidor_seleccionado.id:
                    cuota = competidor_seleccionado.probabilidad/ (1 - competidor_seleccionado.probabilidad)
                    ganancia = apuesta.valor + (apuesta.valor / cuota)
                    ganancias_apuestas.append((apuesta.apostador.nombre, ganancia))
                else:
                    ganancias_apuestas.append((apuesta.apostador.nombre, 0))
            for ganancia in lista_ganancias:
                self.assertIn(ganancia, ganancias_apuestas)
            self.assertEqual(len(apuestas), len(lista_ganancias))

    def test_validar_reporte_ganador_validar_ganacias_casa(self):
        carrera_seleccionada = random.choice(self.carreras)
        carreras_list = self.logica.dar_carreras()
        indice_carrera = 0
        for carrera in carreras_list:
            if carrera['Id'] == carrera_seleccionada.id:
                break
            indice_carrera += 1

        competidor_seleccionado: Competidor = random.choice(carrera_seleccionada.competidores)
        competidores_list = self.logica.dar_competidores_carrera(indice_carrera)
        indice_competidor = 0
        for competidor in competidores_list:
            if competidor['Id'] == competidor_seleccionado.id:
                break
            indice_competidor += 1

        result = self.logica.dar_reporte_ganancias(indice_carrera, indice_competidor)
        apuestas: list[Apuesta] = carrera_seleccionada.apuestas

        if len(apuestas) > 0:
            _, ganancias_casa = result
            ganacias_total = 0
            total_pagado = 0
            for apuesta in apuestas:
                ganacias_total += apuesta.valor
                if apuesta.competidor.id == competidor_seleccionado.id:
                    cuota = competidor_seleccionado.probabilidad/ (1 - competidor_seleccionado.probabilidad)
                    total_pagado += apuesta.valor + (apuesta.valor / cuota)
            
            ganacias_total = ganacias_total - total_pagado
            self.assertEqual(ganancias_casa, ganacias_total)

