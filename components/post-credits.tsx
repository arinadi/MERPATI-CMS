type Credit = { name: string | null } | null | undefined;

// A credit without a name (user never set one) is skipped instead of printing "Reporter: null".
export function PostCredits({ reporter, editor, className }: { reporter?: Credit; editor?: Credit; className?: string }) {
    const lines = [
        reporter?.name ? `Reporter: ${reporter.name}` : null,
        editor?.name ? `Editor: ${editor.name}` : null,
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
