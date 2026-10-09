import { PostEditor } from "@/components/admin/post-editor";
import { getTerms } from "@/lib/actions/terms";
import { getUsers } from "@/lib/actions/users";

export default async function NewPostPage() {
    const [{ terms: categories }, { terms: tags }, users] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
        getUsers(),
    ]);

    return (
        <PostEditor
            type="post"
            availableCategories={categories || []}
            availableTags={tags || []}
            availableUsers={users.filter((u) => u.status === "active")}
        />
    );
}
