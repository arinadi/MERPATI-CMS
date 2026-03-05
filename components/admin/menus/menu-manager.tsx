"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, Loader2, GripVertical } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createMenu, deleteMenu, saveMenuItems, updateMenu } from "@/lib/actions/menus";
import { toast } from "sonner";

export interface Menu {
    id: string;
    name: string;
    slug: string;
    location: string | null;
}

export interface MenuItem {
    id: string;
    menuId: string;
    title: string;
    url: string | null;
    objectId: string | null;
    type: "custom" | "post" | "page" | "category";
    parentId: string | null;
    sortOrder: number;
}

interface ContentItem {
    id: string;
    title?: string;
    name?: string;
    slug?: string;
    url?: string;
}

interface MenuManagerProps {
    allMenus: Menu[];
    activeMenu: Menu | null;
    activeItems: MenuItem[];
    availableContent: {
        posts: ContentItem[];
        pages: ContentItem[];
        categories: ContentItem[];
    };
}

export default function MenuManager({
    allMenus,
    activeMenu,
    activeItems,
    availableContent,
}: MenuManagerProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newMenuName, setNewMenuName] = useState("");
    const [items, setItems] = useState<MenuItem[]>(activeItems);
    const [menuLocation, setMenuLocation] = useState<string | null>(activeMenu?.location || null);

    const [prevActiveMenuId, setPrevActiveMenuId] = useState(activeMenu?.id);

    if (activeMenu?.id !== prevActiveMenuId) {
        setPrevActiveMenuId(activeMenu?.id);
        setItems(activeItems);
        setMenuLocation(activeMenu?.location || null);
    }

    const handleMenuChange = (id: string) => {
        router.push(`/admin/menus?menuId=${id}`);
    };

    const handleCreateMenu = async () => {
        if (!newMenuName) return;
        setIsSaving(true);
        const slug = newMenuName.toLowerCase().replace(/\s+/g, "-");
        const result = await createMenu(newMenuName, slug);
        if (result.success) {
            toast.success("Menu created.");
            setNewMenuName("");
            setIsCreating(false);
            router.push(`/admin/menus?menuId=${result.data?.id}`);
        } else {
            toast.error(result.error || "Failed to create menu.");
        }
        setIsSaving(false);
    };

    const handleDeleteMenu = async () => {
        if (!activeMenu || !confirm("Delete this menu?")) return;
        setIsSaving(true);
        const result = await deleteMenu(activeMenu.id);
        if (result.success) {
            toast.success("Menu deleted.");
            router.push("/admin/menus");
        } else {
            toast.error(result.error || "Failed to delete menu.");
        }
        setIsSaving(false);
    };

    const handleSaveStructure = async () => {
        if (!activeMenu) return;
        setIsSaving(true);

        // 1. Update menu location if changed
        if (menuLocation !== activeMenu.location) {
            await updateMenu(activeMenu.id, activeMenu.name, activeMenu.slug, menuLocation);
        }

        // 2. Save items
        const result = await saveMenuItems(activeMenu.id, items);
        if (result.success) {
            toast.success("Menu structure saved.");
        } else {
            toast.error(result.error || "Failed to save menu.");
        }
        setIsSaving(false);
    };

    const onDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
        if (!result.destination) return;
        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    };

    const addItems = (type: "custom" | "post" | "page" | "category", contentItems: ContentItem[]) => {
        const newMenuItems: MenuItem[] = contentItems.map((item) => ({
            id: `temp-${Date.now()}-${item.id}`,
            menuId: activeMenu?.id || "",
            title: item.title || item.name || "",
            url: type === "custom" ? (item.url || "") : null,
            objectId: item.id,
            type: type,
            parentId: null,
            sortOrder: items.length,
        }));
        setItems([...items, ...newMenuItems]);
    };

    const removeMenuItem = (id: string) => {
        setItems(items.filter((i) => i.id !== id));
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar: Selection & Add Content */}
            <div className="md:col-span-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Select Menu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Select
                                value={activeMenu?.id || undefined}
                                onValueChange={handleMenuChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a menu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allMenus.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {isCreating && (
                            <div className="space-y-2 pt-4 border-t">
                                <Label>New Menu Name</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newMenuName}
                                        onChange={(e) => setNewMenuName(e.target.value)}
                                        placeholder="e.g. Header Menu"
                                    />
                                    <Button size="sm" onClick={handleCreateMenu} disabled={isSaving}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {activeMenu && (
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="pages">
                            <AccordionTrigger className="text-sm font-medium">Pages</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="space-y-2">
                                    {availableContent.pages.map((p) => (
                                        <div key={p.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`page-${p.id}`}
                                                onCheckedChange={(checked) => {
                                                    if (checked) addItems("page", [p]);
                                                }}
                                            />
                                            <label htmlFor={`page-${p.id}`} className="text-sm">
                                                {p.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="posts">
                            <AccordionTrigger className="text-sm font-medium">Posts</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="space-y-2">
                                    {availableContent.posts.map((p) => (
                                        <div key={p.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`post-${p.id}`}
                                                onCheckedChange={(checked) => {
                                                    if (checked) addItems("post", [p]);
                                                }}
                                            />
                                            <label htmlFor={`post-${p.id}`} className="text-sm">
                                                {p.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="categories">
                            <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="space-y-2">
                                    {availableContent.categories.map((c) => (
                                        <div key={c.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`cat-${c.id}`}
                                                onCheckedChange={(checked) => {
                                                    if (checked) addItems("category", [c]);
                                                }}
                                            />
                                            <label htmlFor={`cat-${c.id}`} className="text-sm">
                                                {c.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="custom">
                            <AccordionTrigger className="text-sm font-medium">Custom Link</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-muted-foreground">Link Text</Label>
                                    <Input id="custom-text" placeholder="Home" />
                                    <Label className="text-[10px] uppercase text-muted-foreground">URL</Label>
                                    <Input id="custom-url" placeholder="https://..." defaultValue="https://" />
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            const title = (document.getElementById("custom-text") as HTMLInputElement).value;
                                            const url = (document.getElementById("custom-url") as HTMLInputElement).value;
                                            if (title) {
                                                addItems("custom", [{ id: Date.now().toString(), title, url }]);
                                            }
                                        }}
                                    >
                                        Add to Menu
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>

            {/* Main Content: Structure */}
            <div className="md:col-span-8">
                {activeMenu ? (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
                            <div className="flex-1 overflow-hidden">
                                <CardTitle className="truncate">Menu Structure: {activeMenu.name}</CardTitle>
                                <CardDescription className="truncate text-xs">
                                    Drag to reorder. Click to edit.
                                </CardDescription>
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={handleDeleteMenu}
                                disabled={isSaving}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="menu-items">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2"
                                        >
                                            {items.length === 0 ? (
                                                <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                                                    No items in this menu. Add some content from the sidebar.
                                                </div>
                                            ) : (
                                                items.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm"
                                                            >
                                                                <div {...provided.dragHandleProps}>
                                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="flex-1 flex items-center justify-between">
                                                                    <div>
                                                                        <span className="font-medium">{item.title}</span>
                                                                        <span className="ml-2 text-[10px] text-muted-foreground uppercase px-1.5 py-0.5 bg-muted rounded">
                                                                            {item.type}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeMenuItem(item.id)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-6">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <Label className="text-sm font-medium whitespace-nowrap shrink-0">Home Location:</Label>
                                <Select value={menuLocation || "none"} onValueChange={(val) => {
                                    setMenuLocation(val === "none" ? null : val);
                                }}>
                                    <SelectTrigger className="flex-1 sm:w-[180px]">
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="primary">Primary Header</SelectItem>
                                        <SelectItem value="footer">Footer Links</SelectItem>
                                        <SelectItem value="none">None (Standalone)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full sm:w-auto" onClick={handleSaveStructure} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Menu
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">Select a menu to start editing</p>
                    </div>
                )}
            </div>
        </div>
    );
}
