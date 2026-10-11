"use client";

import {
    FeaturedMedia as SharedFeaturedMedia,
    type FeaturedMediaProps,
} from "@/components/featured-media";

// Theme defaults only; the embed and image logic lives in the shared component.
// Destructured (not spread over) so an explicit undefined still falls back to the theme default.
export function FeaturedMedia({
    aspectRatio = "aspect-video",
    emptyClassName = "bg-slate-900/50 text-white/5 border border-white/5",
    emptyIconClassName = "w-1/3 h-1/3 max-w-[4rem] max-h-[4rem] opacity-20",
    ...props
}: FeaturedMediaProps) {
    return (
        <SharedFeaturedMedia
            {...props}
            aspectRatio={aspectRatio}
            emptyClassName={emptyClassName}
            emptyIconClassName={emptyIconClassName}
        />
    );
}
