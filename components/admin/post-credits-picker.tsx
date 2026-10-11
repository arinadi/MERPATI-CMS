"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createCreditPerson } from "@/lib/actions/people";
import type { CreditPerson } from "@/lib/post-credits";

type Credits = { reporterIds: string[]; editorIds: string[] };

// Same rule as the server (normalizePersonName), so a duplicate is caught before a request is sent.
const normalize = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

interface CreditComboboxProps {
    label: "Reporter" | "Editor";
    people: CreditPerson[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    onCreated: (person: CreditPerson) => void;
}

// Tags-style picker: badges for the chosen people, a searchable list, and Enter adds a new plain-text name.
function CreditCombobox({ label, people, selectedIds, onChange, onCreated }: CreditComboboxProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selected = selectedIds.flatMap((id) => people.find((p) => p.id === id) ?? []);

    const toggle = (id: string) =>
        onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]);

    const handleAdd = async () => {
        const wanted = normalize(inputValue);
        if (!wanted) return;
        setError(null);

        const existing = people.find((p) => normalize(p.name) === wanted);
        if (existing) {
            if (!selectedIds.includes(existing.id)) onChange([...selectedIds, existing.id]);
            setInputValue("");
            return;
        }

        setIsAdding(true);
        const result = await createCreditPerson(inputValue);
        setIsAdding(false);
        if (result.person) {
            onCreated(result.person);
            onChange([...selectedIds, result.person.id]);
            setInputValue("");
        } else {
            setError(result.error ?? "Could not add this name.");
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-2">
                {selected.map((person) => (
                    <Button
                        key={person.id}
                        type="button"
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1 h-auto"
                        aria-label={`Remove ${person.name}`}
                        onClick={() => toggle(person.id)}
                    >
                        {person.name}
                        <X className="h-3 w-3" />
                    </Button>
                ))}
                {selected.length === 0 && (
                    <span className="text-sm text-muted-foreground italic">Nobody chosen.</span>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-label={`Add ${label.toLowerCase()}`}
                        aria-expanded={open}
                        className="w-full justify-between font-normal text-muted-foreground shadow-sm"
                    >
                        Choose {label.toLowerCase()}...
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={`Search or add ${label.toLowerCase()}...`}
                            value={inputValue}
                            onValueChange={(value) => {
                                setInputValue(value);
                                setError(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    void handleAdd();
                                }
                            }}
                        />
                        <CommandList>
                            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                                {isAdding ? "Adding..." : inputValue ? "Press Enter to add this name." : "Type to search or add."}
                            </CommandEmpty>
                            <CommandGroup>
                                {people
                                    .filter((p) => p.name.toLowerCase().includes(inputValue.trim().toLowerCase()))
                                    .map((person) => {
                                        const isSelected = selectedIds.includes(person.id);
                                        return (
                                            <CommandItem key={person.id} value={person.id} onSelect={() => toggle(person.id)}>
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                {person.name}
                                                {person.userId && (
                                                    <span className="ml-auto pl-2 text-xs text-muted-foreground">account</span>
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    {error && (
                        <p role="alert" className="border-t px-3 py-2 text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface PostCreditsPickerProps extends Credits {
    people: CreditPerson[];
    onChange: (credits: Credits) => void;
}

export function PostCreditsPicker({ people, reporterIds, editorIds, onChange }: PostCreditsPickerProps) {
    // One list for both roles: a name added under Reporter is offered under Editor right away.
    const [known, setKnown] = useState(people);
    const addKnown = (person: CreditPerson) =>
        setKnown((current) => (current.some((p) => p.id === person.id) ? current : [...current, person]));

    return (
        <div className="space-y-4">
            <CreditCombobox
                label="Reporter"
                people={known}
                selectedIds={reporterIds}
                onChange={(ids) => onChange({ reporterIds: ids, editorIds })}
                onCreated={addKnown}
            />
            <CreditCombobox
                label="Editor"
                people={known}
                selectedIds={editorIds}
                onChange={(ids) => onChange({ reporterIds, editorIds: ids })}
                onCreated={addKnown}
            />
        </div>
    );
}
