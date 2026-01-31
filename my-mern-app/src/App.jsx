import React, { useState, useEffect } from 'react';
import UserCard from './components/UserCard';
import Login from './components/Login';
import { ToastContainer, toast } from 'react-toastify'; // 1. Import Toast
import 'react-toastify/dist/ReactToastify.css'; // 1. Import CSS

function App() {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", company: "" });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 2. Loading State
  const [showSettings, setShowSettings] = useState(false); // 3. Settings Toggle
  
  // Password Change State
  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "" });

  // --- INITIAL LOAD ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUsers();
    }
  }, []);

  // --- API FUNCTIONS ---
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    } catch (err) {
        toast.error("Failed to load users");
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchUsers();
    toast.success("Welcome back, Admin! 👋");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsers([]);
    toast.info("Logged out successfully");
  };

  // --- CRUD OPERATIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId ? `http://localhost:5000/api/users/${editingId}` : "http://localhost:5000/api/users";
    const method = editingId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
          method: method,
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (editingId) {
                setUsers(users.map(u => (u._id === editingId ? data : u)));
                toast.success("Employee Updated! ✏️");
            } else {
                setUsers([...users, data]);
                toast.success("New Talent Hired! 🚀");
            }
            setFormData({ name: "", role: "", company: "" });
            setEditingId(null);
        } else {
            toast.error(data.error || "Operation failed");
        }
    } catch (err) {
        toast.error("Server Error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, { 
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
            setUsers(users.filter(user => user._id !== id));
            toast.success("Employee terminated. 👋");
        } else {
            toast.error("Failed to delete");
        }
    } catch (err) {
        toast.error("Server Error");
    } finally {
        setIsLoading(false);
    }
  };

  // --- PASSWORD CHANGE FUNCTION ---
  const handleChangePassword = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
          const res = await fetch("http://localhost:5000/api/change-password", {
              method: "PUT",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(passData)
          });
          
          const data = await res.json();
          if (res.ok) {
              toast.success("Password Updated! Please login again.");
              setShowSettings(false);
              setPassData({ oldPassword: "", newPassword: "" });
              handleLogout(); // Force logout for security
          } else {
              toast.error(data.error);
          }
      } catch (err) {
          toast.error("Failed to update password");
      }
  };

  // --- RENDER ---
  if (!isAuthenticated) return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login onLogin={handleLogin} />
      </>
  );

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "1000px", margin: "0 auto" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
        <h1>👑 Flitcode Admin</h1>
        <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowSettings(!showSettings)} style={{ padding: "10px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                {showSettings ? "Close Settings" : "⚙️ Settings"}
            </button>
            <button onClick={handleLogout} style={{ padding: "10px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Logout
            </button>
        </div>
      </div>

      {/* SETTINGS MODAL (Conditional Render) */}
      {showSettings && (
          <div style={{ background: "#4e4e4e", padding: "20px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #ddd" }}>
              <h3>🔐 Change Admin Password</h3>
              <form onSubmit={handleChangePassword} style={{ display: "flex", gap: "10px", flexDirection: "column", maxWidth: "400px" }}>
                  <input type="password" placeholder="Old Password" value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} required style={{ padding: "10px" }} />
                  <input type="password" placeholder="New Password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required style={{ padding: "10px" }} />
                  <button type="submit" style={{ padding: "10px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Update Password</button>
              </form>
          </div>
      )}

      {/* HIRING FORM */}
      {!showSettings && (
        <div style={{ background: editingId ? "#91c3db" : "#4c5053", padding: "25px", borderRadius: "10px", marginBottom: "40px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? "✏️ Edit Employee" : "🚀 Onboard New Talent"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }} />
            <input name="role" placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }} />
            <input name="company" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }} />
            <button type="submit" disabled={isLoading} style={{ padding: "12px 25px", background: editingId ? "#1890ff" : "black", color: "white", border: "none", borderRadius: "5px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "Processing..." : (editingId ? "Update" : "Hire")}
            </button>
            {editingId && (
                <button onClick={() => { setEditingId(null); setFormData({name:"", role:"", company:""}) }} type="button" style={{ padding: "10px", cursor: "pointer", border: "none", background: "transparent", textDecoration: "underline" }}>Cancel</button>
            )}
            </form>
        </div>
      )}

      {/* TEAM GRID */}
      {isLoading && !users.length ? (
          <p style={{ textAlign: "center" }}>Loading Team...</p>
      ) : (
          <>
            <h2>Current Team ({users.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                {users.map(user => (
                <UserCard 
                    key={user._id} 
                    name={user.name} 
                    role={user.role} 
                    company={user.company}
                    onDelete={() => handleDelete(user._id)}
                    onEdit={() => { setEditingId(user._id); setFormData({ name: user.name, role: user.role, company: user.company }); window.scrollTo(0,0); }} 
                />
                ))}
            </div>
          </>
      )}
    </div>
  );
}

export default App;