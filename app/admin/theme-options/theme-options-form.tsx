"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2, ImageIcon, X, Check, ChevronsUpDown, Search } from "lucide-react";
import type { ThemeOptionField } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    availableCategories?: { id: string; name: string; slug: string }[];
}

function PostSelector({ value, onChange, posts }: { value: string, onChange: (v: string) => void, posts: {id:string, title:string}[] }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    
    const maxItems = 5;
    const matching = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    const filtered = matching.slice(0, maxItems);
    const selectedTitle = posts.find(p => p.id === value)?.title || "Select a post...";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-background/50 font-normal">
                    <span className="truncate">{selectedTitle}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input 
                       className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                       placeholder="Search posts..."
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1 text-sm">
                    {filtered.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">No posts found.</div>
                    ) : (
                       filtered.map(post => (
                           <div 
                               key={post.id}
                               className={cn(
                                   "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap",
                                   value === post.id ? "bg-accent text-accent-foreground font-medium" : ""
                               )}
                               onClick={() => { onChange(post.id); setOpen(false); setSearch(""); }}
                           >
                               <Check className={cn("mr-2 h-4 w-4 shrink-0", value === post.id ? "opacity-100" : "opacity-0")} />
                               <span className="truncate" title={post.title}>{post.title}</span>
                           </div>
                       ))
                    )}
                    {matching.length > maxItems && (
                        <div className="py-2 text-center text-xs text-muted-foreground bg-muted/50 rounded mt-1">Showing {maxItems} of {matching.length}. Type to search more.</div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}


export default function ThemeOptionsForm({ schema, initialValues, availablePosts, availableCategories = [] }: ThemeOptionsFormProps) {
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
        <div className="relative min-h-[calc(100vh-120px)] pb-24">
            {/* Elegant Header */}
            <div className="mb-10">
                <p className="text-muted-foreground mt-2 text-lg">
                    Customize your site&apos;s identity, appearance, and social integrations in one place.
                </p>
            </div>

            {/* Waterfall (Masonry) Card Grid */}
            <div className="columns-1 lg:columns-2 gap-8 space-y-8 lg:space-y-0">
                {Object.entries(groupedSchema).map(([groupName, fields]) => (
                    <Card key={groupName} className="break-inside-avoid mb-8 border-none shadow-md bg-card/50 backdrop-blur-sm">
                        <CardContent className="space-y-8 pt-8">
                            <h3 className="text-xl font-bold tracking-tight border-b pb-4 mb-2">{groupName}</h3>
                            {fields.map((field) => {
                                const value = values[field.id] || field.defaultValue || "";

                                return (
                                    <div key={field.id} className="space-y-3">
                                        <div className="space-y-1">
                                            <Label htmlFor={field.id} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                                {field.label}
                                            </Label>
                                            {field.description && (
                                                <p className="text-xs text-muted-foreground italic">{field.description}</p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            {(field.type === "text" || field.type === "url" || field.type === "number") && (
                                                <Input
                                                    id={field.id}
                                                    type={field.type === "number" ? "number" : "text"}
                                                    value={value}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                    className="bg-background/50 focus-visible:ring-primary/50"
                                                />
                                            )}

                                            {field.type === "textarea" && (
                                                <Textarea
                                                    id={field.id}
                                                    value={value}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                    rows={4}
                                                    className="bg-background/50 focus-visible:ring-primary/50"
                                                />
                                            )}

                                            {field.type === "checkbox-group" && (
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {field.options?.map((option) => {
                                                        let currentValues: Record<string, boolean> = {};
                                                        try {
                                                            currentValues = JSON.parse(value || "{}");
                                                        } catch {
                                                            currentValues = {};
                                                        }
                                                        const isChecked = currentValues[option.value] ?? false;

                                                        return (
                                                            <label key={option.value} htmlFor={`${field.id}-${option.value}`} className="flex items-center space-x-2 p-3 border rounded-lg bg-background/50 group hover:border-primary/30 transition-colors cursor-pointer w-full">
                                                                <Checkbox
                                                                    id={`${field.id}-${option.value}`}
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValues = { ...currentValues, [option.value]: !!checked };
                                                                        handleChange(field.id, JSON.stringify(newValues));
                                                                    }}
                                                                />
                                                                <span
                                                                    className="text-xs font-medium cursor-pointer select-none flex-grow"
                                                                >
                                                                    {option.label}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {field.type === "color" && (
                                                <div className="flex gap-4 items-center">
                                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-muted shadow-inner">
                                                        <Input
                                                            id={field.id}
                                                            type="color"
                                                            value={value || "#000000"}
                                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                                            className="absolute inset-0 h-full w-full p-0 cursor-pointer border-none"
                                                            style={{ padding: 0, scale: '1.5' }}
                                                        />
                                                    </div>
                                                    <Input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        placeholder="#000000"
                                                        className="font-mono bg-background/50 max-w-[120px]"
                                                    />
                                                </div>
                                            )}

                                            {field.type === "contacts" && (
                                                <div className="rounded-lg border bg-muted/20 p-4">
                                                    <ContactLinksManager
                                                        value={value}
                                                        onChange={(val: string) => handleChange(field.id, val)}
                                                    />
                                                </div>
                                            )}

                                            {(field.type === "select" || field.type === "category") && (
                                                <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder={`Select ${field.type === "category" ? "a category" : "an option"}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.type === "select" && field.options?.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                        {field.type === "category" && availableCategories.map((cat) => (
                                                            <SelectItem key={cat.slug} value={cat.slug}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {field.type === "post" && (
                                                <PostSelector 
                                                    value={value} 
                                                    onChange={(val) => handleChange(field.id, val)}
                                                    posts={availablePosts}
                                                />
                                            )}

                                            {field.type === "category-multi" && (
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {availableCategories.map((cat) => {
                                                        let selectedSlugs: string[] = [];
                                                        try {
                                                            selectedSlugs = JSON.parse(value || "[]");
                                                        } catch {
                                                            selectedSlugs = [];
                                                        }
                                                        const isChecked = selectedSlugs.includes(cat.slug);

                                                        return (
                                                            <label key={cat.slug} htmlFor={`${field.id}-${cat.slug}`} className="flex items-center space-x-2 p-3 border rounded-lg bg-background/50 group hover:border-primary/30 transition-colors cursor-pointer w-full">
                                                                <Checkbox
                                                                    id={`${field.id}-${cat.slug}`}
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => {
                                                                        const newSlugs = checked
                                                                            ? [...selectedSlugs, cat.slug]
                                                                            : selectedSlugs.filter(s => s !== cat.slug);
                                                                        handleChange(field.id, JSON.stringify(newSlugs));
                                                                    }}
                                                                />
                                                                <span className="text-sm font-medium cursor-pointer select-none flex-grow text-foreground">
                                                                    {cat.name}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {field.type === "image" && (
                                                <div className="space-y-4">
                                                    {value ? (
                                                        <div className="flex items-center gap-6 p-4 rounded-xl border bg-background/50 group relative">
                                                            <div className="relative h-20 w-32 shrink-0 rounded-lg border bg-muted/50 overflow-hidden flex items-center justify-center shadow-sm">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={value}
                                                                    alt={field.label}
                                                                    className="max-w-full max-h-full object-contain p-1"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="h-9"
                                                                    onClick={() => {
                                                                        setActiveImageField(field.id);
                                                                        setMediaModalOpen(true);
                                                                    }}
                                                                >
                                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                                    Replace Image
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleChange(field.id, "")}
                                                                >
                                                                    <X className="mr-2 h-4 w-4" />
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 hover:border-primary/50 transition-all rounded-xl"
                                                            onClick={() => {
                                                                setActiveImageField(field.id);
                                                                setMediaModalOpen(true);
                                                            }}
                                                        >
                                                            <div className="p-3 rounded-full bg-muted">
                                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <span className="text-sm text-muted-foreground font-medium">Select {field.label}</span>
                                                        </Button>
                                                    )}

                                                    <Input
                                                        id={field.id}
                                                        value={value}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        placeholder="Or paste URL here..."
                                                        className="h-8 text-[11px] font-mono opacity-40 focus:opacity-100 transition-opacity bg-transparent border-none p-0 focus-visible:ring-0"
                                                    />
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

            {/* Sticky Save Bar */}
            <div className="fixed bottom-6 right-6 md:right-10 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="lg"
                    className="h-14 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform font-bold text-base"
                >
                    {isSaving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Save All Changes
                </Button>
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
