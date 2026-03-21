"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldAlert, ShieldCheck, UserMinus, UserX, Edit2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateUserRole, updateUserStatus, deleteUser, renameUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UserActionsMenuProps {
    user: {
        id: string;
        name: string | null;
        role: "user" | "super_user";
        status?: "active" | "suspended" | string;
    };
    currentUserId?: string;
}

export function UserActionsMenu({ user, currentUserId }: UserActionsMenuProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(user.name || "");

    const isSelf = currentUserId === user.id;

    const handleRoleChange = async () => {
        const newRole = user.role === "super_user" ? "user" : "super_user";
        toast.promise(updateUserRole(user.id, newRole), {
            loading: "Updating role...",
            success: "Role updated successfully",
            error: "Failed to update role",
        });
    };

    const handleStatusChange = async () => {
        // Fallback to active if undefined
        const currentStatus = user.status || "active";
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        toast.promise(updateUserStatus(user.id, newStatus), {
            loading: "Updating status...",
            success: "Status updated successfully",
            error: "Failed to update status",
        });
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${user.name || user.id}? This action cannot be undone.`)) return;
        toast.promise(deleteUser(user.id), {
            loading: "Deleting user...",
            success: "User deleted successfully",
            error: "Failed to delete user",
        });
    };

    const handleRename = async () => {
        if (!newName.trim()) return;
        setIsRenaming(false);
        toast.promise(renameUser(user.id, newName), {
            loading: "Renaming user...",
            success: "User renamed successfully",
            error: "Failed to rename user",
        });
    };

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Rename User
                    </DropdownMenuItem>

                    {!isSelf && (
                        <>
                            <DropdownMenuItem onClick={handleRoleChange}>
                                {user.role === "super_user" ? (
                                    <><ShieldAlert className="mr-2 h-4 w-4" /> Demote to User</>
                                ) : (
                                    <><ShieldCheck className="mr-2 h-4 w-4" /> Promote to Super User</>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleStatusChange}>
                                {(user.status === "suspended") ? (
                                    <><UserCheck className="mr-2 h-4 w-4" /> Reactivate User</>
                                ) : (
                                    <><UserMinus className="mr-2 h-4 w-4" /> Suspend User</>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                <UserX className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename User</DialogTitle>
                        <DialogDescription>
                            Enter a new display name for this user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            placeholder="Name..." 
                            onKeyDown={(e) => { if (e.key === "Enter") handleRename() }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenaming(false)}>Cancel</Button>
                        <Button onClick={handleRename} disabled={!newName.trim()}>Save Name</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Quick inline icon since lucide might not have UserCheck immediately available or imported above
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    )
}
