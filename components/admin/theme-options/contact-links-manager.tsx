"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
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

interface ContactLinksManagerProps {
    value: string; // JSON string
    onChange: (value: string) => void;
}

export function ContactLinksManager({ value, onChange }: ContactLinksManagerProps) {
    let contacts: ContactItem[] = [];
    try {
        contacts = JSON.parse(value || "[]");
    } catch {
        contacts = [];
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(contacts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        onChange(JSON.stringify(items));
    };

    const addContact = () => {
        const newContact: ContactItem = {
            id: crypto.randomUUID(),
            title: "",
            iconId: "globe",
            url: ""
        };
        onChange(JSON.stringify([...contacts, newContact]));
    };

    const removeContact = (id: string) => {
        onChange(JSON.stringify(contacts.filter(c => c.id !== id)));
    };

    const updateContact = (id: string, field: keyof ContactItem, val: string) => {
        onChange(JSON.stringify(contacts.map(c => c.id === id ? { ...c, [field]: val } : c)));
    };

    return (
        <div className="space-y-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="contacts">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                        >
                            {contacts.length === 0 && (
                                <div className="text-center py-6 border border-dashed rounded-lg bg-muted/20 text-muted-foreground text-sm">
                                    No contact links added yet.
                                </div>
                            )}

                            {contacts.map((contact, index) => (
                                <Draggable key={contact.id} draggableId={contact.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex items-start gap-2 p-3 bg-card border rounded-lg shadow-sm"
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="mt-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <GripVertical className="h-4 w-4" />
                                            </div>

                                            <div className="flex-1 grid gap-3 sm:grid-cols-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon</Label>
                                                    <Select
                                                        value={contact.iconId}
                                                        onValueChange={(val) => updateContact(contact.id, "iconId", val)}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs bg-muted/30">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CONTACT_ICONS.map((icon) => (
                                                                <SelectItem key={icon.id} value={icon.id} className="text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <icon.icon className="h-3 w-3" />
                                                                        <span>{icon.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                                    <Input
                                                        value={contact.title}
                                                        onChange={(e) => updateContact(contact.id, "title", e.target.value)}
                                                        placeholder="e.g. Instagram"
                                                        className="h-8 text-xs bg-muted/30"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL</Label>
                                                    <Input
                                                        value={contact.url}
                                                        onChange={(e) => updateContact(contact.id, "url", e.target.value)}
                                                        placeholder="https://..."
                                                        className="h-8 text-xs bg-muted/30"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 mt-4 text-muted-foreground hover:text-destructive shrink-0"
                                                onClick={() => removeContact(contact.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
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
                size="sm"
                className="w-full border-dashed"
                onClick={addContact}
            >
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add New Contact Link
            </Button>
        </div>
    );
}
