import { useState } from "react";
function DisplayTodoList({ todoList, onDeleteTodoItem, onEditTodoItem }) {
    const [editingItemId, setEditingItemId] = useState(null);
    const [newContent, setNewContent] = useState("");

    const handleEdit = (itemId, currentContent) => {
        setEditingItemId(itemId);
        setNewContent(currentContent);
    };

    const saveEdit = () => {
        onEditTodoItem(editingItemId, newContent); // Call the function passed from App.js
        setEditingItemId(null); // Exit edit mode
    };

    if (todoList.length > 0) {
        return (
            <ul className="todo-list">
                {todoList.map((item) => (
                    <div className="todo-item-wrapper" key={item.id}>
                        {editingItemId === item.id ? (
                            <div>
                                <input 
                                    type="text" 
                                    value={newContent} 
                                    onChange={(e) => setNewContent(e.target.value)} 
                                />
                                <button onClick={saveEdit}>Save</button>
                                <button onClick={() => setEditingItemId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <li>{item.content}</li>
                                <button onClick={() => handleEdit(item.id, item.content)}>Edit</button>
                                <button onClick={() => onDeleteTodoItem(item.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </ul>
        );
    } else {
        return (
            <div className="empty-wrapper">
                <p>No task found</p>
            </div>
        );
    }
}

export default DisplayTodoList;
