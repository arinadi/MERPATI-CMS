import Link from "next/link";
import { getPosts } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostsDataTable, PostData } from "@/components/admin/posts-data-table";

export const dynamic = "force-dynamic";

export default async function PostsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    
    // Parse parameters
    const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
    const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
    const statusFilter = typeof searchParams.status === "string" && ["published", "draft", "all"].includes(searchParams.status) 
        ? searchParams.status as "published" | "draft" | "all" 
        : undefined;
    const sortBy = typeof searchParams.sort === "string" ? searchParams.sort : "createdAt";
    const sortOrder = searchParams.order === "asc" ? "asc" : "desc";

    const { items, total, totalPages } = await getPosts("post", page, 20, search, statusFilter, sortBy as "createdAt" | "updatedAt" | "title" | "status", sortOrder);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground mt-1">
                        Mengelola artikel blog Anda. Total {total} publikasi.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Tulis Baru
                    </Link>
                </Button>
            </div>

            <PostsDataTable 
                items={items as unknown as PostData[]} 
                type="post" 
                page={page} 
                totalPages={totalPages} 
                total={total} 
            />
        </div>
    );
}
