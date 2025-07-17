from modelo.apostador import Apostador
from modelo.apuesta import Apuesta
from modelo.competidor import Competidor
from modelo.carrera import Carrera
from logica.Fachada_EPorra import Fachada_EPorra
from sqlalchemy import func, and_
import re
from modelo.declarative_base import engine, Base, session

class Logica(Fachada_EPorra):

    def __init__(self):
        Base.metadata.create_all(engine)
        self.session = session
        #Este constructor contiene los datos falsos para probar la interfaz
        self.carreras = []
        self.apostadores = []
        self.session.commit()
        self.apuestas = [{'Apostador':'Pepe Pérez', 'Carrera':'Carrera 1', 'Valor':10, 'Competidor':'Juan Pablo Montoya'},\
                        {'Apostador':'Ana Andrade', 'Carrera':'Carrera 1', 'Valor':25, 'Competidor':'Michael Schumacher'},\
                        {'Apostador':'Aymara Castillo', 'Carrera':'Carrera 1', 'Valor':14, 'Competidor':'Juan Pablo Montoya'},\
                        {'Apostador':'Aymara Castillo', 'Carrera':'Carrera 2', 'Valor':45, 'Competidor':'Usain Bolt'}]
        self.ganancias = [{'Carrera':'Formula 1', 'Ganancias':[('Pepe Pérez',13),('Ana Andrade',0), ('Aymara Castillo',15)], 'Ganancias de la casa': 4},\
            {'Carrera':'Atletismo 100 m planos', 'Ganancias':[('Pepe Pérez',32),('Ana Andrade',12), ('Aymara Castillo',34)], 'Ganancias de la casa': -10}]

    def __dar_carrera_query(self):
        lista_carreras: list[Carrera] = self.session.query(Carrera).order_by(Carrera.nombre).all()
        return lista_carreras
    
    def dar_carreras(self):
        carreras: list[Carrera] = self.__dar_carrera_query()
        carreras_list = []
        
        for carrera in carreras:
            competidores: list[Competidor] = carrera.competidores
            competidores_list = []
            for competidor in competidores:
                competidor_dict = {
                    'Id': competidor.id,
                    'Nombre': competidor.nombre,
                    'Probabilidad': competidor.probabilidad
                }
                competidores_list.append(competidor_dict)
            
            carrera_dict = {
                'Id': carrera.id,
                'Nombre': carrera.nombre,
                'Competidores': competidores_list,
                'Abierta': not carrera.terminada,
                'Ganador': carrera.ganador
            }
            
            carreras_list.append(carrera_dict)
        self.carreras = carreras_list
        return carreras_list

    def dar_carrera(self, id_carrera):
        return self.carreras[id_carrera].copy()
        
    def crear_carrera(self, nombre):
        self.session.add(Carrera(nombre=nombre, terminada=False))
        self.session.commit()

    def editar_carrera(self, id, nombre):
        self.carreras[id]['Nombre'] = nombre

    def validar_crear_editar_carrera(self, nombre, competidores):
        if nombre == "":
            return "El nombre de la carrera no puede ser vacío"
        if not re.match("^[a-zA-Z0-9 ]*$", nombre):
            return "El nombre de la carrera no es alfanumérico"
        
        carrera_existente = self.session.query(func.count(Carrera.id)).filter(Carrera.nombre == nombre).scalar()
        if carrera_existente > 0:
            return "Ya existe una carrera con este nombre"
        if len(competidores) == 0:
            return "La carrera debe tener al menos un competidor"
        
        total_probabilidades = 0
        for competidor in competidores:
            if competidor['Nombre'] == "":
                return "No debe haber competidores con nombre vacío"
            if not re.match("^[a-zA-Z0-9 ]*$", competidor['Nombre']):
                return "No debe haber competidores con nombre con caracteres no alfanuméricos"
            if competidor['Probabilidad'] < 0 or competidor['Probabilidad'] > 1:
                return "No debe haber competidores con probabilidad mayor que 1 y menor que 0"
            total_probabilidades += competidor['Probabilidad']
        
        if total_probabilidades > 1:
            return "La suma de las probabilidades de los competidores debe ser 1"
        
        return ""
    def terminar_carrera(self, id, ganador):
        carrera = self.__dar_carrera_query()[id]
        if carrera.terminada:
            return
        if ganador < 0 or ganador >= len(carrera.competidores):
            return
        carrera.ganador = ganador
        carrera.terminada = True
        self.session.commit()

    def eliminar_carrera(self, id):
        carrera = self.__dar_carrera_query()[id]
        if len(carrera.apuestas) > 0:
            return "No se puede eliminar una carrera con apuestas asociadas"
        if carrera.terminada:
            return "No se puede eliminar una carrera terminada"

        self.session.delete(carrera)
        self.session.commit()

        return ""

    def dar_apostadores(self):
        apostadores: list[Apostador] = self.session.query(Apostador).order_by(Apostador.nombre).all()
        apostadores_list = []
        
        for apostador in apostadores:
            apostador_dict = {
                'Nombre': apostador.nombre,
            }
            
            apostadores_list.append(apostador_dict)
        return apostadores_list

    def aniadir_apostador(self, nombre):
        self.session.add(Apostador(nombre=nombre))
        self.session.commit()
    
    def editar_apostador(self, id, nombre):
        self.apostadores[id]['Nombre'] = nombre
    
    def validar_crear_editar_apostador(self, nombre):
        if nombre == "":
            return "El nombre del apostador no puede ser vacío"
        
        if not re.match("^[a-zA-Z0-9 ]*$", nombre):
            return "El nombre del apostador no es alfanumérico"
        
        apostador_existente = self.session.query(func.count(Apostador.id)).filter(Apostador.nombre == nombre).scalar()
        if apostador_existente > 0:
            return "Ya existe un apostador con este nombre"

        return ""
    
    def eliminar_apostador(self, id):
        del self.apostadores[id]

    def dar_competidores_carrera(self, id):
        return self.carreras[id]['Competidores'].copy()

    def dar_competidor(self, id_carrera, id_competidor):
        return self.carreras[id_carrera]['Competidores'][id_competidor].copy()

    def aniadir_competidor(self, id, nombre, probabilidad):
        carrera = self.session.query(Carrera).all()[id]
        carrera.competidores.append(Competidor(nombre=nombre, probabilidad=probabilidad))
        self.session.commit()

    def editar_competidor(self, id_carrera, id_competidor, nombre, probabilidad):
        self.carreras[id_carrera]['Competidores'][id_competidor]['Nombre']=nombre
        self.carreras[id_carrera]['Competidores'][id_competidor]['Probabilidad']=probabilidad
    
    def eliminar_competidor(self, id_carrera, id_competidor):
        del self.carreras[id_carrera]['Competidores'][id_competidor]

    def dar_apuestas_carrera(self, id_carrera):
        apuestas = self.session.query(Apuesta)\
            .join(Apuesta.apostador)\
            .join(Apuesta.competidor)\
            .filter(Apuesta.carrera_id == self.carreras[id_carrera]['Id'])\
            .order_by(Apostador.nombre)\
            .all()
        
        lista_apuestas = []
        for apuesta in apuestas:
            lista_apuestas.append({
                'Id': apuesta.id,
                'Apostador': apuesta.apostador.nombre,
                'Carrera': apuesta.carrera.nombre,
                'Valor': apuesta.valor,
                'Competidor': apuesta.competidor.nombre,
            })

        return lista_apuestas

    def dar_apuesta(self, id_carrera, id_apuesta):
        return self.dar_apuestas_carrera(id_carrera)[id_apuesta].copy()

    def crear_apuesta(self, apostador, id_carrera, valor, competidor):
        r_apostador = self.session.query(Apostador).filter(Apostador.nombre == apostador).first()
        r_carrera = self.session.query(Carrera).filter(Carrera.id == self.carreras[id_carrera]['Id']).first()
        r_competidor = self.session.query(Competidor).filter(and_(Competidor.carrera_id == self.carreras[id_carrera]['Id'], Competidor.nombre == competidor)).first()
        self.session.add(Apuesta(carrera=r_carrera, apostador= r_apostador, competidor=r_competidor, valor=valor))
        self.session.commit()

    def editar_apuesta(self, id_apuesta, apostador, carrera, valor, competidor):
        apuestas_list = self.dar_apuestas_carrera(carrera)

        apuesta: Apuesta = self.session.query(Apuesta).filter(Apuesta.id == apuestas_list[id_apuesta]["Id"]).first()

        r_apostador = self.session.query(Apostador).filter(Apostador.nombre == apostador).first()
        r_carrera = self.session.query(Carrera).filter(Carrera.id == self.carreras[carrera]['Id']).first()
        r_competidor = self.session.query(Competidor).filter(and_(
            Competidor.carrera_id == r_carrera.id,
            Competidor.nombre == competidor
        )).first()

        apuesta.apostador_id = r_apostador.id
        apuesta.carrera_id = r_carrera.id
        apuesta.competidor_id = r_competidor.id
        apuesta.valor = valor

        self.session.commit()

    def validar_crear_editar_apuesta(self, apostador, carrera, valor, competidor):
        if apostador == "":
            return "Debe seleccionar un apostador"
        if carrera == "":
            return "La apuesta debe estar relacionada a una carrera"
        try:
            valor_int = int(valor)
            if valor_int <= 0:
                return "El valor ingresado debe ser un número entero mayor que 0"
        except ValueError:
            return "El valor ingresado debe ser un número entero mayor que 0"
        
        if competidor == "":
            return "Debe seleccionar un competidor"
    
        return ""

    def eliminar_apuesta(self, id_carrera, id_apuesta):
        nombre_carrera =self.carreras[id_carrera]['Nombre']
        i = 0
        id = 0
        while i < len(self.apuestas):
            if self.apuestas[i]['Carrera'] == nombre_carrera:
                if id == id_apuesta:
                    self.apuestas.pop(i)
                    return True
                else:
                    id+=1
            i+=1
        
        return False
                

        del self.apuesta[id_apuesta]

    def dar_reporte_ganancias(self, id_carrera, id_competidor):
        self.terminar_carrera(id_carrera, id_competidor)
        carrera: Carrera = self.__dar_carrera_query()[id_carrera]
        competidor = self.dar_competidores_carrera(id_carrera)[id_competidor]
        apuestas_carrera: list[Apuesta] = carrera.apuestas
        ganancias = { 'Carrera': carrera.nombre, 'Ganancias': [], 'Ganancias de la casa': 0 }
        total_pagado = 0
        if len(apuestas_carrera) > 0:
            for apuesta in apuestas_carrera:
                if apuesta.competidor_id == competidor['Id']:
                    cuota = competidor['Probabilidad']/ (1 - competidor['Probabilidad'])
                    ganancia = apuesta.valor + (apuesta.valor / cuota)
                    ganancias['Ganancias'].append((apuesta.apostador.nombre, ganancia))
                    total_pagado += ganancia
                else: 
                    ganancias['Ganancias'].append((apuesta.apostador.nombre, 0))
                ganancias['Ganancias de la casa'] += apuesta.valor
            ganancias['Ganancias de la casa'] = ganancias['Ganancias de la casa'] - total_pagado
        return ganancias['Ganancias'], ganancias['Ganancias de la casa']
