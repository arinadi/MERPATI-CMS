import { db } from "@/db";
import { terms } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import TermsClient from "../taxonomies/terms-client";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
    const allTags = await db.query.terms.findMany({
        where: eq(terms.type, "tag"),
        orderBy: [asc(terms.name)],
    });

    const formattedTags = allTags.map(t => ({
        ...t,
        count: 0
    }));

    return <TermsClient initialTerms={formattedTags} type="tag" title="Tags" />;
}
