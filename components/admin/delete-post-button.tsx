"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/posts";

export function DeletePostButton({
    postId,
    postTitle,
}: {
    postId: string;
    postTitle: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (
            !confirm(
                `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
            )
        )
            return;

        startTransition(async () => {
            const result = await deletePost(postId);
            if (!result.error) {
                router.refresh();
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}
