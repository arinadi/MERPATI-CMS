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
    gaId: string;
    cfAnalyticsToken: string;
    gaDashboardUrl: string;
}

export default function TrackingSettings({ gtmId, gaId, cfAnalyticsToken, gaDashboardUrl }: TrackingSettingsProps) {
    const [gtm, setGtm] = useState(gtmId);
    const [ga, setGa] = useState(gaId);
    const [cfToken, setCfToken] = useState(cfAnalyticsToken);
    const [gaEmbedUrl, setGaEmbedUrl] = useState(gaDashboardUrl);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await setOptions({
                gtm_id: gtm,
                ga_id: ga,
                cf_analytics_token: cfToken,
                ga_dashboard_url: gaEmbedUrl,
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
        <Card className="max-w-4xl mx-auto shadow-sm border-white/5 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-500" />
                    Analytics & Tracking
                </CardTitle>
                <CardDescription>
                    Configure third-party tracking services and analytics insights.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Measurement IDs */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                            <Input
                                id="gtmId"
                                value={gtm}
                                onChange={(e) => setGtm(e.target.value)}
                                placeholder="e.g., GTM-XXXXXXX"
                                className="bg-zinc-800/50 border-white/10"
                            />
                            <p className="text-[10px] text-zinc-500">
                                GTM can load Google Analytics, Facebook Pixel, and other tags.
                                Leave empty to disable.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gaId">Google Analytics ID (GA4)</Label>
                            <Input
                                id="gaId"
                                value={ga}
                                onChange={(e) => setGa(e.target.value)}
                                placeholder="e.g., G-XXXXXXX"
                                className="bg-zinc-800/50 border-white/10"
                            />
                            <p className="text-[10px] text-zinc-500">
                                The Measurement ID for Google Analytics 4.
                                Leave empty if using GTM to load GA4.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cfToken">Cloudflare Web Analytics Token</Label>
                            <Input
                                id="cfToken"
                                value={cfToken}
                                onChange={(e) => setCfToken(e.target.value)}
                                placeholder="e.g., abcdef1234567890"
                                className="bg-zinc-800/50 border-white/10"
                            />
                            <p className="text-[10px] text-zinc-500">
                                Get your beacon token from{" "}
                                <a
                                    href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-indigo-400 hover:text-indigo-300"
                                >
                                    Cloudflare Web Analytics
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    {/* GA Dashboard Embed */}
                    <div className="space-y-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <div className="space-y-2">
                            <Label htmlFor="gaDashboardUrl" className="text-indigo-300">GA Dashboard Embed URL (Looker Studio)</Label>
                            <Input
                                id="gaDashboardUrl"
                                value={gaEmbedUrl}
                                onChange={(e) => setGaEmbedUrl(e.target.value)}
                                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                                className="bg-zinc-800/50 border-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Dashboard Setup Guide:</h4>
                            <ol className="text-[11px] text-zinc-400 space-y-2 list-decimal ml-4">
                                <li>Open <a href="https://lookerstudio.google.com/" target="_blank" className="text-indigo-400 underline">Looker Studio</a>.</li>
                                <li>Create a new report or use a <b>GA4 Report</b> template.</li>
                                <li>Click <b>Share</b> &rarr; <b>Manage Access</b>.</li>
                                <li className="text-amber-400/80 font-medium whitespace-pre-wrap">Important: Choose &quot;Anyone with link can view&quot; for the dashboard to render.</li>
                                <li>Go to <b>File</b> &rarr; <b>Embed report</b>.</li>
                                <li>Check <b>Enable embedding</b> and select <b>Embed URL</b>.</li>
                                <li>Copy and paste the URL here.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-6 justify-between items-center">
                <p className="text-xs text-zinc-500">MERPATI CMS Analytics Integration v2.0</p>
                <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500">
                    {isSaving ? "Saving..." : "Save Tracking Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
}
