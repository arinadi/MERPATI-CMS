"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setOption } from "@/lib/actions/options";
import { toast } from "sonner";
import {
    Loader2,
    GripVertical,
    Trash2,
    Plus,
    Mail,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Globe,
    Github,
    Linkedin,
    Phone
} from "lucide-react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CONTACT_ICONS = [
    { id: "mail", label: "Email", icon: Mail },
    { id: "globe", label: "Website", icon: Globe },
    { id: "twitter", label: "Twitter / X", icon: Twitter },
    { id: "facebook", label: "Facebook", icon: Facebook },
    { id: "instagram", label: "Instagram", icon: Instagram },
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "github", label: "GitHub", icon: Github },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
    { id: "phone", label: "Phone", icon: Phone },
];

interface ContactItem {
    id: string;
    title: string;
    iconId: string;
    url: string;
}

interface ContactSettingsProps {
    initialContacts: string;
}

export default function ContactSettings({ initialContacts }: ContactSettingsProps) {
    const [contacts, setContacts] = useState<ContactItem[]>(() => {
        try {
            return JSON.parse(initialContacts);
        } catch {
            return [];
        }
    });
    const [isPending, startTransition] = useTransition();

    async function handleSave() {
        startTransition(async () => {
            const result = await setOption("site_contacts", JSON.stringify(contacts));
            if (result.success) {
                toast.success("Contact links updated.");
            } else {
                toast.error(result.error || "Failed to update contacts.");
            }
        });
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(contacts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setContacts(items);
    };

    const addContact = () => {
        const newContact: ContactItem = {
            id: crypto.randomUUID(),
            title: "",
            iconId: "globe",
            url: ""
        };
        setContacts([...contacts, newContact]);
    };

    const removeContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const updateContact = (id: string, field: keyof ContactItem, value: string) => {
        setContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    return (
        <Card className="shadow-none border">
            <CardHeader>
                <CardTitle>Contact Links</CardTitle>
                <CardDescription>
                    Manage the social media and contact links displayed on your site's header and footer.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="contacts">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-3"
                            >
                                {contacts.length === 0 && (
                                    <div className="text-center py-8 border border-dashed rounded-lg bg-muted/50 text-muted-foreground">
                                        No contact links added yet.
                                    </div>
                                )}

                                {contacts.map((contact, index) => (
                                    <Draggable key={contact.id} draggableId={contact.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="flex items-start gap-3 p-4 bg-card border rounded-xl shadow-sm group"
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="mt-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
                                                >
                                                    <GripVertical className="h-5 w-5" />
                                                </div>

                                                <div className="flex-1 grid gap-4 sm:grid-cols-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Icon</Label>
                                                        <Select
                                                            value={contact.iconId}
                                                            onValueChange={(val) => updateContact(contact.id, "iconId", val)}
                                                        >
                                                            <SelectTrigger className="bg-muted/30">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {CONTACT_ICONS.map((icon) => (
                                                                    <SelectItem key={icon.id} value={icon.id}>
                                                                        <div className="flex items-center gap-2">
                                                                            <icon.icon className="h-4 w-4" />
                                                                            <span>{icon.label}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Title</Label>
                                                        <Input
                                                            value={contact.title}
                                                            onChange={(e) => updateContact(contact.id, "title", e.target.value)}
                                                            placeholder="e.g. Follow us on X"
                                                            className="bg-muted/30"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">URL</Label>
                                                        <Input
                                                            value={contact.url}
                                                            onChange={(e) => updateContact(contact.id, "url", e.target.value)}
                                                            placeholder="https://..."
                                                            className="bg-muted/30"
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="mt-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                                    onClick={() => removeContact(contact.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={addContact}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Contact Link
                </Button>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Contacts
                </Button>
            </CardFooter>
        </Card>
    );
}
