"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOption } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SharingPlatforms {
    whatsapp: boolean;
    facebook: boolean;
    twitter: boolean;
    telegram: boolean;
    linkedin: boolean;
    reddit: boolean;
    pinterest: boolean;
    threads: boolean;
}

const PLATFORMS: { id: keyof SharingPlatforms; label: string }[] = [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "facebook", label: "Facebook" },
    { id: "twitter", label: "X (formerly Twitter)" },
    { id: "telegram", label: "Telegram" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "reddit", label: "Reddit" },
    { id: "pinterest", label: "Pinterest" },
    { id: "threads", label: "Threads" },
];

const DEFAULT_PLATFORMS: SharingPlatforms = {
    whatsapp: true,
    facebook: true,
    twitter: true,
    telegram: true,
    linkedin: true,
    reddit: true,
    pinterest: true,
    threads: true,
};

interface SharingSettingsProps {
    initialPlatforms: string;
}

export default function SharingSettings({ initialPlatforms }: SharingSettingsProps) {
    const [platforms, setPlatforms] = useState<SharingPlatforms>(() => {
        try {
            if (!initialPlatforms) return DEFAULT_PLATFORMS;
            const parsed = JSON.parse(initialPlatforms);
            return { ...DEFAULT_PLATFORMS, ...parsed };
        } catch {
            return DEFAULT_PLATFORMS;
        }
    });
    const [isPending, startTransition] = useTransition();

    async function handleSave() {
        startTransition(async () => {
            const result = await setOption("sharing_platforms", JSON.stringify(platforms));
            if (result.success) {
                toast.success("Sharing preferences updated.");
            } else {
                toast.error(result.error || "Failed to update sharing settings.");
            }
        });
    }

    const togglePlatform = (id: keyof SharingPlatforms) => {
        setPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Card className="shadow-none border">
            <CardHeader>
                <CardTitle>Sharing Platforms</CardTitle>
                <CardDescription>
                    Choose which social media platforms will be shown in the sharing menu on your posts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {PLATFORMS.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30">
                            <Checkbox
                                id={platform.id}
                                checked={platforms[platform.id]}
                                onCheckedChange={() => togglePlatform(platform.id)}
                            />
                            <Label 
                                htmlFor={platform.id}
                                className="text-sm font-medium leading-none cursor-pointer select-none"
                            >
                                {platform.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preferences
                </Button>
            </CardFooter>
        </Card>
    );
}
