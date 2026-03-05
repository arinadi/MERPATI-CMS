import Link from "next/link";
import { getPosts } from "@/lib/actions/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

export default async function PagesPage() {
    const { items, total } = await getPosts("page");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground">
                        Manage your static pages. {total} total.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/pages/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                    </Link>
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-24 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground py-12"
                                >
                                    No pages yet. Create your first page!
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/admin/pages/${page.id}`}
                                            className="hover:underline"
                                        >
                                            {page.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {page.authorName ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                page.status === "published"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {page.status === "published"
                                                ? "Published"
                                                : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDate(page.updatedAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                className="h-8 w-8"
                                            >
                                                <Link href={`/admin/pages/${page.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeletePostButton
                                                postId={page.id}
                                                postTitle={page.title}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
                        No pages yet. Create your first page!
                    </div>
                ) : (
                    items.map((page) => (
                        <div
                            key={page.id}
                            className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <Link
                                    href={`/admin/pages/${page.id}`}
                                    className="font-semibold text-lg hover:underline leading-tight"
                                >
                                    {page.title}
                                </Link>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                        className="h-9 w-9 rounded-lg"
                                    >
                                        <Link href={`/admin/pages/${page.id}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <DeletePostButton
                                        postId={page.id}
                                        postTitle={page.title}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                                <Badge
                                    variant={
                                        page.status === "published"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider"
                                >
                                    {page.status}
                                </Badge>
                                <span className="flex items-center gap-1">
                                    {formatDate(page.updatedAt)}
                                </span>
                                {page.authorName && (
                                    <span className="flex items-center gap-1">
                                        • {page.authorName}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
