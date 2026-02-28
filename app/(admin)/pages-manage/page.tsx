"use client";

import Link from "next/link";

const dummyPages = [
    { id: "1", title: "Tentang Kami", slug: "tentang-kami", author: "Rina Sari", date: "15 Feb 2026", status: "published" },
    { id: "2", title: "Redaksi", slug: "redaksi", author: "Rina Sari", date: "15 Feb 2026", status: "published" },
    { id: "3", title: "Kontak", slug: "kontak", author: "Rina Sari", date: "15 Feb 2026", status: "published" },
    { id: "4", title: "Kebijakan Privasi", slug: "kebijakan-privasi", author: "Budi Santoso", date: "10 Feb 2026", status: "draft" },
];

export default function PagesManagePage() {
    return (
        <div>
            <div className="page-header">
                <h1>Pages</h1>
                <Link href="/pages-manage/new" className="btn btn-primary">Add New Page</Link>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}><input type="checkbox" /></th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyPages.map((page) => (
                            <tr key={page.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <div>
                                        <Link href={`/pages-manage/${page.id}/edit`} style={{ fontWeight: 500 }}>
                                            {page.title}
                                        </Link>
                                        {page.status === "draft" && <span className="badge badge-draft" style={{ marginLeft: 8 }}>Draft</span>}
                                    </div>
                                    <div className="row-actions">
                                        <Link href={`/pages-manage/${page.id}/edit`}>Edit</Link>
                                        <span className="row-actions-sep">|</span>
                                        <button className="danger">Trash</button>
                                        {page.status === "published" && (
                                            <>
                                                <span className="row-actions-sep">|</span>
                                                <a href="#">View</a>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>{page.author}</td>
                                <td>
                                    <div>{page.date}</div>
                                    <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                                        {page.status === "published" ? "Published" : "Draft"}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
