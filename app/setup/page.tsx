import { checkInitialized } from "@/lib/actions/setup";
import { redirect } from "next/navigation";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
    const initialized = await checkInitialized();
    if (initialized) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md mx-auto p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        MERPATI CMS
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Media Editorial Ringkas, Praktis, Aman, Tetap Independen
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-1">
                        Instalasi
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Selamat datang! Silakan isi informasi dasar situs Anda untuk memulai.
                    </p>

                    <SetupForm />
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Kebebasan pers dimulai dari kemandirian infrastrukturnya.
                </p>
            </div>
        </div>
    );
}
