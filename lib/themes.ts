import type { ComponentType, ReactNode } from "react";

// ─── Theme Component Interfaces ────────────────────────────────────────────

export interface ThemeLayoutProps {
    children: ReactNode;
    siteTitle: string;
    siteTagline: string;
    contacts: ContactItem[];
    primaryMenu: MenuItem[];
    footerMenu: MenuItem[];
}

export interface SinglePostProps {
    post: PostData;
    relatedPosts?: PostCardData[];
}

export interface SinglePageProps {
    page: PageData;
}

export interface ArchiveProps {
    title: string;
    description?: string;
    posts: PostCardData[];
}

// ─── Shared Data Types ─────────────────────────────────────────────────────

export interface ContactItem {
    id: string;
    title: string;
    iconId: string;
    url: string;
}

export interface MenuItem {
    id: string;
    title: string;
    url: string | null;
    slug?: string;
    objectId?: string | null;
    type: string;
    sortOrder: number;
}

export interface PostData {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    featuredImage: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    author: { name: string | null; image: string | null } | null;
    categories: { id: string; name: string; slug: string }[];
    tags: { id: string; name: string; slug: string }[];
}

export interface PageData {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    featuredImage: string | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface PostCardData {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    createdAt: Date;
    author?: { name: string | null } | null;
    categories?: { id: string; name: string; slug: string }[];
}

// ─── Theme Exports Interface ───────────────────────────────────────────────

export interface ThemeExports {
    ThemeLayout: ComponentType<ThemeLayoutProps>;
    SinglePost: ComponentType<SinglePostProps>;
    SinglePage: ComponentType<SinglePageProps>;
    Archive: ComponentType<ArchiveProps>;
    NotFound: ComponentType<Record<string, never>>;
}

// ─── Static Theme Resolution ───────────────────────────────────────────────
// Since ACTIVE_THEME is an env var resolved at build time,
// we use a simple static import map. This avoids `next/dynamic`
// and the "cannot create components during render" error.

import * as defaultTheme from "@/themes/default";

const THEME_MAP: Record<string, ThemeExports> = {
    default: defaultTheme as ThemeExports,
};

const activeThemeKey = process.env.ACTIVE_THEME || "default";

export const activeTheme: ThemeExports = THEME_MAP[activeThemeKey] ?? THEME_MAP["default"];
