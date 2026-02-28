"use client";

import { useState } from "react";

const dummyUsers = [
    { id: "1", name: "Rina Sari", email: "rina@gmail.com", role: "super_user", active: true, joined: "1 Feb 2026" },
    { id: "2", name: "Budi Santoso", email: "budi@gmail.com", role: "user", active: true, joined: "15 Feb 2026" },
    { id: "3", name: "Dewi Lestari", email: "dewi@gmail.com", role: "user", active: false, joined: "10 Feb 2026" },
];

const dummyInvitations = [
    { id: "1", email: "joko@gmail.com", role: "user", date: "27 Feb 2026" },
];

export default function UsersPage() {
    const [showInvite, setShowInvite] = useState(false);

    return (
        <div>
            <div className="page-header">
                <h1>Users</h1>
                <button className="btn btn-primary" onClick={() => setShowInvite(true)}>✉ Invite User</button>
            </div>

            <div className="card" style={{ overflow: "hidden", marginBottom: "20px" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyUsers.map((user) => (
                            <tr key={user.id}>
                                <td><span className={`user-status ${user.active ? "active" : "inactive"}`} /></td>
                                <td>
                                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                                    {!user.active && <span style={{ color: "var(--admin-text-muted)", fontSize: "12px" }}> (inactive)</span>}
                                    <div className="row-actions">
                                        <button>Edit</button>
                                        {user.role !== "super_user" && (
                                            <>
                                                <span className="row-actions-sep">|</span>
                                                <button className="danger">{user.active ? "Deactivate" : "Activate"}</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === "super_user" ? "badge-published" : "badge-draft"}`}>
                                        {user.role === "super_user" ? "Super User" : "User"}
                                    </span>
                                </td>
                                <td>{user.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pending Invitations */}
            <div className="card">
                <div className="card-header"><h2>Pending Invitations</h2></div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Invited</th>
                                <th style={{ width: "100px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyInvitations.map((inv) => (
                                <tr key={inv.id}>
                                    <td>✉ {inv.email}</td>
                                    <td>{inv.role === "super_user" ? "Super User" : "User"}</td>
                                    <td>{inv.date}</td>
                                    <td><button className="btn btn-danger" style={{ fontSize: "12px", padding: "2px 8px" }}>Revoke</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInvite && (
                <div className="modal-overlay" onClick={() => setShowInvite(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Invite User</h2>
                            <button className="modal-close" onClick={() => setShowInvite(false)}>×</button>
                        </div>
                        <div className="form-field">
                            <label>Email Address</label>
                            <input type="email" placeholder="user@gmail.com" />
                        </div>
                        <div className="form-field">
                            <label>Role</label>
                            <select>
                                <option value="user">User</option>
                                <option value="super_user">Super User</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowInvite(false)}>Cancel</button>
                            <button className="btn btn-primary">Send Invitation</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
