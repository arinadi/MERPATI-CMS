"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaUploader from "./media-uploader";
import MediaGrid, { MediaItem } from "./media-grid";
import { getMedia, deleteMedia, updateMedia } from "@/lib/actions/media";

interface MediaLibraryProps {
    onSelect?: (item: MediaItem) => void;
    selectable?: boolean;
}

export default function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
    const [activeTab, setActiveTab] = useState<string>("library");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMedia = useCallback(async (pageNum: number, refresh = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getMedia(pageNum, 30);
            if (result.error) {
                setError(result.error);
            } else if (result.items) {
                if (refresh) {
                    setMediaItems(result.items);
                } else {
                    setMediaItems((prev) => [...prev, ...result.items]);
                }
                setHasMore(result.items.length === 30);
            }
        } catch {
            setError("Failed to load media.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "library") {
            fetchMedia(1, true);
        }
    }, [activeTab, fetchMedia]);

    const handleUploadSuccess = () => {
        setActiveTab("library");
        setPage(1);
        fetchMedia(1, true);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteMedia(id);
        if (result.error) throw new Error(result.error);
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpdateAlt = async (id: string, altText: string) => {
        const result = await updateMedia(id, altText);
        if (result.error) throw new Error(result.error);
        setMediaItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, altText } : item)
        );
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMedia(nextPage);
    };

    return (
        <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="library">Media Library</TabsTrigger>
                        <TabsTrigger value="upload">Upload New</TabsTrigger>
                    </TabsList>

                    {activeTab === "library" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchMedia(1, true)}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    )}
                </div>

                <TabsContent value="upload" className="mt-0 flex-1">
                    <div className="max-w-2xl mx-auto pt-8">
                        <MediaUploader onUploadSuccess={handleUploadSuccess} />
                    </div>
                </TabsContent>

                <TabsContent value="library" className="mt-0 flex-1 flex flex-col space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto pr-2 pb-4">
                        {isLoading && mediaItems.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <MediaGrid
                                items={mediaItems}
                                onDelete={handleDelete}
                                onUpdateAlt={handleUpdateAlt}
                                onSelect={onSelect}
                                selectable={selectable}
                            />
                        )}

                        {hasMore && mediaItems.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
