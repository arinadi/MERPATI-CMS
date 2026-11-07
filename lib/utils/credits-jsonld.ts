type Person = { name: string };

interface CreditsJsonLdInput {
    reporters: Person[];
    editors: Person[];
    postAuthorName: string | null | undefined;
    baseUrl: string;
}

// The reporters are the byline authors; without any, fall back to whoever created the post.
export function creditsJsonLd({ reporters, editors, postAuthorName, baseUrl }: CreditsJsonLdInput) {
    const authors = reporters.length > 0 ? reporters.map((p) => p.name) : [postAuthorName || "Editor"];
    return {
        author: authors.map((name) => ({ "@type": "Person", name, url: baseUrl })),
        ...(editors.length > 0 && {
            editor: editors.map((p) => ({ "@type": "Person", name: p.name })),
        }),
    };
}
