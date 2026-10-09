import { Label } from "@/components/ui/label";

export interface CreditUser {
    id: string;
    name: string | null;
    email: string;
}

interface PostCreditsFieldsProps {
    users: CreditUser[];
    reporterId: string | null;
    editorId: string | null;
    onChange: (credits: { reporterId: string | null; editorId: string | null }) => void;
}

// Native selects keep this usable on mobile and testable; the lists are short (one newsroom's users).
const selectClass =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function PostCreditsFields({ users, reporterId, editorId, onChange }: PostCreditsFieldsProps) {
    const fields = [
        { id: "post-reporter", label: "Reporter", value: reporterId, key: "reporterId" },
        { id: "post-editor", label: "Editor", value: editorId, key: "editorId" },
    ] as const;

    return (
        <div className="space-y-3">
            {fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <select
                        id={field.id}
                        className={selectClass}
                        value={field.value ?? ""}
                        onChange={(e) =>
                            onChange({ reporterId, editorId, [field.key]: e.target.value || null })
                        }
                    >
                        <option value="">— None —</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
