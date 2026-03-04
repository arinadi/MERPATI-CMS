export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Admin shell: sidebar + header will be built in Module 2 */}
            <main>{children}</main>
        </div>
    );
}
