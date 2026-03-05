"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Copy, Check, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface MediaItem {
    id: string;
    url: string;
    filename: string;
    mimeType: string | null;
    size: number | null;
    altText: string | null;
    createdAt: Date;
    author: { name: string | null } | null;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface MediaGridProps {
    items: MediaItem[];
    onDelete?: (id: string) => Promise<void>;
    onUpdateAlt?: (id: string, altText: string) => Promise<void>;
    onSelect?: (item: MediaItem) => void;
    selectable?: boolean;
}

export default function MediaGrid({
    items,
    onDelete,
    onUpdateAlt,
    onSelect,
    selectable = false
}: MediaGridProps) {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [copied, setCopied] = useState(false);
    const [editingAlt, setEditingAlt] = useState(false);
    const [altInput, setAltInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    if (items.length === 0) {
        return (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 text-muted-foreground p-8 text-center">
                <p>No media files found.</p>
                <p className="text-sm mt-1">Upload images to see them here.</p>
            </div>
        );
    }

    const openDetails = (item: MediaItem) => {
        setSelectedItem(item);
        setAltInput(item.altText || "");
        setEditingAlt(false);
        setCopied(false);
    };

    const handleCopy = () => {
        if (!selectedItem) return;
        navigator.clipboard.writeText(selectedItem.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateAlt = async () => {
        if (!selectedItem || !onUpdateAlt) return;
        setIsUpdating(true);
        try {
            await onUpdateAlt(selectedItem.id, altInput);
            setSelectedItem({ ...selectedItem, altText: altInput });
            setEditingAlt(false);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem || !onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(selectedItem.id);
            setSelectedItem(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSelectAction = () => {
        if (!selectedItem || !onSelect) return;
        onSelect(selectedItem);
        setSelectedItem(null);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[150px]">
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => openDetails(item)}
                        className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    </button>
                ))}
            </div>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-3xl overflow-hidden p-0 sm:rounded-2xl">
                    {selectedItem && (
                        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                            {/* Image Preview (Left Side) */}
                            <div className="flex-1 bg-muted/30 p-4 md:p-8 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedItem.url}
                                    alt={selectedItem.altText || selectedItem.filename}
                                    className="max-w-full max-h-[40vh] md:max-h-full object-contain rounded-lg shadow-sm"
                                />
                            </div>

                            {/* Details (Right Side) */}
                            <div className="w-full md:w-[320px] shrink-0 p-6 flex flex-col h-[40vh] md:h-auto overflow-y-auto">
                                <DialogHeader className="mb-6 space-y-0">
                                    <DialogTitle className="text-xl font-semibold break-all">
                                        {selectedItem.filename}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs pt-1.5 flex items-center gap-1.5">
                                        <span>Uploaded {formatDistanceToNow(new Date(selectedItem.createdAt))} ago</span>
                                        {selectedItem.author?.name && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-[100px]">by {selectedItem.author.name}</span>
                                            </>
                                        )}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                                        <div className="text-muted-foreground font-medium">Type</div>
                                        <div className="truncate" title={selectedItem.mimeType || "Unknown"}>
                                            {selectedItem.mimeType || "Unknown"}
                                        </div>
                                        <div className="text-muted-foreground font-medium">Size</div>
                                        <div>{selectedItem.size ? formatBytes(selectedItem.size) : "Unknown"}</div>
                                    </div>

                                    {/* URL Copy */}
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-medium">File URL</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value={selectedItem.url} className="text-xs bg-muted/50 font-mono" />
                                            <Button variant="secondary" size="icon" onClick={handleCopy} className="shrink-0" title="Copy URL">
                                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Alt Text Edit */}
                                    {onUpdateAlt && (
                                        <div className="space-y-2 pb-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="altText" className="text-muted-foreground font-medium">Alt Text</Label>
                                                {!editingAlt ? (
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditingAlt(true)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-1 border rounded-md p-0.5 ml-auto bg-muted/20">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="h-6 px-2 text-[10px]"
                                                            onClick={handleUpdateAlt}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? "..." : "Save"}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-2 text-[10px]"
                                                            onClick={() => {
                                                                setEditingAlt(false);
                                                                setAltInput(selectedItem.altText || "");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            {editingAlt ? (
                                                <Input
                                                    id="altText"
                                                    value={altInput}
                                                    onChange={(e) => setAltInput(e.target.value)}
                                                    placeholder="Describe the image..."
                                                    className="text-sm border-primary/50"
                                                    disabled={isUpdating}
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            handleUpdateAlt();
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="text-sm p-2.5 rounded-md border border-transparent bg-muted/20 text-muted-foreground break-words min-h-[40px] cursor-pointer hover:bg-muted/50 hover:text-foreground transition-colors"
                                                    onClick={() => setEditingAlt(true)}
                                                >
                                                    {selectedItem.altText ? selectedItem.altText : <span className="italic opacity-70">No alt text provided</span>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="mt-6 pt-4 border-t flex items-center justify-between gap-2">
                                    {selectable && onSelect ? (
                                        <Button className="flex-1" onClick={handleSelectAction}>
                                            Select Image
                                        </Button>
                                    ) : (
                                        <div className="flex-1" /> // Spacer
                                    )}

                                    {onDelete && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size={selectable ? "icon" : "default"} className={selectable ? "shrink-0" : "flex-1"}>
                                                    {selectable ? <Trash2 className="h-4 w-4" /> : (
                                                        <>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Image
                                                        </>
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete <b>{selectedItem.filename}</b> from the server and remove its record.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDelete();
                                                    }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting}>
                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
