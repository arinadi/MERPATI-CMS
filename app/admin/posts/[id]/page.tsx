import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post || post.type !== "post") {
        notFound();
    }

    return <PostEditor type="post" post={post} />;
}
