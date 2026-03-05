"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Check, Twitter, Facebook, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    text?: string;
}

export function ShareButtons({ title, text }: ShareButtonsProps) {
    const [url, setUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text || title,
                    url,
                });
            } catch (err) {
                console.log("Error sharing", err);
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!url) return null;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "X (Twitter)",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:bg-[#1DA1F2] hover:text-white"
        },
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:bg-[#4267B2] hover:text-white"
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:bg-[#25D366] hover:text-white"
        }
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider hidden sm:inline-block">Bagikan:</span>

            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-colors ${link.color}`}
                    title={`Bagikan ke ${link.name}`}
                >
                    <link.icon className="w-4 h-4" />
                </a>
            ))}

            <button
                onClick={handleCopy}
                className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                title="Salin Tautan"
            >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>

            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors ml-1 sm:hidden"
                    title="Bagikan via Sistem"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
