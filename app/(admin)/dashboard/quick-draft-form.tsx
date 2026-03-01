"use client";

import { useTransition, useRef } from "react";
import { saveQuickDraft } from "@/app/actions/posts";

export default function QuickDraftForm() {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const action = (formData: FormData) => {
        startTransition(async () => {
            const result = await saveQuickDraft(formData);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else {
                formRef.current?.reset();
            }
        });
    };

    return (
        <form ref={formRef} action={action} className="quick-draft-form">
            <input type="text" name="title" placeholder="Judul" required disabled={isPending} />
            <textarea name="content" placeholder="Tulis sesuatu..." disabled={isPending} />
            <div>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Save Draft"}
                </button>
            </div>
        </form>
    );
}
