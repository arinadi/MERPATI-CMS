"use client";

import { useState, useEffect } from "react";
import { Check, Link2, Facebook, Twitter, Linkedin } from "lucide-react";
import { getSocialShareLinks } from "@/lib/utils/social";

// Custom SVGs for platforms not in Lucide or better brand fidelity
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.423.06.637 0 2.506-3.497 4.545-7.81 4.545-4.313 0-7.809-2.039-7.809-4.545 0-.218.019-.432.06-.643a1.745 1.745 0 0 1-1.051-1.59c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.475 1.196-.834 2.83-1.388 4.634-1.47l.88-4.132a.25.25 0 0 1 .203-.193l2.8-.588c.08-.014.16-.021.242-.021zM8.38 11.854a1.187 1.187 0 1 0 0 2.374 1.187 1.187 0 0 0 0-2.374zm7.234 0a1.187 1.187 0 1 0 0 2.374 1.187 1.187 0 0 0 0-2.374zM12 15.546c-1.558 0-2.859.54-3.408.88a.227.227 0 0 0-.012.373c.125.101.309.083.421.012.434-.27 1.442-.647 2.999-.647 1.557 0 2.565.377 2.999.647.112.071.296.089.421-.012a.227.227 0 0 0-.012-.373c-.549-.34-1.85-.88-3.408-.88z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.5 14h-7c-.828 0-1.5-.672-1.5-1.5V11c0-.828.672-1.5 1.5-1.5h7c.828 0 1.5.672 1.5 1.5v3.5c0 .828-.672 1.5-1.5 1.5zm-7-2.5h7V11h-7v2.5z" />
    </svg>
  );
}

export interface ShareButtonsProps {
  title: string;
  excerpt?: string;
  platforms?: Record<string, boolean>;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ShareButtons({
  title,
  excerpt = "",
  platforms,
  orientation = "horizontal",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const shareLinks = getSocialShareLinks(title, url, excerpt, platforms);

  const iconMap: Record<string, React.ElementType> = {
    whatsapp: WhatsAppIcon,
    facebook: Facebook,
    twitter: Twitter,
    telegram: TelegramIcon,
    linkedin: Linkedin,
    reddit: RedditIcon,
    threads: ThreadsIcon,
  };

  const brandStyles: Record<string, string> = {
    whatsapp: "border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5",
    facebook: "border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5",
    twitter: "border-black text-black hover:bg-black/5",
    telegram: "border-[#0088cc] text-[#0088cc] hover:bg-[#0088cc]/5",
    linkedin: "border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/5",
    reddit: "border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500]/5",
    threads: "border-black text-black hover:bg-black/5",
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const isVertical = orientation === "vertical";

  return (
    <div className={`flex ${isVertical ? "flex-col" : "flex-row flex-wrap"} items-center gap-2 w-full max-w-full ${className}`}>
      {!isVertical && (
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-1 border-r border-gray-200 pr-2 shrink">
          Share
        </span>
      )}
      
      {shareLinks.map((link) => {
        const Icon = iconMap[link.id];
        if (!Icon) return null;
        
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md border-2 transition-all duration-300 ${brandStyles[link.id]} hover:scale-110 active:scale-95 z-10`}
            title={`Share on ${link.name}`}
          >
            <Icon size={isVertical ? 16 : 14} />
          </a>
        );
      })}

      <button
        onClick={copyToClipboard}
        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md border-2 transition-all duration-300 ${copied ? 'border-green-600 text-green-600 bg-green-50' : 'border-gray-800 text-gray-800 hover:bg-gray-50'} hover:scale-110 active:scale-95 z-10`}
        title="Copy Link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
      </button>
    </div>
  );
}
