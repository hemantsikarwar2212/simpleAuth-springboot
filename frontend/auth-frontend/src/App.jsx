import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "http://localhost:8080/auth";

  // Handle OAuth + Persist Login
  useEffect(() => {
    // OAuth token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);

      // Clean URL
      window.history.replaceState({}, document.title, "/");
    }

    // Persist login after refresh
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      setIsAuthenticated(true);
    }
  }, []);

  //  Handle Signup/Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(`${API}/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data);
        setIsAuthenticated(true);
      } else {
        await axios.post(`${API}/signup`, {
          email,
          password,
        });

        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  //  Logout
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  //  Dashboard UI
  if (isAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <h2>Welcome to Dashboard successfully logged in</h2>
          

          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  //  Login / Signup UI
  return (
    <div className="container">
      <div className="card">
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{isLogin ? "Login" : "Signup"}</button>
        </form>

        {/* ✅ Google OAuth Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/google";
          }}
        >
          Continue with Google
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default App;
