import random
import unittest
from faker import Faker
from src.modelo.carrera import Carrera
from src.modelo.competidor import Competidor
from src.logica.Logica import Logica
from src.modelo.declarative_base import Session

class CarreraTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.logica = Logica()
        self.session = Session()
        self.datafactory = Faker()

        self.carreras = [
            Carrera(nombre=self.datafactory.word(), terminada=False) for _ in range(5)
        ]

        for carrera in self.carreras:
            carrera.competidores = [
                Competidor(
                    nombre=self.datafactory.name(),
                    probabilidad=random.uniform(0, 1),
                    carrera=carrera
                ) for _ in range(2)
            ]

        self.session.add_all(self.carreras)
        self.session.commit()

    def tearDown(self):
        carreras = self.session.query(Carrera).all()

        '''Borra todas las carreras'''
        for carrera in carreras:
            self.session.delete(carrera)

        self.session.commit()
        self.session.close()

    def test_listar_carreras(self):
        carreras = self.logica.dar_carreras()
        self.assertEqual(len(carreras), 5)

    def test_listar_carreras_alfabeticamente(self):
        actual_result = self.logica.dar_carreras()
        expected_result = sorted([
            {
                'Id': carrera.id,
                'Nombre': carrera.nombre,
                'Competidores': [
                    {'Id': comp.id, 'Nombre': comp.nombre, 'Probabilidad': comp.probabilidad}
                    for comp in carrera.competidores
                ],
                'Abierta': not carrera.terminada,
                'Ganador': None
            } for carrera in self.carreras
        ], key=lambda x: x['Nombre'])

        self.assertEqual(len(expected_result), len(actual_result))
        for expected, actual in zip(expected_result, actual_result):
            self.assertEqual(expected['Id'], actual['Id'])
            self.assertEqual(expected['Nombre'], actual['Nombre'])
            self.assertEqual(expected['Abierta'], actual['Abierta'])
            self.assertEqual(expected['Ganador'], actual['Ganador'])
            self.assertEqual(len(expected['Competidores']), len(actual['Competidores']))
            for exp_comp, act_comp in zip(expected['Competidores'], actual['Competidores']):
                self.assertEqual(exp_comp['Id'], act_comp['Id'])
                self.assertEqual(exp_comp['Nombre'], act_comp['Nombre'])
                self.assertEqual(exp_comp['Probabilidad'], act_comp['Probabilidad'])

        self.assertEqual(actual_result, expected_result)

    def test_agregar_carrera_validar_nombre_no_vacio(self):
        validacion = self.logica.validar_crear_editar_carrera('', [])
        self.assertEqual(validacion, 'El nombre de la carrera no puede ser vacío')

    def test_agregar_carrera_validar_nombre_alfanumerico(self):
        validacion = self.logica.validar_crear_editar_carrera('#-@£^`', [])
        self.assertEqual(validacion, 'El nombre de la carrera no es alfanumérico')

    def test_agregar_carrera_validar_nombre_duplicado(self):
        validacion = self.logica.validar_crear_editar_carrera(self.carreras[0].nombre, [])
        self.assertEqual(validacion, 'Ya existe una carrera con este nombre')

    def test_agregar_carrera_validar_competidores(self):
        validacion = self.logica.validar_crear_editar_carrera('Nueva Carrera', [])
        self.assertEqual(validacion, 'La carrera debe tener al menos un competidor')

    def test_agregar_carrera(self):
        nombre_carrera = self.datafactory.word()
        self.logica.crear_carrera(nombre_carrera)
        carreras = self.logica.dar_carreras()
        carrera_creada = next(carrera for carrera in carreras if carrera['Nombre'] == nombre_carrera)
        self.assertEqual(carrera_creada['Nombre'], nombre_carrera)
        self.assertEqual(carrera_creada['Competidores'], [])
        self.assertEqual(carrera_creada['Abierta'], True)

    def test_terminar_carrera_validar_ganador_sea_competidor(self):
        carreras = self.logica.dar_carreras()
        carrera_seleccionada = random.choice(carreras)
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_seleccionada['Id'])
        self.logica.terminar_carrera(indice, 2)
        self.assertTrue(carrera_seleccionada['Abierta'])
        self.assertIsNone(carrera_seleccionada['Ganador'])

    def test_terminar_carrera_validar_carrera_no_terminada_no_cambiar_ganador(self):
        carreras = self.logica.dar_carreras()
        carrera_seleccionada = random.choice(carreras)
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_seleccionada['Id'])
        self.logica.terminar_carrera(indice, 1)
        self.logica.terminar_carrera(indice, 0)
        carreras = self.logica.dar_carreras()
        self.assertFalse(carreras[indice]['Abierta'])
        self.assertEqual(1, carreras[indice]['Ganador'])

    def test_terminar_carrera(self):
        carreras = self.logica.dar_carreras()
        carrera_seleccionada = random.choice(carreras)
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_seleccionada['Id'])
        self.logica.terminar_carrera(indice, 0)
        carreras = self.logica.dar_carreras()
        self.assertEqual(0, carreras[indice]['Ganador'])
        self.assertFalse(carreras[indice]['Abierta'])

    def test_eliminar_carrera_con_apuestas(self):
        carreras = self.logica.dar_carreras()
        carrera_id = random.choice(carreras)['Id']
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_id)
        self.logica.crear_apuesta('Apostador', indice, 1000, 0)
        resultado = self.logica.eliminar_carrera(indice)
        carreras = self.logica.dar_carreras()
        self.assertEqual(len(carreras), 5)
        self.assertEqual(resultado, 'No se puede eliminar una carrera con apuestas asociadas')

    def test_eliminar_carrera_no_terminada(self):
        carreras = self.logica.dar_carreras()
        carrera_id = random.choice(carreras)['Id']
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_id)
        self.logica.terminar_carrera(indice, 0)
        resultado = self.logica.eliminar_carrera(indice)
        carreras = self.logica.dar_carreras()
        self.assertEqual(len(carreras), 5)
        self.assertEqual(resultado, 'No se puede eliminar una carrera terminada')

    def test_eliminar_carrera(self):
        carreras = self.logica.dar_carreras()
        carrera_id = random.choice(carreras)['Id']
        indice = next(i for i, carrera in enumerate(carreras) if carrera['Id'] == carrera_id)
        resultado = self.logica.eliminar_carrera(indice)
        carreras = self.logica.dar_carreras()
        competidores_bd = self.session.query(Competidor).filter(Competidor.carrera_id == carrera_id).all()
        self.assertEqual(len(carreras), 4)
        self.assertEqual(resultado, '')
        self.assertEqual(len(competidores_bd), 0)
