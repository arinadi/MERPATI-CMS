"use client";

import { useState } from "react";
import { clearGlobalCache } from "@/lib/actions/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, DatabaseZap } from "lucide-react";

export function CacheManager() {
    const [isClearing, setIsClearing] = useState(false);

    async function handleClearCache() {
        setIsClearing(true);
        toast.loading("Clearing cache... The next page load might take longer.", { id: "cache-clear" });
        
        try {
            const result = await clearGlobalCache();
            if (result.success) {
                toast.success("Cache cleared successfully!", { id: "cache-clear" });
            } else {
                toast.error("Failed to clear cache: " + result.error, { id: "cache-clear" });
            }
        } catch {
            toast.error("An unexpected error occurred while clearing cache.", { id: "cache-clear" });
        } finally {
            setIsClearing(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <DatabaseZap className="h-5 w-5 text-blue-500" />
                    <CardTitle>Global Cache</CardTitle>
                </div>
                <CardDescription>
                    Next.js uses a highly aggressive caching mechanism (Full Route Cache) to serve pages instantly. 
                    This makes the site blazing fast, but sometimes you need to manually clear it if changes aren&apos;t appearing immediately.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 text-sm text-amber-500 mb-4">
                    <strong>Warning:</strong> Clearing the global cache will force the server to re-render all pages on the next visit. The server might experience a slight delay on the first hit.
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    <em>Tip:</em> You can verify if a page is cached by looking at the <strong>CACHE ID</strong> at the very bottom of the public frontend footer!
                </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button variant="destructive" onClick={handleClearCache} disabled={isClearing}>
                    {isClearing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Clear All Cache Now
                </Button>
            </CardFooter>
        </Card>
    );
}
