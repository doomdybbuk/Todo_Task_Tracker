from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from pymongo import MongoClient
import bcrypt
import os

auth_bp = Blueprint('auth', __name__)
jwt = JWTManager()

# MongoDB Configuration
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING", "mongodb://localhost:27017/")
MONGODB_DATABASE_NAME = os.getenv("MONGODB_DATABASE_NAME", "todo-app-database")
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client[MONGODB_DATABASE_NAME]
users_collection = db['users']

@auth_bp.route('/register', methods=["POST"])
def register():
    data = request.json
    username = data['username']
    password = data['password']

    if users_collection.find_one({"username": username}):
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    users_collection.insert_one({'username': username, 'password': hashed_password})
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=["POST"])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    user = users_collection.find_one({'username': username})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Invalid Credentials'}), 401

    # Return token and username so we can store both in localStorage
    token = create_access_token(identity=username)
    return jsonify({'token': token, 'username': username}), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Access Granted'}), 200