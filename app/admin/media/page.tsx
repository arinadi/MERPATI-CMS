import MediaLibrary from "@/components/admin/media/media-library";

export const metadata = {
    title: "Media Library | MERPATI",
};

export default function MediaPage() {
    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                <p className="text-muted-foreground">
                    Manage your uploaded images and files.
                </p>
            </div>

            <div className="flex-1 bg-card rounded-xl border shadow-sm p-6 overflow-hidden">
                <MediaLibrary />
            </div>
        </div>
    );
}
