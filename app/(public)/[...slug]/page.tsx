interface PublicPageProps {
    params: Promise<{ slug: string[] }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
    const { slug } = await params;
    const path = `/${slug.join('/')}`;

    // TODO: Module 7 — Dynamically resolve and import the active theme's RSC from /themes
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg text-gray-500">
                Public route: <code className="font-mono">{path}</code>
            </p>
        </div>
    );
}
