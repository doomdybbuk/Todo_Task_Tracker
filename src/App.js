import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import TodoPage from "./TodoPage";

function App() {
    // Proper check: token in localStorage means user is "logged in"
    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected route to /todo: If not logged in, redirect to /login */}
                <Route 
                    path="/todo" 
                    element={
                        isAuthenticated() ? <TodoPage /> : <Navigate to="/login" />
                    } 
                />

                {/* Catch-all: redirect to /login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;