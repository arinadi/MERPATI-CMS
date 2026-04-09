"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTerm, updateTerm } from "@/lib/actions/terms";
import { toast } from "sonner";
import { Edit } from "lucide-react";

type Term = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
};

// Helper: build a flat list from hierarchical terms for the select dropdown
const buildTermOptions = (terms: Term[], parentId: string | null = null, depth = 0): { term: Term, depth: number }[] => {
    let result: { term: Term, depth: number }[] = [];
    const children = terms.filter(t => t.parentId === parentId);

    for (const child of children) {
        result.push({ term: child, depth });
        result = result.concat(buildTermOptions(terms, child.id, depth + 1));
    }

    return result;
};

export default function TermForm({
    taxonomy,
    terms = [],
    initialTerm
}: {
    taxonomy: "category" | "tag";
    terms?: Term[];
    initialTerm?: Term | null;
    key?: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(initialTerm?.name || "");
    const [slug, setSlug] = useState(initialTerm?.slug || "");
    const [description, setDescription] = useState(initialTerm?.description || "");
    const [parentId, setParentId] = useState<string>(initialTerm?.parentId || "none");

    const isCategory = taxonomy === "category";
    const isEdit = !!initialTerm;

    const termOptions = isCategory ? buildTermOptions(terms) : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const data = {
            name,
            slug: slug || undefined,
            taxonomy,
            description: description || undefined,
            parentId: parentId === "none" ? null : parentId,
        };

        let result;
        if (isEdit) {
            // Cannot set parent to self
            if (parentId === initialTerm.id) {
                setError("A term cannot be its own parent.");
                setIsLoading(false);
                return;
            }
            result = await updateTerm(initialTerm.id, data);
        } else {
            result = await createTerm(data);
        }

        if (result.error) {
            setError(result.error);
            toast.error(result.error);
            setIsLoading(false);
        } else {
            toast.success(`${isCategory ? "Category" : "Tag"} ${isEdit ? "updated" : "added"} successfully.`);
            // Reset if creating new
            if (!isEdit) {
                setName("");
                setSlug("");
                setDescription("");
                setParentId("none");
            }
            setIsLoading(false);
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">
                    {isEdit ? (
                        <span className="flex items-center gap-2 text-primary">
                            <Edit className="h-5 w-5" />
                            Editing {isCategory ? "Category" : "Tag"}
                        </span>
                    ) : (
                        `Add New ${isCategory ? "Category" : "Tag"}`
                    )}
                </h3>
                {isEdit && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        ID: {initialTerm.id.slice(0, 8)}...
                    </span>
                )}
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Technology"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g. technology"
                />
                <p className="text-xs text-muted-foreground">
                    Leave empty to auto-generate from name.
                </p>
            </div>

            {isCategory && (
                <div className="space-y-2">
                    <Label htmlFor="parent">Parent Category</Label>
                    <Select value={parentId} onValueChange={setParentId}>
                        <SelectTrigger>
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {termOptions.map(({ term, depth }) => (
                                <SelectItem key={term.id} value={term.id}>
                                    {"—".repeat(depth)} {term.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    The description is not prominent by default; however, some themes may show it.
                </p>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEdit ? "Update" : "Add New"}
            </Button>

            {isEdit && (
                <Button type="button" variant="outline" className="ml-2" onClick={() => {
                    // Quick way to cancel edit - navigate back to base route
                    router.push(`/admin/${taxonomy === "category" ? "categories" : "tags"}`);
                }}>
                    Cancel
                </Button>
            )}
        </form>
    );
}
