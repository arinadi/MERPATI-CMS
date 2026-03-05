import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts";
import { getTerms } from "@/lib/actions/terms";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post || post.error || !post.post || post.post.type !== "post") {
        notFound();
    }

    const [{ terms: categories }, { terms: tags }] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
    ]);

    return (
        <PostEditor
            type="post"
            post={post.post}
            availableCategories={categories || []}
            availableTags={tags || []}
        />
    );
}
