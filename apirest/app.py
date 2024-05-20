# -*- coding: utf-8 -*-
from flask import Flask,request, jsonify
from flask_cors import CORS

# config import
from config import app_config, app_active

config = app_config[app_active]


# db connect
from sqlalchemy import create_engine, text

db_connect = create_engine('mysql+mysqlconnector://root@localhost/fatec')
# db_connect = create_engine('mysql+mysqlconnector://admin:admin@192.168.13.236/fatec')

def create_app(config_name):
    app = Flask(__name__, template_folder='templates')
    
    CORS(app)
    
    app.secret_key = config.SECRET
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')

    
    # get-all
    @app.route('/monitoramento/', methods=['GET'])
    def get_all():
        conn = db_connect.connect()

        query = conn.execute(text('select * from monitoramento order by Id DESC'))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]

        return jsonify(result)
    
    @app.route('/monitoramento/last20', methods=['GET'])
    def get_twenty():
        conn = db_connect.connect()

        query = conn.execute(text('select * from monitoramento ORDER BY Id DESC LIMIT 20'))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]

        return jsonify(result)
    
    # get by dispositivo
    @app.route('/monitoramento/<string:dispositivo>', methods=["GET"])
    def get(dispositivo):
        conn = db_connect.connect()
        
        query = conn.execute(text("select * from monitoramento where dispositivo = '{0}' order by Id DESC".format(dispositivo)))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]

        return jsonify(result)
    
    # post
    @app.route('/monitoramento/', methods=['POST'])
    def post():
        conn = db_connect.connect()
        temperatura = request.json['temperatura']
        umidade = request.json['umidade']
        dispositivo = request.json['dispositivo']
        
        conn.execute(text("insert into monitoramento (temperatura, umidade, dispositivo) values ( '{0}', '{1}', '{2}')".format(temperatura, umidade, dispositivo)))
        
        conn.commit()
        
        query = conn.execute(text('select * from monitoramento order by Id DESC'))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
        
        return jsonify(result)

    # delete
    @app.route('/monitoramento/<int:id>', methods=['DELETE'])
    def delete(id):
        conn = db_connect.connect()

        query = conn.execute(text("delete from monitoramento where Id = {0}".format(id)))

        conn.commit()
        
        query = conn.execute(text('select * from monitoramento order by Id DESC'))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
        
        return jsonify(result)

    # put
    @app.route('/monitoramento/', methods=['PUT'])
    def put():
        conn = db_connect.connect()
        id = request.json['id']
        temperatura = request.json['temperatura']
        umidade = request.json['umidade']
        dispositivo = request.json['dispositivo']
        
        conn.execute(text("update monitoramento set temperatura = '{0}', umidade = '{1}', dispositivo = '{2}' where Id = {3}".format(temperatura, umidade, dispositivo, id)))
        
        conn.commit()
        
        query = conn.execute(text('select * from monitoramento order by Id DESC'))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
        
        return jsonify(result)
    
    return app