import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Save the token and notify App.jsx
        localStorage.setItem("token", data.token); 
        onLogin(); 
      } else {
        // FAIL: Show error message
        setError(data.error);
      }
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0f1115 0%, #1a1f2e 100%)" }}>
      <div style={{ background: "#1f2937", padding: "40px", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", width: "350px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#f1f5f9", fontSize: "1.5rem" }}>🔐 Admin Login</h2>
        
        {error && <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: "12px 14px", border: "1px solid rgba(148, 163, 184, 0.3)", borderRadius: "8px", background: "#0f172a", color: "#f1f5f9", fontSize: "0.95rem", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: "12px 14px", border: "1px solid rgba(148, 163, 184, 0.3)", borderRadius: "8px", background: "#0f172a", color: "#f1f5f9", fontSize: "0.95rem", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
          />
          <button type="submit" style={{ padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "600", transition: "all 0.2s" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;