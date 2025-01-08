from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from auth import auth_bp, jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

app = Flask(__name__)

# Enable CORS (adjust origins as needed for your frontend)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
jwt.init_app(app)

# MongoDB Configuration
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING", "mongodb://localhost:27017/")
MONGODB_DATABASE_NAME = os.getenv("MONGODB_DATABASE_NAME", "todo-app-database")
MONGODB_TODO_ITEMS_COLLECTION = os.getenv("MONGODB_TODO_ITEMS_COLLECTION", "todoItems")

client = MongoClient(MONGODB_CONNECTION_STRING)
db = client[MONGODB_DATABASE_NAME]
items_collection = db[MONGODB_TODO_ITEMS_COLLECTION]

# Register Blueprint with prefix /auth
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route("/get_todo_items", methods=["GET"])
@jwt_required()
def get_todo_items():
    try:
        current_user = get_jwt_identity()  # this is the username
        # Fetch only items that belong to this user
        items_list = items_collection.find({"username": current_user})
        items_list = [
            {"id": str(item["_id"]), "content": item["content"]} 
            for item in items_list
        ]
        return jsonify({"todoItems": items_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_todo_item", methods=["POST"])
@jwt_required()
def add_todo_item():
    try:
        current_user = get_jwt_identity()
        item_content = request.json["item_content"]
        _id = items_collection.insert_one({
            "content": item_content,
            "username": current_user
        })
        return jsonify({"item_id": str(_id.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/edit_todo_item", methods=["POST"])
@jwt_required()
def edit_todo_item():
    try:
        current_user = get_jwt_identity()
        item_id = request.json["item_id"]
        new_content = request.json["new_content"]

        result = items_collection.update_one(
            {"_id": ObjectId(item_id), "username": current_user},
            {"$set": {"content": new_content}},
        )
        if result.modified_count > 0:
            return jsonify({"message": "Item updated successfully"}), 200
        else:
            return jsonify({"message": "Item not found or content unchanged"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_todo_item", methods=["POST"])
@jwt_required()
def delete_todo_item():
    try:
        current_user = get_jwt_identity()
        item_id = request.json["item_id"]
        items_collection.delete_one({"_id": ObjectId(item_id), "username": current_user})
        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)