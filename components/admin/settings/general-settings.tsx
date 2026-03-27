"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2, ImageIcon, X } from "lucide-react";
import EditorMediaModal from "@/components/admin/editor-media-modal";

interface GeneralSettingsProps {
    siteTitle: string;
    siteTagline: string;
    siteUrl: string;
    siteLogo: string;
    favicon: string;
    postsPerPage: string;
}

export default function GeneralSettings({ siteTitle: initialTitle, siteTagline: initialTagline, siteUrl: initialUrl, siteLogo: initialLogo, favicon: initialFavicon, postsPerPage: initialPostsPerPage }: GeneralSettingsProps) {
    const [title, setTitle] = useState(initialTitle);
    const [tagline, setTagline] = useState(initialTagline);
    const [url, setUrl] = useState(initialUrl);
    const [logo, setLogo] = useState(initialLogo);
    const [favicon, setFavicon] = useState(initialFavicon);
    const [postsPerPage, setPostsPerPage] = useState(initialPostsPerPage || "12");
    const [isSaving, setIsSaving] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [faviconModalOpen, setFaviconModalOpen] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await setOptions({
                site_title: title,
                site_tagline: tagline,
                site_url: url,
                site_logo: logo,
                favicon: favicon,
                posts_per_page: postsPerPage
            });

            if (result.success) {
                toast.success("Settings updated successfully.");
            } else {
                toast.error(result.error || "Failed to update settings.");
            }
        } catch {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Configure your site&apos;s identity and basic information.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                        id="site_title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome CMS"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="site_tagline">Site Tagline</Label>
                    <Input
                        id="site_tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Briefly describe your site"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="site_url">Site URL</Label>
                    <Input
                        id="site_url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                    />
                    <p className="text-[12px] text-muted-foreground">
                        Used for generating permanent links in notifications.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label>Site Logo</Label>
                    {logo ? (
                        <div className="flex items-start gap-3">
                            <div className="relative group w-32 h-16 rounded-lg border bg-muted/50 overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logo}
                                    alt="Site logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMediaModalOpen(true)}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Change
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setLogo("")}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-20 border-dashed"
                            onClick={() => setMediaModalOpen(true)}
                        >
                            <ImageIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Choose Logo from Media</span>
                        </Button>
                    )}
                    <p className="text-[12px] text-muted-foreground">
                        Recommended: transparent PNG or SVG. If empty, site title text will be used.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label>Favicon</Label>
                    {favicon ? (
                        <div className="flex items-start gap-3">
                            <div className="relative group w-16 h-16 rounded-lg border bg-muted/50 overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={favicon}
                                    alt="Favicon"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFaviconModalOpen(true)}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Change
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setFavicon("")}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-20 border-dashed"
                            onClick={() => setFaviconModalOpen(true)}
                        >
                            <ImageIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Choose Favicon from Media</span>
                        </Button>
                    )}
                    <p className="text-[12px] text-muted-foreground">
                        Recommended: square PNG or ICO. Example dimensions: 32x32px or 512x512px.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="posts_per_page">Items Per Page</Label>
                    <Input
                        id="posts_per_page"
                        type="number"
                        min="1"
                        max="100"
                        value={postsPerPage}
                        onChange={(e) => setPostsPerPage(e.target.value)}
                        placeholder="12"
                    />
                    <p className="text-[12px] text-muted-foreground">
                        Number of items to display per page on archives.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>

            <EditorMediaModal
                open={mediaModalOpen}
                onOpenChange={setMediaModalOpen}
                onInsert={(url) => {
                    setLogo(url);
                    setMediaModalOpen(false);
                }}
                insertLabel="Use as Site Logo"
            />
            
            <EditorMediaModal
                open={faviconModalOpen}
                onOpenChange={setFaviconModalOpen}
                onInsert={(url) => {
                    setFavicon(url);
                    setFaviconModalOpen(false);
                }}
                insertLabel="Use as Favicon"
            />
        </Card>
    );
}
