from flask import Flask, request, jsonify
from flask_cors import CORS

from pymongo import MongoClient
from bson.objectid import ObjectId
from auth import app as auth_app
from config import *

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_app)
client = MongoClient(MONGODB_CONNECTION_STRING)
database = client[MONGODB_DATABASE_NAME]
items_collection = database[MONGODB_TODO_ITEMS_COLLECTION]

@app.get("/get_todo_items")
def get_todo_items():
    items_list = items_collection.find()
    items_list = [{"id": str(item["_id"]), "content": item["content"]} for item in items_list]

    return jsonify({
        "todoItems": items_list 
    })

@app.post("/add_todo_item")
def add_todo_item():
    item_content = request.json["item_content"]
    _id = items_collection.insert_one({"content": item_content})

    return jsonify({
        "item_id": str(_id.inserted_id)
    })

@app.post("/edit_todo_item")
def edit_todo_item():
    item_id = request.json["item_id"]
    new_content = request.json["new_content"]

    result = items_collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": {"content": new_content}},
    )   
    if result.modified_count > 0:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"message": "Item not found or content unchanged"}), 404

@app.post("/delete_todo_item")
def delete_todo_item():
    item_id = request.json["item_id"]
    items_collection.delete_one({"_id": ObjectId(item_id)})
    return {}
