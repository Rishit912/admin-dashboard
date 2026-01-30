import React from 'react';

function UserCard({ name, role, company, onDelete, onEdit }) {
  return (
    <div style={{ 
      border: "1px solid rgba(148, 163, 184, 0.1)", 
      padding: "18px", 
      borderRadius: "12px", 
      background: "#1f2937",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.35)",
      transition: "all 0.3s"
    }}>
      <h2 style={{ margin: "0 0 10px 0", color: "#f1f5f9", fontSize: "1.05rem", fontWeight: 600 }}>{name}</h2>
      <p style={{ margin: "0 0 8px 0", color: "#cbd5f5", fontSize: "0.9rem" }}>Role: {role}</p>
      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Company: {company}</p>

      <div style={{ marginTop: "18px", display: "flex", gap: "14px" }}>
        {/* The New Edit Button */}
        <button 
          onClick={onEdit}
          style={{ padding: "12px 16px", background: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", height: "42px", fontWeight: 500, transition: "all 0.2s", boxSizing: "border-box" }}
        >
          Edit
        </button>

        {/* The Delete Button */}
        <button 
          onClick={onDelete} 
          style={{ padding: "12px 16px", background: "#ef4444", color: "#fecaca", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", height: "42px", fontWeight: 500, transition: "all 0.2s", boxSizing: "border-box" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default UserCard;