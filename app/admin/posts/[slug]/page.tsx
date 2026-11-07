import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/actions/posts";
import { getTerms } from "@/lib/actions/terms";
import { getCreditPeople } from "@/lib/actions/people";
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

    const [{ terms: categories }, { terms: tags }, { people }] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
        getCreditPeople(),
    ]);
    // The writer is the stored author; a deleted or suspended author has no entry here and shows a dash.
    const writerName = people?.find((p) => p.userId === post.post.authorId)?.name ?? null;

    return (
        <PostEditor
            type="post"
            post={post.post}
            availableCategories={categories || []}
            availableTags={tags || []}
            availablePeople={people ?? []}
            writerName={writerName}
        />
    );
}
