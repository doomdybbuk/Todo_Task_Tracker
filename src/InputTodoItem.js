// 
import { useState } from "react";

function InputTodoItem({ onAddTodoItem }) {
    const [itemContent, setItemContent] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddClick = () => {
        if (itemContent.trim() === "") {
            setIsModalVisible(true); // Show modal when input is empty
        } else {
            onAddTodoItem(itemContent);
            setItemContent("");
        }
    };

    const closeModal = () => {
        setIsModalVisible(false); // Hide modal
    };

    return (
        <div className="input-wrapper">
            <input 
                type="text"
                name="todoItem"
                placeholder="Create a new todo item"
                value={itemContent}
                onChange={(e) => {
                    setItemContent(e.target.value);
                }}
            />
            <button 
                className="add-button" 
                onClick={handleAddClick}
            >
                Add
            </button>

            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Empty task cannot be created</p>
                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InputTodoItem;
