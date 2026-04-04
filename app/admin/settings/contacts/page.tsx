import { getOptions } from "@/lib/actions/options";
import ContactSettings from "@/components/admin/settings/contact-settings";

export const metadata = {
    title: "Contact Settings - MERPATI Admin",
};

export default async function ContactSettingsPage() {
    const settings = await getOptions(["site_contacts"]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
                <p className="text-muted-foreground">
                    Manage your site&apos;s social and contact links.
                </p>
            </div>
            <ContactSettings initialContacts={settings.site_contacts || "[]"} />
        </div>
    );
}
