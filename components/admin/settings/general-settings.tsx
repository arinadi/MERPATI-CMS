"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GeneralSettingsProps {
    siteTitle: string;
    siteTagline: string;
    siteUrl: string;
}

export default function GeneralSettings({ siteTitle: initialTitle, siteTagline: initialTagline, siteUrl: initialUrl }: GeneralSettingsProps) {
    const [title, setTitle] = useState(initialTitle);
    const [tagline, setTagline] = useState(initialTagline);
    const [url, setUrl] = useState(initialUrl);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await setOptions({
                site_title: title,
                site_tagline: tagline,
                site_url: url
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
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
}
