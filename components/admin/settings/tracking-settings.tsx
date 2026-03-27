"use client";

import { useState } from "react";
import { setOptions } from "@/lib/actions/options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { BarChart } from "lucide-react";

interface TrackingSettingsProps {
    gtmId: string;
    cfAnalyticsToken: string;
}

export default function TrackingSettings({ gtmId, cfAnalyticsToken }: TrackingSettingsProps) {
    const [gtm, setGtm] = useState(gtmId);
    const [cfToken, setCfToken] = useState(cfAnalyticsToken);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await setOptions({
                gtm_id: gtm,
                cf_analytics_token: cfToken,
            });
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Tracking settings saved successfully");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-500" />
                    Analytics & Tracking
                </CardTitle>
                <CardDescription>
                    Configure third-party tracking services.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 max-w-md">
                    <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                    <Input
                        id="gtmId"
                        value={gtm}
                        onChange={(e) => setGtm(e.target.value)}
                        placeholder="e.g., GTM-XXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground">
                        GTM can load Google Analytics, Facebook Pixel, and other tags from its dashboard.
                        Leave empty to disable.
                    </p>
                </div>
                <div className="space-y-2 max-w-md">
                    <Label htmlFor="cfToken">Cloudflare Web Analytics Token</Label>
                    <Input
                        id="cfToken"
                        value={cfToken}
                        onChange={(e) => setCfToken(e.target.value)}
                        placeholder="e.g., abcdef1234567890"
                    />
                    <p className="text-xs text-muted-foreground">
                        Get your beacon token from{" "}
                        <a
                            href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-indigo-400 hover:text-indigo-300"
                        >
                            Cloudflare Web Analytics
                        </a>
                        . Leave empty to disable.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Tracking Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
}
