// The writer is the post's author (the creator), so this card only shows it and never changes it.
// A missing name shows a dash, not the account's email: the admin picker never shows emails either.
export function PostWriter({ name }: { name: string | null }) {
    return <p className="text-sm">{`Penulis: ${name ?? "—"}`}</p>;
}
