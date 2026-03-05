"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { createTerm } from "@/lib/actions/terms";

type Term = {
    id: string;
    name: string;
};

export default function TagCombobox({
    availableTags,
    selectedIds,
    onChange,
}: {
    availableTags: Term[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [tags, setTags] = useState<Term[]>(availableTags);
    const [inputValue, setInputValue] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const selectedTags = tags.filter((t) => selectedIds.includes(t.id));

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const handleRemove = (idToRemove: string) => {
        onChange(selectedIds.filter((id) => id !== idToRemove));
    };

    const handleCreateTag = async () => {
        const value = inputValue.trim();
        if (!value) return;

        // Check if already exists in available
        const existing = tags.find(t => t.name.toLowerCase() === value.toLowerCase());
        if (existing) {
            if (!selectedIds.includes(existing.id)) {
                handleSelect(existing.id);
            }
            setInputValue("");
            return;
        }

        setIsCreating(true);
        const result = await createTerm({
            name: value,
            taxonomy: "tag",
        });

        if (result.term) {
            setTags([...tags, result.term]);
            onChange([...selectedIds, result.term.id]);
            setInputValue("");
        } else if (result.error) {
            alert(result.error);
        }
        setIsCreating(false);
    };

    return (
        <div className="space-y-2">
            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                    <Button
                        key={tag.id}
                        type="button"
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1 h-auto"
                        onClick={() => handleRemove(tag.id)} // Clicking the button itself removes the tag
                    >
                        {tag.name}
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag.name} tag</span>
                    </Button>
                ))}
                {selectedTags.length === 0 && (
                    <span className="text-sm text-muted-foreground italic">No tags selected.</span>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal text-muted-foreground shadow-sm"
                    >
                        Select tags...
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search or create tag..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreateTag();
                                }
                            }}
                        />
                        <CommandList>
                            <CommandEmpty className="py-4 text-center text-sm">
                                {isCreating ? (
                                    <span className="text-muted-foreground">Creating tag...</span>
                                ) : inputValue ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-muted-foreground">No tags found.</span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleCreateTag}
                                            disabled={isCreating}
                                        >
                                            Create &quot;{inputValue}&quot;
                                        </Button>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">Type to search or create</span>
                                )}
                            </CommandEmpty>

                            {tags.length > 0 && (
                                <CommandGroup heading="Existing Tags">
                                    {/* Local filtering for display */}
                                    {tags
                                        .filter(t => t.name.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map((tag) => {
                                            const isSelected = selectedIds.includes(tag.id);
                                            return (
                                                <CommandItem
                                                    key={tag.id}
                                                    value={tag.name}
                                                    onSelect={() => handleSelect(tag.id)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            isSelected
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                    {tag.name}
                                                </CommandItem>
                                            );
                                        })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div >
    );
}
