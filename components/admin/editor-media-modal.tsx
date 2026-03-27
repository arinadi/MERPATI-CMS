"use client";

import { useState } from "react";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaLibrary from "./media/media-library";
import { MediaItem } from "./media/media-grid";

interface EditorMediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, alt?: string) => void;
    insertLabel?: string;
    description?: React.ReactNode;
}

export default function EditorMediaModal({ open, onOpenChange, onInsert, insertLabel = "Insert Media", description }: EditorMediaModalProps) {
    const [urlInput, setUrlInput] = useState("");
    const [altInput, setAltInput] = useState("");

    const handleSelectMedia = (item: MediaItem) => {
        onInsert(item.url, item.altText || item.filename);
        onOpenChange(false);
    };

    const handleInsertUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlInput.trim()) {
            onInsert(urlInput.trim(), altInput.trim());
            onOpenChange(false);
            setUrlInput("");
            setAltInput("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col overflow-hidden p-0 sm:rounded-2xl">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle>Insert Media</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="library" className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="px-6 pt-4 shrink-0">
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="library">Media Library</TabsTrigger>
                            <TabsTrigger value="url">Insert from URL</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="library" className="flex-1 overflow-hidden p-6 mt-0">
                        {description && (
                            <div className="text-xs text-muted-foreground mb-4">
                                {description}
                            </div>
                        )}
                        <div className="h-full border rounded-xl bg-card overflow-hidden">
                            <MediaLibrary selectable onSelect={handleSelectMedia} />
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="flex-1 overflow-auto p-6 mt-0">
                        <form onSubmit={handleInsertUrl} className="max-w-md mx-auto space-y-6 pt-8">
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <div className="flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted/50 text-muted-foreground sm:text-sm">
                                        <LinkIcon className="h-4 w-4" />
                                    </span>
                                    <Input
                                        id="imageUrl"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="rounded-l-none"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageAlt">Alt Text (Optional)</Label>
                                <Input
                                    id="imageAlt"
                                    type="text"
                                    placeholder="Describe the image..."
                                    value={altInput}
                                    onChange={(e) => setAltInput(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Alt text is important for accessibility and SEO.
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={!urlInput.trim()}>
                                {insertLabel || "Insert Image"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
