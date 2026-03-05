"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaUploaderProps {
    onUploadSuccess: () => void;
    onUploadStart?: () => void;
}

export default function MediaUploader({ onUploadSuccess, onUploadStart }: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            return;
        }

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        setError(null);
        setIsUploading(true);
        onUploadStart?.();

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Need to dynamically import the server action because this client component
            // passes FormData, which is supported, but simpler to keep separation of concerns.
            const { uploadMedia } = await import("@/lib/actions/media");
            const result = await uploadMedia(formData);

            if (result.error) {
                setError(result.error);
            } else {
                onUploadSuccess();
            }
        } catch (err) {
            setError("An unexpected error occurred during upload.");
            console.error(err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await handleUpload(file);
        }
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    }`}
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                        <UploadCloud className="h-6 w-6 text-primary" />
                    )}
                </div>
                <h3 className="mb-1 text-lg font-semibold">
                    {isUploading ? "Uploading..." : "Click or drag file to this area to upload"}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Support for a single image upload (JPEG, PNG, GIF, WEBP) up to 5MB.
                </p>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                    }}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                />

                <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Select File
                </Button>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">
                    {error}
                </div>
            )}
        </div>
    );
}
