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

export default async function PostsPage() {
    const { items, total } = await getPosts("post");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground">
                        Manage your blog posts. {total} total.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
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
                                    No posts yet. Create your first post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/admin/posts/${post.slug}`}
                                            className="hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {post.authorName ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                post.status === "published"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {post.status === "published"
                                                ? "Published"
                                                : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDate(post.updatedAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                className="h-8 w-8"
                                            >
                                                <Link
                                                    href={`/admin/posts/${post.slug}`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeletePostButton
                                                postId={post.id}
                                                postTitle={post.title}
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
                        No posts yet. Create your first post!
                    </div>
                ) : (
                    items.map((post) => (
                        <div
                            key={post.id}
                            className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <Link
                                    href={`/admin/posts/${post.slug}`}
                                    className="font-semibold text-lg hover:underline leading-tight"
                                >
                                    {post.title}
                                </Link>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                        className="h-9 w-9 rounded-lg"
                                    >
                                        <Link href={`/admin/posts/${post.slug}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <DeletePostButton
                                        postId={post.id}
                                        postTitle={post.title}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                                <Badge
                                    variant={
                                        post.status === "published"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider"
                                >
                                    {post.status}
                                </Badge>
                                <span className="flex items-center gap-1">
                                    {formatDate(post.updatedAt)}
                                </span>
                                {post.authorName && (
                                    <span className="flex items-center gap-1">
                                        • {post.authorName}
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
