"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileForm({ initialName }: { initialName: string }) {
    const [name, setName] = useState(initialName);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateProfile({ name });
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Profile updated successfully");
                router.refresh();
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <div className="flex gap-2">
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name..."
                        className="max-w-xs"
                    />
                    <Button onClick={handleSave} disabled={isSaving || name.trim() === ""}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    This is your public display name.
                </p>
            </div>
        </div>
    );
}
