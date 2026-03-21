import { auth } from "@/auth";
import { getUsers } from "@/lib/actions/users";
import { isSuperUser } from "@/lib/rbac";
import { InviteUserDialog } from "@/components/admin/invite-user-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getInitials(name?: string | null): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default async function UsersPage() {
    const session = await auth();
    const userList = await getUsers();
    const canInvite = isSuperUser(session?.user?.role);
    const currentUserId = session?.user?.id;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage your team members and invite new users.
                    </p>
                </div>
                {canInvite && <InviteUserDialog />}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            userList.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user.image ?? undefined}
                                                alt={user.name ?? "User"}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {user.name ?? "—"}
                                            {user.status === "suspended" && (
                                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider shrink-0">
                                                    Suspended
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "super_user" ? "default" : "secondary"}
                                            className="text-[10px] uppercase font-bold tracking-wider"
                                        >
                                            {user.role === "super_user" ? "Super User" : "User"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <UserActionsMenu user={user as {
                                            id: string;
                                            name: string | null;
                                            role: "user" | "super_user";
                                            status: string;
                                        }} currentUserId={currentUserId} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {userList.length === 0 ? (
                    <div className="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
                        No users found.
                    </div>
                ) : (
                    userList.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4"
                        >
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage
                                    src={user.image ?? undefined}
                                    alt={user.name ?? "User"}
                                />
                                <AvatarFallback>
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold truncate">
                                        {user.name ?? "—"}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {user.status === "suspended" && (
                                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider shrink-0">
                                                Suspended
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={user.role === "super_user" ? "default" : "secondary"}
                                            className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider shrink-0"
                                        >
                                            {user.role === "super_user" ? "Admin" : "User"}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    Joined {formatDate(user.createdAt)}
                                </p>
                            </div>
                            <UserActionsMenu user={user as {
                                id: string;
                                name: string | null;
                                role: "user" | "super_user";
                                status: string;
                            }} currentUserId={currentUserId} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
