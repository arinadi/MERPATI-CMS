import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post || post.error || !post.post || post.post.type !== "page") {
        notFound();
    }

    return <PostEditor type="page" post={post.post} />;
}
