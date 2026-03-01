"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/app/actions/settings";

const tabs = ["General", "SEO", "Telegram", "Social"];

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
    const [activeTab, setActiveTab] = useState("General");
    const [isPending, startTransition] = useTransition();

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            if (typeof value === "string") {
                data[key] = value;
            }
        });

        startTransition(async () => {
            const result = await saveSettings(data);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else {
                alert("Settings saved successfully!");
            }
        });
    };

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
                    {/* General */}
                    <form
                        className="settings-form"
                        onSubmit={handleSave}
                        style={{ display: activeTab === "General" ? "flex" : "none" }}
                    >
                        <div className="form-field">
                            <label>Site Title</label>
                            <input type="text" name="site_title" defaultValue={initialSettings["site_title"] || "MERPATI News"} disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Tagline</label>
                            <input type="text" name="site_tagline" defaultValue={initialSettings["site_tagline"] || "Berita Terpercaya untuk Indonesia"} disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Description</label>
                            <textarea name="site_description" rows={3} defaultValue={initialSettings["site_description"] || "Portal berita independen oleh jurnalis Indonesia."} disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Posts Per Page</label>
                            <input type="number" name="posts_per_page" defaultValue={initialSettings["posts_per_page"] || 10} style={{ width: "80px" }} disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Logo URL</label>
                            <input type="url" name="logo_url" defaultValue={initialSettings["logo_url"]} placeholder="https://..." disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Favicon URL</label>
                            <input type="url" name="favicon_url" defaultValue={initialSettings["favicon_url"]} placeholder="https://..." disabled={isPending} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isPending}>
                            {isPending ? "Saving..." : "Save General Settings"}
                        </button>
                    </form>

                    {/* SEO */}
                    <form
                        className="settings-form"
                        onSubmit={handleSave}
                        style={{ display: activeTab === "SEO" ? "flex" : "none" }}
                    >
                        <div className="form-field">
                            <label>Meta Description Template</label>
                            <textarea name="seo_meta_template" rows={2} defaultValue={initialSettings["seo_meta_template"] || "{post_title} — {site_name}"} disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Default Robots</label>
                            <select name="seo_default_robots" defaultValue={initialSettings["seo_default_robots"] || "index"} disabled={isPending}>
                                <option value="index">Index, Follow</option>
                                <option value="noindex">Noindex, Nofollow</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isPending}>
                            {isPending ? "Saving..." : "Save SEO Settings"}
                        </button>
                    </form>

                    {/* Telegram */}
                    <form
                        className="settings-form"
                        onSubmit={handleSave}
                        style={{ display: activeTab === "Telegram" ? "flex" : "none" }}
                    >
                        <div className="form-field">
                            <label>Bot Token 🔒</label>
                            <input type="password" name="tg_bot_token" defaultValue={initialSettings["tg_bot_token"]} placeholder="1234567890:ABCdef... (saved securely)" disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Chat ID</label>
                            <input type="text" name="tg_chat_id" defaultValue={initialSettings["tg_chat_id"]} placeholder="-100xxxxxxxxxx" disabled={isPending} />
                        </div>

                        {/* Hidden inputs to capture checkbox state since unchecked checkboxes are omitted from FormData */}
                        <div className="form-field">
                            <label>Notify on:</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                    <input type="hidden" name="tg_notify_post" value="0" />
                                    <input type="checkbox" name="tg_notify_post" value="1" defaultChecked={initialSettings["tg_notify_post"] !== "0"} disabled={isPending} /> Post published
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                    <input type="hidden" name="tg_notify_user" value="0" />
                                    <input type="checkbox" name="tg_notify_user" value="1" defaultChecked={initialSettings["tg_notify_user"] !== "0"} disabled={isPending} /> New user joined
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Telegram Settings"}
                        </button>
                    </form>

                    {/* Social */}
                    <form
                        className="settings-form"
                        onSubmit={handleSave}
                        style={{ display: activeTab === "Social" ? "flex" : "none" }}
                    >
                        <div className="form-field">
                            <label>Twitter / X</label>
                            <input type="url" name="social_twitter" defaultValue={initialSettings["social_twitter"]} placeholder="https://x.com/yourhandle" disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Facebook</label>
                            <input type="url" name="social_facebook" defaultValue={initialSettings["social_facebook"]} placeholder="https://facebook.com/yourpage" disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>Instagram</label>
                            <input type="url" name="social_instagram" defaultValue={initialSettings["social_instagram"]} placeholder="https://instagram.com/yourhandle" disabled={isPending} />
                        </div>
                        <div className="form-field">
                            <label>YouTube</label>
                            <input type="url" name="social_youtube" defaultValue={initialSettings["social_youtube"]} placeholder="https://youtube.com/@yourchannel" disabled={isPending} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Social Links"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
