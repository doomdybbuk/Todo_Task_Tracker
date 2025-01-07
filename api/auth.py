from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from pymongo import MongoClient
import bcrypt
from config import MONGODB_CONNECTION_STRING, MONGODB_DATABASE_NAME

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = '2b4976b139c935f72cb831a17e478c6d8627d990d171bd90a1ae28881ee15e6e6a0a1799ba2aec47504d21927e818a9d4142740c882fc6f467c409a63a0bb91f79f4109142cc2f088b3ec89023f4c1d2e66e99b15f7fc55c5362bc09c382c7f06b77fe04f3f48bf8d9e5dce64d8f54aa8c772b7e008a1d8ee340c34dc803a9d0aef79e9671bb205377e5cb804317ad7ec6dafda642db0f07741303784505d1f4767237b678c7b528393a509929fcefa22a6e2869ff2e39c3164a5d1686330f494b0fca61bc6c6a386e4003f1e1cd5e9e474091b253dea05ad10bf93f20b897394747730d80b17e4219be9877625fe28cb6323403e83e1bd72d10e933119b5b95'
jtw = JWTManager(app)

client = MongoClient(MONGODB_CONNECTION_STRING)
db = client[MONGODB_DATABASE_NAME]
users_collection = db['users']


@app.route('/register',methods=["POST"])
def register():
    data = request.json
    username = data['username']
    password = data['password']

    if users_collection.find_one({"username":username}):
        return jsonify({'message':'Username already exists'}), 400
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({'username':username, 'password':hashed_password})
    return jsonify({'message':'User registered sucessfully'}), 201

@app.route('/login', methods=["POST"])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Find user in database
    user = users_collection.find_one({'username': username})
    
    print("Username:", username)
    print("Password entered:", password)
    print("User from DB:", user)

    # Check if user exists and if password matches
    if not user:
        return jsonify({'message': 'Invalid Credentials - User not found'}), 401
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        print("Password mismatch")
        return jsonify({'message': 'Invalid Credentials - Password mismatch'}), 401

    # Generate JWT token
    token = create_access_token(identity=username)
    print("Generated Token:", token)
    return jsonify({'token': token}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Access Granted'}), 200