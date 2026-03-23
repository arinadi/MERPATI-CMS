"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ThemeOptionField } from "@/lib/themes";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import EditorMediaModal from "@/components/admin/editor-media-modal";

interface ThemeOptionsFormProps {
    schema: ThemeOptionField[];
    initialValues: Record<string, string>;
    availablePosts: { id: string; title: string }[];
}

export default function ThemeOptionsForm({ schema, initialValues, availablePosts }: ThemeOptionsFormProps) {
    const [values, setValues] = useState<Record<string, string>>(initialValues);
    const [isSaving, setIsSaving] = useState(false);

    // For image picker
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [activeImageField, setActiveImageField] = useState<string | null>(null);

    const handleChange = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await setOptions(values);
            if (result.success) {
                toast.success("Theme options updated successfully.");
            } else {
                toast.error(result.error || "Failed to update theme options.");
            }
        } catch {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configure Theme</CardTitle>
                <CardDescription>
                    Customize specific options for the currently active theme.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {schema.map((field) => {
                    const value = values[field.id] || "";

                    return (
                        <div key={field.id} className="space-y-2">
                            <Label htmlFor={field.id}>{field.label}</Label>
                            
                            {(field.type === "text" || field.type === "url" || field.type === "number") && (
                                <Input
                                    id={field.id}
                                    type={field.type === "number" ? "number" : "text"}
                                    value={value}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                />
                            )}
                            
                            {field.type === "textarea" && (
                                <Textarea
                                    id={field.id}
                                    value={value}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    rows={4}
                                />
                            )}

                            {field.type === "select" && field.options && (
                                <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {field.type === "post" && (
                                <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a post" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePosts.map((post) => (
                                            <SelectItem key={post.id} value={post.id}>
                                                {post.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {field.type === "image" && (
                                <div className="flex items-center gap-2">
                                    <Input 
                                        id={field.id} 
                                        value={value} 
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setActiveImageField(field.id);
                                            setMediaModalOpen(true);
                                        }}
                                    >
                                        Browse Media
                                    </Button>
                                </div>
                            )}

                            {field.description && (
                                <p className="text-[12px] text-muted-foreground">{field.description}</p>
                            )}
                        </div>
                    );
                })}
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>

            <EditorMediaModal
                open={mediaModalOpen}
                onOpenChange={setMediaModalOpen}
                onInsert={(val) => {
                    if (activeImageField) {
                        handleChange(activeImageField, val);
                        setActiveImageField(null);
                    }
                }}
            />
        </Card>
    );
}
