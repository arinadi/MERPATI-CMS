"use client";

import {
    FeaturedMedia as SharedFeaturedMedia,
    type FeaturedMediaProps,
} from "@/components/featured-media";

// Theme defaults only; the embed and image logic lives in the shared component.
// Destructured (not spread over) so an explicit undefined still falls back to the theme default.
export function FeaturedMedia({
    aspectRatio = "aspect-video",
    emptyClassName = "bg-[#0F172A] text-white/10",
    emptyIconClassName = "w-12 h-12",
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
