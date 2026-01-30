import React, { useState, useEffect } from 'react'
import UserCard from './components/UserCard'

function App() {
  const [users, setUsers] = useState([])
  
  // FORM STATE
  const [formData, setFormData] = useState({ name: "", role: "", company: "" })

  // NEW: State to track if we are editing (stores the ID of the user being edited)
  const [editingId, setEditingId] = useState(null)

  // Fetch users on load
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // NEW: Function to fill the form when "Edit" is clicked
  const handleEdit = (user) => {
    setEditingId(user._id); // Switch to Edit Mode
    setFormData({ name: user.name, role: user.role, company: user.company }); // Fill inputs
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (editingId) {
      // --- UPDATE MODE (PUT) ---
      try {
        const response = await fetch(`http://localhost:5000/api/users/${editingId}`, {
          method: "PUT", // Note: PUT
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        
        const updatedUser = await response.json();
        
        // Update the list logic: Keep others same, replace the edited one
        setUsers(users.map(user => (user._id === editingId ? updatedUser : user)));
        
        // Reset Logic
        setEditingId(null); // Exit Edit Mode
        setFormData({ name: "", role: "", company: "" });

      } catch (error) {
        console.error("Error updating:", error);
      }
    } else {
      // --- CREATE MODE (POST) ---
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setFormData({ name: "", role: "", company: "" });
      } catch (error) {
        console.error("Error adding:", error);
      }
    }
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div style={{ 
      padding: "30px 20px", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      color: "#e5e7eb",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1115 0%, #1a1f2e 100%)",
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", gap: "28px" }}>
        <h1 style={{ 
          fontSize: "2rem",
          margin: 0,
          color: "#f1f5f9",
          fontWeight: 700,
          letterSpacing: "-0.5px"
        }}>Admin Portal</h1>
        
        <div style={{ 
          background: editingId ? "#1a2332" : "#1f2937",
          padding: "24px", 
          borderRadius: "14px", 
          border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          width: "100%",
          boxSizing: "border-box"
        }}>
        {/* Change Title based on Mode */}
        <h3 style={{ margin: "0 0 16px 0", color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 600 }}>
          {editingId ? "✏️ Edit Employee" : "🚀 Onboard New Talent"}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", boxSizing: "border-box" }}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.3)", outline: "none", width: "100%", height: "44px", lineHeight: "24px", background: "#0f172a", color: "#f1f5f9", fontSize: "0.95rem", fontFamily: "system-ui, -apple-system, sans-serif", transition: "all 0.2s", boxSizing: "border-box" }} />
          <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.3)", outline: "none", width: "100%", height: "44px", lineHeight: "24px", background: "#0f172a", color: "#f1f5f9", fontSize: "0.95rem", fontFamily: "system-ui, -apple-system, sans-serif", transition: "all 0.2s", boxSizing: "border-box" }} />
          <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} required style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.3)", outline: "none", width: "100%", height: "44px", lineHeight: "24px", background: "#0f172a", color: "#f1f5f9", fontSize: "0.95rem", fontFamily: "system-ui, -apple-system, sans-serif", transition: "all 0.2s", boxSizing: "border-box" }} />
          
          {/* Change Button Color and Text based on Mode */}
          <button type="submit" style={{ padding: "14px 16px", background: editingId ? "#3b82f6" : "#10b981", color: "#ffffff", border: "none", borderRadius: "10px", cursor: "pointer", width: "100%", height: "52px", fontSize: "0.95rem", fontWeight: 600, transition: "all 0.2s", boxSizing: "border-box" }}>
            {editingId ? "Update" : "Hire"}
          </button>
          
          {/* Cancel Button (Only shows when editing) */}
          {editingId && (
            <button onClick={() => { setEditingId(null); setFormData({name:"", role:"", company:""}) }} type="button" style={{ padding: "14px 16px", cursor: "pointer", borderRadius: "10px", border: "1px solid rgba(148, 163, 184, 0.2)", background: "#0f172a", color: "#e5e7eb", width: "100%", height: "52px", fontSize: "0.95rem", boxSizing: "border-box" }}>
              Cancel
            </button>
          )}
        </form>
      </div>

        <h2 style={{ color: "#f1f5f9", fontSize: "1.1rem", margin: 0, fontWeight: 600 }}>
          Current Team ({users.length})
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px", width: "100%" }}>
          {users.map(user => (
            <UserCard 
              key={user._id} 
              name={user.name} 
              role={user.role} 
              company={user.company}
              onDelete={() => handleDelete(user._id)}
              // Pass the Edit function down
              onEdit={() => handleEdit(user)} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App