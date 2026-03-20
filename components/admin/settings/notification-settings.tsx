"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

interface NotificationSettingsProps {
    botToken: string;
    chatId: string;
    notifyPost: boolean;
    notifyUser: boolean;
}

export default function NotificationSettings({
    botToken: initialToken,
    chatId: initialChatId,
    notifyPost: initialNotifyPost,
    notifyUser: initialNotifyUser
}: NotificationSettingsProps) {
    const [token, setToken] = useState(initialToken);
    const [chatId, setChatId] = useState(initialChatId);
    const [notifyPost, setNotifyPost] = useState(initialNotifyPost);
    const [notifyUser, setNotifyUser] = useState(initialNotifyUser);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await setOptions({
                telegram_bot_token: token,
                telegram_chat_id: chatId,
                telegram_notify_post: notifyPost.toString(),
                telegram_notify_user: notifyUser.toString()
            });

            if (result.success) {
                toast.success("Notification settings updated.");
            } else {
                toast.error(result.error || "Failed to update settings.");
            }
        } catch {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-500" />
                    Telegram Notifications
                </CardTitle>
                <CardDescription>
                    Receive instant alerts on Telegram when important events occur in your CMS.
                    You&apos;ll need a Telegram Bot token and your Chat ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="bot_token">Bot Token</Label>
                        <Input
                            id="bot_token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="123456:ABC-DEF..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="chat_id">Chat ID</Label>
                        <Input
                            id="chat_id"
                            value={chatId}
                            onChange={(e) => setChatId(e.target.value)}
                            placeholder="987654321"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-base">Notification Triggers</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center space-x-2 rounded-lg border p-4 shadow-sm bg-card/50">
                            <Checkbox
                                id="notify_post"
                                checked={notifyPost}
                                onCheckedChange={(checked) => setNotifyPost(!!checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="notify_post"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    New Posts
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Notify when a post is published.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 rounded-lg border p-4 shadow-sm bg-card/50">
                            <Checkbox
                                id="notify_user"
                                checked={notifyUser}
                                onCheckedChange={(checked) => setNotifyUser(!!checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="notify_user"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    New Users
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Notify when a new user joins or is invited.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Notification Settings
                </Button>
            </CardFooter>
        </Card>
    );
}
