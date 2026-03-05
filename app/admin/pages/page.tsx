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

            <div className="rounded-xl border bg-card shadow-sm">
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
                                    <TableCell className="text-muted-foreground">
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
                                    <TableCell className="text-muted-foreground">
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
        </div>
    );
}
