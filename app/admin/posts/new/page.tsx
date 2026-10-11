import { PostEditor } from "@/components/admin/post-editor";
import { getTerms } from "@/lib/actions/terms";
import { getCreditPeople } from "@/lib/actions/people";

export default async function NewPostPage() {
    const [{ terms: categories }, { terms: tags }, { people }] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
        getCreditPeople(),
    ]);

    return (
        <PostEditor
            type="post"
            availableCategories={categories || []}
            availableTags={tags || []}
            availablePeople={people ?? []}
        />
    );
}
