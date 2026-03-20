import { PostEditor } from "@/components/admin/post-editor";
import { getTerms } from "@/lib/actions/terms";

export default async function NewPostPage() {
    const [{ terms: categories }, { terms: tags }] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
    ]);

    return (
        <PostEditor
            type="post"
            availableCategories={categories || []}
            availableTags={tags || []}
        />
    );
}
