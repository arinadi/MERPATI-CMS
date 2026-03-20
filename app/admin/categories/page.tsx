import { getTerms } from "@/lib/actions/terms";
import TermForm from "@/components/admin/terms/term-form";
import DeleteTermButton from "@/components/admin/terms/delete-term-button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Categories - MERPATI Admin",
};

export default async function CategoriesPage({
    searchParams
}: {
    searchParams?: Promise<{ edit?: string }>
}) {
    const params = await searchParams;
    const editId = params?.edit;

    const { terms, error } = await getTerms("category");

    if (error || !terms) {
        return <div className="p-8 text-destructive">{error || "Failed to load categories"}</div>;
    }

    // Build hierarchy for table display
    const buildTree = (parentId: string | null = null, depth = 0): { term: typeof terms[0], depth: number }[] => {
        let result: { term: typeof terms[0], depth: number }[] = [];
        const children = terms.filter(t => t.parentId === parentId);

        for (const child of children) {
            result.push({ term: child, depth });
            result = result.concat(buildTree(child.id, depth + 1));
        }

        return result;
    };

    const sortedTerms = buildTree();

    const editTerm = editId ? terms.find(t => t.id === editId) : null;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground mt-2">
                    Manage hierarchical post categorization.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 bg-card border rounded-lg p-6 shadow-sm">
                    {/* Add/Edit Form */}
                    <TermForm
                        taxonomy="category"
                        terms={terms}
                        initialTerm={editTerm}
                    />
                </div>

                <div className="md:col-span-2">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium">Slug</th>
                                    <th className="px-4 py-3 font-medium text-right w-[100px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sortedTerms.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedTerms.map(({ term, depth }) => (
                                        <tr key={term.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                <span
                                                    className="inline-block text-muted-foreground mr-2 font-normal"
                                                    style={{ marginLeft: `${depth * 1}rem` }}
                                                >
                                                    {depth > 0 && "—"} {term.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">
                                                {term.description || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {term.slug}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                                                        <Link href={`/admin/categories?edit=${term.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                    <DeleteTermButton id={term.id} taxonomy="category" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-3">
                        {sortedTerms.length === 0 ? (
                            <div className="rounded-lg border border-dashed bg-card p-8 text-center text-muted-foreground">
                                No categories found.
                            </div>
                        ) : (
                            sortedTerms.map(({ term, depth }) => (
                                <div
                                    key={term.id}
                                    className="rounded-lg border bg-card p-4 shadow-sm space-y-3"
                                    style={{ marginLeft: `${depth * 0.75}rem` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold truncate">
                                                {term.name}
                                            </h3>
                                            <code className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                                                {term.slug}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                                                <Link href={`/admin/categories?edit=${term.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteTermButton id={term.id} taxonomy="category" />
                                        </div>
                                    </div>
                                    {term.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 italic">
                                            {term.description}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
