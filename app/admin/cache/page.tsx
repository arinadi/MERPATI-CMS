import { CacheManager } from "@/components/admin/cache/cache-manager";

export const metadata = {
    title: "Cache Management - MERPATI Admin",
};

export default function CachePage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Cache Management</h1>
                <p className="text-muted-foreground">
                    Control how Next.js caches your website content.
                </p>
            </div>
            
            <CacheManager />
        </div>
    );
}
