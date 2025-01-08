import { useState, useEffect } from "react";
import axios from "axios";
import DisplayTodoList from "./DisplayTodoList";
import InputTodoItem from "./InputTodoItem";

function TodoPage() {
    const [todoList, setTodoList] = useState([]);

    const token = localStorage.getItem("token");

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/get_todo_items", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setTodoList(response.data.todoItems); 
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []); // fetch on mount

    const handleAddTodoItem = async (content) => {
        try {
            await axios.post("http://localhost:5000/add_todo_item",
                { item_content: content },
                { headers: { Authorization: `Bearer ${token}` } } // Fixed the backticks
            );
            // refresh the list
            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const handleDeleteTodoItem = async (itemId) => {
        try {
            await axios.post("http://localhost:5000/delete_todo_item",
                { item_id: itemId },
                { headers: { Authorization: `Bearer ${token}` } } // Fixed the backticks
            );
            // refresh
            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleEditTodoItem = async (itemId, newContent) => {
        try {
            await axios.post("http://localhost:5000/edit_todo_item",
                { item_id: itemId, new_content: newContent },
                { headers: { Authorization: `Bearer ${token}` } } // Fixed the backticks
            );
            // refresh
            fetchTodos();
        } catch (error) {
            console.error("Error editing todo:", error);
        }
    };

    return (
        <div>
            <InputTodoItem onAddTodoItem={handleAddTodoItem} />
            <DisplayTodoList
                todoList={todoList}               // pass the array
                onDeleteTodoItem={handleDeleteTodoItem}
                onEditTodoItem={handleEditTodoItem}
            />
        </div>
    );
}

export default TodoPage;
