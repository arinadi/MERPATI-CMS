import { getTokens } from "@/lib/actions/tokens";
import TokenManager from "@/components/admin/settings/token-manager";
import { checkRole } from "@/lib/rbac";

export const metadata = {
    title: "API Tokens - MERPATI Admin",
};

export default async function ApiTokensPage() {
    // Only super_user can manage tokens for now
    await checkRole(["super_user"]);
    
    const tokens = await getTokens();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Personal Access Tokens</h1>
                <p className="text-muted-foreground">
                    Tokens you have generated to access the API.
                </p>
            </div>
            <TokenManager initialTokens={tokens} />
        </div>
    );
}
