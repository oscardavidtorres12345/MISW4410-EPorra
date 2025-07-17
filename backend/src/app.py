from flask import Flask, jsonify, request
from flask_cors import CORS
from logica.Logica import Logica

# Constants for messages
ERROR_CREAR_CARRERA = 'Error al crear la carrera'
ERROR_OBTENER_CARRERAS = 'Error al obtener las carreras'
ERROR_VALIDACION = 'Error de validación'
SUCCESS_CARRERA_CREADA = 'Carrera creada exitosamente'
SUCCESS_CARRERAS_OBTENIDAS = 'Carreras obtenidas exitosamente'
ERROR_JSON_REQUERIDO = 'No se recibió información JSON'
ERROR_NOMBRE_REQUERIDO = 'El nombre de la carrera es requerido'

app = Flask(__name__)
CORS(app)
logica = Logica()

@app.route('/carreras', methods=['GET'])
def obtener_carreras():
    """
    Endpoint para obtener todas las carreras
    Returns:
        JSON: Lista de carreras con sus competidores
    """
    try:
        carreras = logica.dar_carreras()
        return jsonify({
            'success': True,
            'data': carreras,
            'message': SUCCESS_CARRERAS_OBTENIDAS
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': ERROR_OBTENER_CARRERAS
        }), 500

@app.route('/carreras', methods=['POST'])
def crear_carrera():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': ERROR_JSON_REQUERIDO,
                'message': ERROR_CREAR_CARRERA
            }), 400
        
        nombre = data.get('nombre', '')
        competidores = data.get('competidores', [])
        
        if not nombre:
            return jsonify({
                'success': False,
                'error': ERROR_NOMBRE_REQUERIDO,
                'message': ERROR_CREAR_CARRERA
            }), 400
        
        error_validacion = logica.validar_crear_editar_carrera(nombre, competidores)
        if error_validacion:
            return jsonify({
                'success': False,
                'error': error_validacion,
                'message': ERROR_VALIDACION
            }), 400
        
        logica.crear_carrera(nombre)
        
        carreras = logica.dar_carreras()
        nueva_carrera = next((c for c in carreras if c['Nombre'] == nombre), None)
        
        if nueva_carrera and competidores:
            for competidor in competidores:
                logica.aniadir_competidor(
                    carreras.index(nueva_carrera),
                    competidor['Nombre'],
                    competidor['Probabilidad']
                )
        
        return jsonify({
            'success': True,
            'data': nueva_carrera,
            'message': SUCCESS_CARRERA_CREADA
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': ERROR_CREAR_CARRERA
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001)