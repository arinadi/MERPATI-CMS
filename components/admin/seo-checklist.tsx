"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOption } from "@/lib/actions/options";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface SeoChecklistData {
    [key: string]: boolean;
}

const CHECKLIST_ITEMS = [
    { 
        id: "gsc_submit", 
        label: "Submit Site to Search Console", 
        link: "https://search.google.com/search-console/about" 
    },
    { 
        id: "sitemap_add", 
        label: "Add Sitemap to GSC", 
        link: "https://search.google.com/search-console/sitemaps" 
    },
    { 
        id: "rich_results", 
        label: "Verify Rich Results (JSON-LD)", 
        link: "https://search.google.com/test/rich-results" 
    },
    { 
        id: "core_web_vitals", 
        label: "Check Core Web Vitals / Mobile", 
        link: "https://pagespeed.web.dev/" 
    },
    { 
        id: "ssl_verify", 
        label: "Verify HTTPS SSL", 
        link: "https://www.ssllabs.com/ssltest/" 
    },
    { 
        id: "ga4_config", 
        label: "Configure GA4 Tracking", 
        link: "https://analytics.google.com/analytics/web/" 
    },
    { 
        id: "robots_txt", 
        label: "Test robots.txt", 
        link: "https://www.google.com/webmasters/tools/robots-testing-tool" 
    },
];

interface SeoChecklistProps {
    initialData: string;
}

export default function SeoChecklist({ initialData }: SeoChecklistProps) {
    const [data, setData] = useState<SeoChecklistData>(() => {
        try {
            return initialData ? JSON.parse(initialData) : {};
        } catch {
            return {};
        }
    });
    const [, startTransition] = useTransition();

    const completedCount = CHECKLIST_ITEMS.filter(item => data[item.id]).length;
    const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

    async function handleToggle(id: string) {
        const newData = { ...data, [id]: !data[id] };
        setData(newData);
        
        startTransition(async () => {
            const result = await setOption("seo_checklist", JSON.stringify(newData));
            if (!result.success) {
                toast.error("Failed to save checklist state.");
                // Revert UI state on failure
                setData(data);
            }
        });
    }

    return (
        <Card className="h-full flex flex-col shadow-sm border-white/5 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        SEO Manual Checklist
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {progress}% Complete
                        </span>
                    </CardTitle>
                </div>
                <CardDescription className="text-xs">
                    Essential manual tasks for search optimization and index discovery.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-1">
                {/* Progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden">
                    <div 
                        className="bg-blue-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="space-y-0.5">
                    {CHECKLIST_ITEMS.map((item) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center justify-between p-2.5 rounded-lg transition-colors group ${
                                data[item.id] ? "bg-emerald-500/5" : "hover:bg-white/5"
                            }`}
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <Checkbox
                                    id={item.id}
                                    checked={data[item.id] || false}
                                    onCheckedChange={() => handleToggle(item.id)}
                                    className="border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                />
                                <Label 
                                    htmlFor={item.id}
                                    className={`text-sm cursor-pointer select-none transition-colors ${
                                        data[item.id] ? "text-emerald-500 line-through opacity-70" : "text-zinc-300"
                                    }`}
                                >
                                    {item.label}
                                </Label>
                            </div>
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                                title="Open Tool"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ))}
                </div>
            </CardContent>
            {completedCount === CHECKLIST_ITEMS.length && (
                <CardFooter className="pt-2 pb-4">
                    <div className="w-full p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-400">All manual SEO tasks are complete!</span>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
