"use client";

export default function ProfilePage() {
    return (
        <div>
            <div className="page-header">
                <h1>Profile</h1>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="profile-layout">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar">R</div>
                            <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                                Photo from Google
                            </div>
                        </div>

                        <div className="profile-form">
                            <div className="form-field">
                                <label>Name</label>
                                <input type="text" defaultValue="Rina Sari" readOnly style={{ backgroundColor: "var(--admin-body-bg)" }} />
                                <small style={{ color: "var(--admin-text-muted)", fontSize: "11px" }}>Synced from Google account</small>
                            </div>
                            <div className="form-field">
                                <label>Email</label>
                                <input type="email" defaultValue="rina@gmail.com" readOnly style={{ backgroundColor: "var(--admin-body-bg)" }} />
                            </div>
                            <div className="form-field">
                                <label>Role</label>
                                <input type="text" value="Super User" readOnly style={{ backgroundColor: "var(--admin-body-bg)" }} />
                            </div>
                            <div className="form-field">
                                <label>Bio</label>
                                <textarea rows={4} defaultValue="Jurnalis investigasi dengan pengalaman 10 tahun. Fokus pada isu lingkungan dan kebijakan publik." />
                            </div>
                            <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Update Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
