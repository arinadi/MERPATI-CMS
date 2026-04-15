"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Download, Send } from "lucide-react";
import { toast } from "sonner";
import { generateDatabaseBackup, runBackupAndNotify } from "@/lib/actions/backup";

export default function BackupSettings() {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isSendingToTelegram, setIsSendingToTelegram] = useState(false);

    async function handleDownloadBackup() {
        setIsBackingUp(true);
        try {
            const result = await generateDatabaseBackup();
            if (result.success) {
                const blob = new Blob([result.content], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = result.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Backup downloaded successfully");
            } else {
                toast.error(result.error || "Failed to generate backup");
            }
        } catch {
            toast.error("An unexpected error occurred during backup");
        } finally {
            setIsBackingUp(false);
        }
    }

    async function handleSendToTelegram() {
        setIsSendingToTelegram(true);
        try {
            const result = await runBackupAndNotify();
            if (result.success) {
                toast.success("Backup sent to Telegram successfully");
            } else {
                toast.error(result.error || "Failed to send backup to Telegram");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSendingToTelegram(false);
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Database Backup
                    </CardTitle>
                    <CardDescription>
                        Generate and download a complete backup of your database in JSON format.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button 
                        onClick={handleDownloadBackup} 
                        disabled={isBackingUp}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {isBackingUp ? "Generating..." : "Download Backup"}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handleSendToTelegram} 
                        disabled={isSendingToTelegram}
                        className="flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        {isSendingToTelegram ? "Sending..." : "Send to Telegram"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
