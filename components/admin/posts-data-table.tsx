"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, ArrowUpRight, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, ListChecks } from "lucide-react";
import { bulkActionPosts, deletePost } from "@/lib/actions/posts";
import { toast } from "sonner"; // Assuming Sonner is used for toasts, standard in modern setups

function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

// Simple useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export type PostData = {
    id: string;
    title: string;
    slug: string;
    status: "published" | "draft" | string;
    type: "post" | "page" | string;
    authorName?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

interface PostsDataTableProps {
    items: PostData[];
    type: "post" | "page";
    page: number;
    totalPages: number;
    total: number;
}

export function PostsDataTable({ items, type, page, totalPages, total }: PostsDataTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // States for bulk select
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // States for search & filter
    const initialSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const debouncedSearch = useDebounce(searchTerm, 400);

    const statusFilter = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";

    // Modals
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [isSingularDeleteModalOpen, setIsSingularDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    // Sync URL when filters change
    const createQueryString = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        return params.toString();
    }, [searchParams]);

    useEffect(() => {
        // Only update if search actually changed to prevent loop
        if (debouncedSearch !== (searchParams.get("search") || "")) {
            startTransition(() => {
                router.push(`${pathname}?${createQueryString({ search: debouncedSearch || null, page: "1" })}`, { scroll: false });
            });
        }
    }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

    const handleSort = (column: string) => {
        const isDesc = sortBy === column && sortOrder === "desc";
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ sort: column, order: isDesc ? "asc" : "desc", page: "1" })}`, { scroll: false });
        });
    };

    const handleStatusFilterChange = (val: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ status: val === "all" ? null : val, page: "1" })}`, { scroll: false });
        });
    };

    // Bulk selection
    const toggleSelectAll = () => {
        if (selectedIds.size === items.length && items.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(i => i.id)));
        }
    };

    const toggleSelectOne = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    // Bulk Actions
    const executeBulkAction = async (action: "delete" | "publish" | "draft") => {
        setIsBulkDeleteModalOpen(false);
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        try {
            const res = await bulkActionPosts(ids, action, type);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(`Bulk action "${action}" successfully applied.`);
                setSelectedIds(new Set()); // clear
            }
        } catch {
            toast.error("System error occurred during update.");
        }
    };

    // Singular Actions
    const executeDeleteOne = async () => {
        if (!postToDelete) return;
        setIsSingularDeleteModalOpen(false);
        try {
            const res = await deletePost(postToDelete);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Item successfully deleted.");
            }
        } catch {
            toast.error("An error occurred.");
        }
        setPostToDelete(null);
    };

    // Rendering Helpers
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30 group-hover:opacity-100" />;
        return <ArrowUpDown className={`ml-1 h-3 w-3 text-black dark:text-white ${sortOrder === "desc" ? "rotate-180" : ""}`} />;
    };

    const isEmptyStateAndFiltering = items.length === 0 && (searchTerm || statusFilter !== "all");

    // Double-click navigation handler
    const handleRowDoubleClick = (slug: string) => {
        router.push(`/admin/${type === "page" ? "pages" : "posts"}/${slug}`);
    };

    return (
        <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
                    <Input 
                        placeholder="Search title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-[250px]"
                    />
                    <div className="flex flex-1 sm:flex-none gap-2">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="flex-1 sm:w-[140px] sm:flex-none">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        {items.length > 0 && selectedIds.size === 0 && (
                            <Button variant="outline" size="icon" onClick={toggleSelectAll} className="h-10 w-10 md:hidden flex-shrink-0" title="Select All">
                                <ListChecks className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
                </div>

                {/* Bulk Actions Menu (Visible when items are selected) */}
                {selectedIds.size > 0 && (
                    <div className="flex flex-wrap items-center gap-2 bg-muted/50 p-1.5 rounded-lg border slide-in-from-bottom-2 animate-in w-full lg:w-auto justify-between lg:justify-end overflow-x-auto overflow-y-hidden">
                        <div className="flex items-center">
                            <span className="text-sm font-medium px-2 text-muted-foreground mr-1 whitespace-nowrap">{selectedIds.size} selected</span>
                            {selectedIds.size < items.length && (
                                <Button variant="ghost" size="sm" onClick={toggleSelectAll} className="h-8 text-xs text-primary px-2 whitespace-nowrap">Select All</Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="h-8 text-xs px-2 hover:text-destructive whitespace-nowrap">Clear</Button>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-border mx-1"></div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => executeBulkAction("publish")} className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50 shadow-sm whitespace-nowrap">Publish</Button>
                            <Button variant="outline" size="sm" onClick={() => executeBulkAction("draft")} className="h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50 shadow-sm whitespace-nowrap">Draft</Button>
                            <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteModalOpen(true)} className="h-8 text-xs shadow-sm whitespace-nowrap"><Trash2 className="w-3 h-3 md:mr-1"/> <span className="hidden md:inline">Delete</span></Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden relative">
                <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                    <Table>
                        <TableHeader className="bg-card sticky top-0 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="w-12 text-center pl-4">
                                    <Checkbox
                                        checked={selectedIds.size === items.length && items.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead className="cursor-pointer group select-none hover:bg-muted/30" onClick={() => handleSort("title")}>
                                    <div className="flex items-center">Title {renderSortIcon("title")}</div>
                                </TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead className="cursor-pointer group select-none hover:bg-muted/30" onClick={() => handleSort("status")}>
                                    <div className="flex items-center">Status {renderSortIcon("status")}</div>
                                </TableHead>
                                <TableHead className="cursor-pointer group select-none hover:bg-muted/30" onClick={() => handleSort("createdAt")}>
                                    <div className="flex items-center">Created At {renderSortIcon("createdAt")}</div>
                                </TableHead>
                                <TableHead className="w-32 text-right pr-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        {isEmptyStateAndFiltering ? (
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <p className="text-muted-foreground">No results match the filter.</p>
                                                <Button variant="outline" onClick={() => { setSearchTerm(""); startTransition(() => router.push(pathname)); }}>Clear Filter</Button>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No data yet. Create a new entry first!</p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((post) => (
                                    <TableRow 
                                        key={post.id} 
                                        className="group cursor-pointer hover:bg-muted/40 transition-colors"
                                        onClick={(e) => {
                                            if (selectedIds.size > 0) {
                                                const target = e.target as HTMLElement;
                                                if (!target.closest("button") && !target.closest("a") && !target.closest("[role='checkbox']")) {
                                                    toggleSelectOne(post.id);
                                                }
                                            }
                                        }}
                                        onDoubleClick={(e) => {
                                            if (selectedIds.size === 0) {
                                                const target = e.target as HTMLElement;
                                                if (!target.closest("button") && !target.closest("a") && !target.closest("[role='checkbox']")) {
                                                    handleRowDoubleClick(post.slug);
                                                }
                                            }
                                        }}
                                    >
                                        <TableCell 
                                            className="pl-4 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelectOne(post.id);
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedIds.has(post.id)}
                                                onCheckedChange={() => toggleSelectOne(post.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="pointer-events-none"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                            <Link href={`/admin/${type === "page" ? "pages" : "posts"}/${post.slug}`} className="hover:underline hover:text-primary transition-colors">
                                                {post.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {post.authorName ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={post.status === "published" ? "default" : "secondary"} className={post.status === "published" ? "bg-green-100 text-green-800 hover:bg-green-100 border-none print-color-adjust" : "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"}>
                                                {post.status === "published" ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDate(post.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/${post.slug}`} target="_blank">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                        <span className="sr-only">View Original</span>
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/admin/${type === "page" ? "pages" : "posts"}/${post.slug}`}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPostToDelete(post.id);
                                                        setIsSingularDeleteModalOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {items.length === 0 ? (
                    <div className="rounded-xl border bg-card p-8 flex flex-col items-center justify-center text-center">
                        {isEmptyStateAndFiltering ? (
                            <div className="space-y-3">
                                                <p className="text-muted-foreground">No results found.</p>
                                                <Button variant="outline" onClick={() => { setSearchTerm(""); router.push(pathname); }}>Clear Filter</Button>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No data yet.</p>
                        )}
                    </div>
                ) : (
                    items.map((post) => (
                        <div 
                            key={post.id} 
                            className="rounded-xl border bg-card overflow-hidden shadow-sm flex relative cursor-pointer"
                            onClick={(e) => {
                                if (selectedIds.size > 0) {
                                    const target = e.target as HTMLElement;
                                    if (!target.closest("button") && !target.closest("a") && !target.closest("[role='checkbox']")) {
                                        toggleSelectOne(post.id);
                                    }
                                }
                            }}
                        >
                            {/* Mobile Selection Strip */}
                            <div 
                                className={`w-10 border-r flex items-center justify-center cursor-pointer transition-colors ${selectedIds.has(post.id) ? 'bg-primary/10 hover:bg-primary/20' : 'bg-muted/10 hover:bg-muted/30'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelectOne(post.id);
                                }}
                            >
                                <Checkbox
                                    checked={selectedIds.has(post.id)}
                                    onCheckedChange={() => toggleSelectOne(post.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="pointer-events-none"
                                />
                            </div>
                            <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <Link
                                        href={`/admin/${type === "page" ? "pages" : "posts"}/${post.slug}`}
                                        className="font-medium hover:underline text-lg line-clamp-1 break-all"
                                    >
                                        {post.title}
                                    </Link>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 font-medium">{post.authorName ?? "—"}</span>
                                    <span>•</span>
                                    <time>{formatDate(post.createdAt)}</time>
                                    <Badge variant="outline" className={post.status === "published" ? "text-green-600 border-green-200" : "text-amber-600 border-amber-200"}>
                                        {post.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 justify-end border-t pt-3">
                                    <Button variant="outline" size="sm" asChild className="h-8">
                                        <Link href={`/${post.slug}`} target="_blank">View</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild className="h-8">
                                        <Link href={`/admin/${type === "page" ? "pages" : "posts"}/${post.slug}`}>Edit</Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            setPostToDelete(post.id);
                                            setIsSingularDeleteModalOpen(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span> (Total: {total})
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => router.push(`${pathname}?${createQueryString({ page: "1" })}`)}
                            disabled={page <= 1}
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`${pathname}?${createQueryString({ page: (page - 1).toString() })}`)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`${pathname}?${createQueryString({ page: (page + 1).toString() })}`)}
                            disabled={page >= totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => router.push(`${pathname}?${createQueryString({ page: totalPages.toString() })}`)}
                            disabled={page >= totalPages}
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Bulk Actions Alert Dialog */}
            <AlertDialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete All Selected?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Confirming will permanently delete {selectedIds.size} data entries.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => executeBulkAction("delete")} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Yes, Delete All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Single Delete Alert Dialog */}
            <AlertDialog open={isSingularDeleteModalOpen} onOpenChange={setIsSingularDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Data will be permanently deleted from the server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDeleteOne} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
