import { db } from "@/db";
import { terms } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import TermsClient from "../taxonomies/terms-client";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const allCategories = await db.query.terms.findMany({
        where: eq(terms.type, "category"),
        orderBy: [asc(terms.name)],
    });

    // In the future, count will come from termRelationships join
    const formattedCategories = allCategories.map(c => ({
        ...c,
        count: 0
    }));

    return <TermsClient initialTerms={formattedCategories} type="category" title="Categories" />;
}
