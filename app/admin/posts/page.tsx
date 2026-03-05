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
                                    No posts yet. Create your first post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/admin/posts/${post.id}`}
                                            className="hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
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
                                    <TableCell className="text-muted-foreground">
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
                                                    href={`/admin/posts/${post.id}`}
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
        </div>
    );
}
