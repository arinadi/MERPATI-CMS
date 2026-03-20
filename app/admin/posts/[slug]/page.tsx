import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/actions/posts";
import { getTerms } from "@/lib/actions/terms";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

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
