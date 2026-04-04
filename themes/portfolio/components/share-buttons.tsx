"use client";

import { ShareButtons as SystemShareButtons } from "@/components/share-buttons";

export function ShareButtons({ title }: { title: string }) {
    return (
        <SystemShareButtons
            title={title}
            buttonClassName="bg-[#1E293B] border-white/5 shadow-sm"
            labelClassName=""
        />
    );
}
