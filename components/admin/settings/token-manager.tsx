"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createToken, revokeToken } from "@/lib/actions/tokens";
import { Key, Trash2, Copy, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Token {
    id: string;
    name: string;
    lastUsedAt: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
}

export default function TokenManager({ initialTokens }: { initialTokens: Token[] }) {
    const [tokens, setTokens] = useState<Token[]>(initialTokens);
    const [name, setName] = useState("");
    const [newToken, setNewToken] = useState<string | null>(null);
    const [showToken, setShowToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate() {
        if (!name.trim()) return toast.error("Token name is required");
        
        setIsLoading(true);
        try {
            const res = await createToken(name);
            setNewToken(res.token);
            setShowToken(true);
            setTokens([{
                id: res.id,
                name: res.name,
                lastUsedAt: null,
                expiresAt: res.expiresAt,
                createdAt: new Date()
            }, ...tokens]);
            setName("");
            toast.success("Token created successfully");
        } catch (error) {
            toast.error("Failed to create token");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRevoke(id: string) {
        if (!confirm("Are you sure you want to revoke this token? Any app using it will lose access.")) return;

        try {
            await revokeToken(id);
            setTokens(tokens.filter(t => t.id !== id));
            toast.success("Token revoked");
        } catch (error) {
            toast.error("Failed to revoke token");
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Token</CardTitle>
                    <CardDescription>
                        Generate a Personal Access Token to access the CMS via API.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input 
                            placeholder="Token Name (e.g. Mobile App, Gemini Cursor)" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="max-w-md"
                        />
                        <Button onClick={handleCreate} disabled={isLoading}>
                            <Key className="mr-2 h-4 w-4" />
                            Generate Token
                        </Button>
                    </div>

                    {newToken && (
                        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-sm font-medium text-yellow-500 mb-2">
                                Important: Copy this token now. You won&apos;t be able to see it again!
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input 
                                        readOnly 
                                        value={newToken} 
                                        type={showToken ? "text" : "password"}
                                        className="font-mono pr-10"
                                    />
                                    <button 
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showToken ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                                <Button variant="secondary" onClick={() => copyToClipboard(newToken)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Tokens</CardTitle>
                    <CardDescription>
                        Manage your existing personal access tokens.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tokens.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No active tokens found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tokens.map((token) => (
                                    <TableRow key={token.id}>
                                        <TableCell className="font-medium">{token.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleString() : "Never"}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(token.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRevoke(token.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
