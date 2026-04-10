"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ContactLinksManager } from "@/components/admin/theme-options/contact-links-manager";

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

    // Group fields by their group property
    const groupedSchema = schema.reduce((acc, field) => {
        const groupName = field.group || "General";
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(field);
        return acc;
    }, {} as Record<string, typeof schema>);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Configure Theme</h2>
                    <p className="text-muted-foreground">
                        Customize appearance and functionality settings.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save All Changes
                </Button>
            </div>

            <div className="grid gap-6">
                {Object.entries(groupedSchema).map(([groupName, fields]) => (
                    <Card key={groupName} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg">{groupName}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {fields.map((field) => {
                                const value = values[field.id] || "";

                                return (
                                    <div key={field.id} className="grid gap-4 md:grid-cols-[200px_1fr] items-start">
                                        <div className="space-y-1">
                                            <Label htmlFor={field.id} className="text-base">{field.label}</Label>
                                            {field.description && (
                                                <p className="text-xs text-muted-foreground">{field.description}</p>
                                            )}
                                        </div>
                                        
                                        <div className="w-full">
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

                                            {field.type === "color" && (
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        id={field.id}
                                                        type="color"
                                                        value={value || "#000000"}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        className="w-12 p-1 h-10 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        placeholder="#000000"
                                                        className="font-mono"
                                                    />
                                                </div>
                                            )}

                                            {field.type === "contacts" && (
                                                <ContactLinksManager 
                                                    value={value}
                                                    onChange={(val: string) => handleChange(field.id, val)}
                                                />
                                            )}

                                            {(field.type === "select" || field.type === "post") && (
                                                <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={`Select ${field.type === "post" ? "a post" : "an option"}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.type === "select" && field.options?.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                        {field.type === "post" && availablePosts.map((post) => (
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
                                                        Browse
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

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
        </div>
    );
}
