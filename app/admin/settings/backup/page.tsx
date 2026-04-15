import BackupSettings from "@/components/admin/settings/backup-settings";

export const metadata = {
    title: "Database Backup - MERPATI Admin",
};

export default async function BackupSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">Database Backup</h1>
                <p className="text-muted-foreground">
                    Manage manual and automatic database backups.
                </p>
            </div>
            <BackupSettings />
        </div>
    );
}
