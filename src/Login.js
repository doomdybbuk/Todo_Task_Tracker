import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Optional styling

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // POST to /auth/login because of the blueprint prefix
            const response = await axios.post("http://localhost:5000/auth/login", {
                username,
                password
            });
            // Store token & username in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            // Redirect to /todo after successful login
            navigate("/todo");
        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Login</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;