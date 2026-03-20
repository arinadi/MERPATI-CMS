"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Term = {
    id: string;
    name: string;
    parentId: string | null;
};

// Recursive component for category tree
const CategoryNode = ({
    category,
    allCategories,
    selectedIds,
    onToggle
}: {
    category: Term,
    allCategories: Term[],
    selectedIds: string[],
    onToggle: (id: string, checked: boolean) => void
}) => {
    const children = allCategories.filter(c => c.parentId === category.id);

    return (
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedIds.includes(category.id)}
                    onCheckedChange={(checked) => onToggle(category.id, checked === true)}
                />
                <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {category.name}
                </Label>
            </div>
            {children.length > 0 && (
                <div className="ml-5 mt-1 border-l pl-3 border-border space-y-1">
                    {children.map(child => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            allCategories={allCategories}
                            selectedIds={selectedIds}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CategoryCheckboxTree({
    categories,
    selectedIds,
    onChange
}: {
    categories: Term[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const rootCategories = categories.filter(c => !c.parentId);

    const handleToggle = (id: string, checked: boolean) => {
        if (checked) {
            onChange([...selectedIds, id]);
        } else {
            onChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    if (categories.length === 0) {
        return <p className="text-sm text-muted-foreground italic">No categories available.</p>;
    }

    return (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 rounded-md border p-3">
            {rootCategories.map(category => (
                <CategoryNode
                    key={category.id}
                    category={category}
                    allCategories={categories}
                    selectedIds={selectedIds}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    );
}
