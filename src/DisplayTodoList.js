import { useState, useEffect } from "react";
import "./DisplayTodoList.css"; // Link to the external CSS file for styling

function DisplayTodoList({ todoList, onDeleteTodoItem, onEditTodoItem }) {
    const [editingItemId, setEditingItemId] = useState(null);
    const [newContent, setNewContent] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleEdit = (itemId, currentContent) => {
        setEditingItemId(itemId);
        setNewContent(currentContent);
    };

    const saveEdit = () => {
        onEditTodoItem(editingItemId, newContent);
        setEditingItemId(null);
    };

    const safeTodoList = todoList || [];

    return (
        <div className="todo-container">
            <h2 className="todo-greeting">Hi, {username}!</h2>

            {safeTodoList.length > 0 ? (
                <ul className="todo-list">
                    {safeTodoList.map((item) => (
                        <div className="todo-item-wrapper" key={item.id}>
                            {editingItemId === item.id ? (
                                <div className="todo-edit-wrapper">
                                    <input
                                        type="text"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="todo-input-edit"
                                    />
                                    <button className="btn btn-save" onClick={saveEdit}>
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-cancel"
                                        onClick={() => setEditingItemId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="todo-item">
                                    <li className="todo-content">{item.content}</li>
                                    <div className="todo-actions">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => handleEdit(item.id, item.content)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => onDeleteTodoItem(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </ul>
            ) : (
                <div className="empty-wrapper">
                    <p className="empty-message">No tasks found. Add your first task!</p>
                </div>
            )}
        </div>
    );
}

export default DisplayTodoList;
