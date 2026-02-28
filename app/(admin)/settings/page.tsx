"use client";

import { useState } from "react";

const tabs = ["General", "SEO", "Telegram", "Social"];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("General");

    return (
        <div>
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            <div className="settings-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`settings-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="card-body">
                    {activeTab === "General" && (
                        <div className="settings-form">
                            <div className="form-field">
                                <label>Site Title</label>
                                <input type="text" defaultValue="MERPATI News" />
                            </div>
                            <div className="form-field">
                                <label>Tagline</label>
                                <input type="text" defaultValue="Berita Terpercaya untuk Indonesia" />
                            </div>
                            <div className="form-field">
                                <label>Description</label>
                                <textarea rows={3} defaultValue="Portal berita independen oleh jurnalis Indonesia." />
                            </div>
                            <div className="form-field">
                                <label>Posts Per Page</label>
                                <input type="number" defaultValue={10} style={{ width: "80px" }} />
                            </div>
                            <div className="form-field">
                                <label>Logo</label>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div style={{ width: "80px", height: "80px", background: "var(--admin-body-bg)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>🕊️</div>
                                    <button className="btn btn-secondary">Upload Logo</button>
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Favicon</label>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div style={{ width: "32px", height: "32px", background: "var(--admin-body-bg)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🕊️</div>
                                    <button className="btn btn-secondary">Upload Favicon</button>
                                </div>
                            </div>
                            <button className="btn btn-primary">Save Settings</button>
                        </div>
                    )}

                    {activeTab === "SEO" && (
                        <div className="settings-form">
                            <div className="form-field">
                                <label>Meta Description Template</label>
                                <textarea rows={2} defaultValue="{post_title} — {site_name}" />
                            </div>
                            <div className="form-field">
                                <label>Default Robots</label>
                                <select defaultValue="index">
                                    <option value="index">Index, Follow</option>
                                    <option value="noindex">Noindex, Nofollow</option>
                                </select>
                            </div>
                            <button className="btn btn-primary">Save Settings</button>
                        </div>
                    )}

                    {activeTab === "Telegram" && (
                        <div className="settings-form">
                            <div className="form-field">
                                <label>Bot Token 🔒</label>
                                <input type="password" placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ" />
                            </div>
                            <div className="form-field">
                                <label>Chat ID</label>
                                <input type="text" placeholder="-100xxxxxxxxxx" />
                            </div>
                            <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
                                🔔 Test Notification
                            </button>
                            <hr style={{ border: "none", borderTop: "1px solid var(--admin-border)" }} />
                            <div className="form-field">
                                <label>Notify on:</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                        <input type="checkbox" defaultChecked /> Post published
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                        <input type="checkbox" defaultChecked /> New user joined
                                    </label>
                                </div>
                            </div>
                            <button className="btn btn-primary">Save Settings</button>
                        </div>
                    )}

                    {activeTab === "Social" && (
                        <div className="settings-form">
                            <div className="form-field">
                                <label>Twitter / X</label>
                                <input type="url" placeholder="https://x.com/yourhandle" />
                            </div>
                            <div className="form-field">
                                <label>Facebook</label>
                                <input type="url" placeholder="https://facebook.com/yourpage" />
                            </div>
                            <div className="form-field">
                                <label>Instagram</label>
                                <input type="url" placeholder="https://instagram.com/yourhandle" />
                            </div>
                            <div className="form-field">
                                <label>YouTube</label>
                                <input type="url" placeholder="https://youtube.com/@yourchannel" />
                            </div>
                            <button className="btn btn-primary">Save Settings</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
