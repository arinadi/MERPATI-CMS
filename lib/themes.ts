import type { ComponentType, ReactNode } from "react";

// ─── Theme Component Interfaces ────────────────────────────────────────────

export interface ThemeLayoutProps {
    children: ReactNode;
    siteTitle: string;
    siteTagline: string;
    siteLogo?: string;
    contacts: ContactItem[];
    primaryMenu: MenuItem[];
    footerMenu: MenuItem[];
    cacheId?: string;
    themeOptions?: Record<string, unknown>;
}

export interface HomeProps {
    posts?: PostCardData[];
    themeOptions?: Record<string, unknown>;
}

export interface SinglePostProps {
    post: PostData;
    relatedPosts?: PostCardData[];
    sharingPlatforms?: string;
}

export interface SinglePageProps {
    page: PageData;
}

export interface ArchiveProps {
    title: string;
    description?: string;
    posts: PostCardData[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        basePath: string;
    };
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

export type ThemeOptionType = "text" | "textarea" | "number" | "url" | "select" | "post" | "image" | "color" | "contacts" | "checkbox-group";

export interface ThemeOptionField {
    id: string; // The key in the database options table
    label: string; // The label shown in the form
    type: ThemeOptionType;
    description?: string;
    options?: { label: string; value: string }[]; // For "select" type
    group?: string; // Optional group name for UI cards
}

export interface ThemeExports {
    ThemeLayout: ComponentType<ThemeLayoutProps>;
    Home?: ComponentType<ArchiveProps>;
    SinglePost: ComponentType<SinglePostProps>;
    SinglePage: ComponentType<SinglePageProps>;
    Archive: ComponentType<ArchiveProps>;
    NotFound: ComponentType<Record<string, never>>;
    options?: ThemeOptionField[];
}

// ─── Static Theme Resolution ───────────────────────────────────────────────
// Since ACTIVE_THEME is an env var resolved at build time,
// we use a simple static import map. This avoids `next/dynamic`
// and the "cannot create components during render" error.

import * as defaultTheme from "@/themes/default";
import * as newsTheme from "@/themes/news";
import { portfolioTheme } from "@/themes/portfolio";

const THEME_MAP: Record<string, ThemeExports> = {
    default: defaultTheme as ThemeExports,
    news: newsTheme as ThemeExports,
    portfolio: portfolioTheme as ThemeExports,
};

const activeThemeKey = process.env.ACTIVE_THEME || "default";

export const activeTheme: ThemeExports = THEME_MAP[activeThemeKey] ?? THEME_MAP["default"];
