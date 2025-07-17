#Archivo de ejemplo para las pruebas unitarias.
#El nombre del archivo debe iniciar con el prefijo test_

#Importar unittest para crear las pruebas unitarias
import unittest

#Importar la clase Logica_mock para utilizarla en las pruebas
from src.logica.Logica_mock import Logica_mock

#Clase de ejemplo, debe tener un nombre que termina con el sufijo TestCase, y conservar la herencia
class ExampleTestCase(unittest.TestCase):

	#Instancia el atributo logica para cada prueba
	def setUp(self):
		self.logica = Logica_mock()

    #Prueba para verificar que el caso funciona. El nombre del método usa el prefijo test_
	def test_something_1(self):
		apostadores = self.logica.dar_apostadores()
		self.assertEqual(apostadores[1]['Nombre'], "Ana Andrade")
		
    #Prueba para verificar que Jenkins toma el caso
	def test_something_2(self):
		apostadores = self.logica.dar_apostadores()
		self.assertEqual(apostadores[0]['Nombre'], "Pepe Pérez")		