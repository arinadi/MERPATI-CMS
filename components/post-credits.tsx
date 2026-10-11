type Person = { name: string };

export function PostCredits({ reporters, editors, className }: { reporters?: Person[]; editors?: Person[]; className?: string }) {
    const lines = [
        reporters?.length ? `Reporter: ${reporters.map((p) => p.name).join(", ")}` : null,
        editors?.length ? `Editor: ${editors.map((p) => p.name).join(", ")}` : null,
    ].filter((line): line is string => line !== null);

    if (lines.length === 0) return null;

    return (
        <div className={className}>
            {lines.map((line) => (
                <span key={line}>{line}</span>
            ))}
        </div>
    );
}
