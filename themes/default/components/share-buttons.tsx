"use client";

import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function ShareButtons({ title }: { title: string; text?: string }) {
    const [url, setUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUrl(window.location.href);
    }, []);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "X",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:bg-black hover:text-white"
        },
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:bg-[#1877F2] hover:text-white"
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:bg-[#0A66C2] hover:text-white"
        }
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    if (!url) return null;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mr-2">Share</span>
            {shareLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#1E293B] text-gray-400 border border-white/5 transition-all shadow-sm ${link.color}`}
                        title={`Share on ${link.name}`}
                    >
                        <Icon className="w-4 h-4" />
                    </a>
                );
            })}
            <button
                onClick={copyLink}
                className="h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-[#1E293B] text-gray-400 border border-white/5 hover:bg-gray-800 hover:text-white transition-all shadow-sm group"
                title="Copy link"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                <span className="text-sm font-bold uppercase tracking-wide">{copied ? "Copied" : "Copy Link"}</span>
            </button>
        </div>
    );
}
