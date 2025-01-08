import { useState } from "react";
import "./InputTodoItem.css";

function InputTodoItem({ onAddTodoItem }) {
    const [itemContent, setItemContent] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddClick = () => {
        if (itemContent.trim() === "") {
            setIsModalVisible(true);
        } else {
            onAddTodoItem(itemContent);
            setItemContent("");
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="input-container">
            <input
                type="text"
                name="todoItem"
                className="todo-input"
                placeholder="What's on your mind?"
                value={itemContent}
                onChange={(e) => setItemContent(e.target.value)}
            />
            <button className="btn btn-add" onClick={handleAddClick}>
                Add Task
            </button>

            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="modal-message">Empty task cannot be created</p>
                        <button className="btn btn-close" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InputTodoItem;
