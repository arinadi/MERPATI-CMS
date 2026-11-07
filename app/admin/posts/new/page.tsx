import { PostEditor } from "@/components/admin/post-editor";
import { auth } from "@/auth";
import { getTerms } from "@/lib/actions/terms";
import { getCreditPeople } from "@/lib/actions/people";

export default async function NewPostPage() {
    const session = await auth();
    const [{ terms: categories }, { terms: tags }, { people }] = await Promise.all([
        getTerms("category"),
        getTerms("tag"),
        getCreditPeople(),
    ]);
    // The writer of a new post is the signed-in user, who is saved as the author.
    const writerName = people?.find((p) => p.userId === session?.user?.id)?.name ?? null;

    return (
        <PostEditor
            type="post"
            availableCategories={categories || []}
            availableTags={tags || []}
            availablePeople={people ?? []}
            writerName={writerName}
        />
    );
}
