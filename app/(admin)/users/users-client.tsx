"use client";

import { useState, useTransition } from "react";
import { inviteUser, revokeInvite, updateUserStatus } from "@/app/actions/users";
import { formatDate } from "@/lib/utils";

type UserItem = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    active: boolean | null;
    emailVerified: Date | null;
};

type InviteItem = {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
};

export default function UsersClient({
    initialUsers,
    initialInvites,
    currentUserRole
}: {
    initialUsers: UserItem[],
    initialInvites: InviteItem[],
    currentUserRole?: string
}) {
    const [showInvite, setShowInvite] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await inviteUser(formData);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else {
                setShowInvite(false);
            }
        });
    };

    const handleRevoke = (id: string) => {
        if (confirm("Revoke this invitation?")) {
            startTransition(async () => {
                const result = await revokeInvite(id);
                if (result && "error" in result && result.error) {
                    alert(result.error);
                }
            });
        }
    };

    const handleToggleStatus = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await updateUserStatus(id, !currentStatus);
            if (result && "error" in result && result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <div>
            <div className="page-header">
                <h1>Users</h1>
                {currentUserRole === "super_user" && (
                    <button className="btn btn-primary" onClick={() => setShowInvite(true)}>✉ Invite User</button>
                )}
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
                        {initialUsers.map((user) => (
                            <tr key={user.id} style={{ opacity: isPending ? 0.7 : 1 }}>
                                <td><span className={`user-status ${user.active ? "active" : "inactive"}`} /></td>
                                <td>
                                    <span style={{ fontWeight: 500 }}>{user.name || "Unknown"}</span>
                                    {user.active === false && <span style={{ color: "var(--admin-text-muted)", fontSize: "12px" }}> (inactive)</span>}
                                    <div className="row-actions">
                                        <button disabled={currentUserRole !== "super_user"}>Edit</button>
                                        {user.role !== "super_user" && currentUserRole === "super_user" && (
                                            <>
                                                <span className="row-actions-sep">|</span>
                                                <button
                                                    className="danger"
                                                    onClick={() => handleToggleStatus(user.id, user.active ?? true)}
                                                >
                                                    {user.active ? "Deactivate" : "Activate"}
                                                </button>
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
                                <td>{user.emailVerified ? formatDate(user.emailVerified) : "Never"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pending Invitations */}
            {currentUserRole === "super_user" && (
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
                                {initialInvites.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "var(--admin-text-muted)" }}>
                                            No pending invitations.
                                        </td>
                                    </tr>
                                )}
                                {initialInvites.map((inv) => (
                                    <tr key={inv.id} style={{ opacity: isPending ? 0.7 : 1 }}>
                                        <td>✉ {inv.email}</td>
                                        <td>{inv.role === "super_user" ? "Super User" : "User"}</td>
                                        <td>{formatDate(inv.createdAt)}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                style={{ fontSize: "12px", padding: "2px 8px" }}
                                                onClick={() => handleRevoke(inv.id)}
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInvite && (
                <div className="modal-overlay" onClick={() => setShowInvite(false)}>
                    <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleInvite}>
                        <div className="modal-header">
                            <h2>Invite User</h2>
                            <button type="button" className="modal-close" onClick={() => setShowInvite(false)}>×</button>
                        </div>
                        <div className="form-field">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="user@gmail.com" required disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Role</label>
                            <select name="role" disabled={isPending}>
                                <option value="user">User</option>
                                <option value="super_user">Super User</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)} disabled={isPending}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={isPending}>
                                {isPending ? "Sending..." : "Send Invitation"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
