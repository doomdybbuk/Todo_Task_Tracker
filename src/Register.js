import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Register.css'; // Assuming you'll put the styles in a separate CSS file

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:5000/register", { username, password });
            alert("User registered successfully");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Error registering user");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2 className="register-title">Register</h2>
                <div className="input-group">
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Username" 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        className="input-field" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button className="register-button" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
