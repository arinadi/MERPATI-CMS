"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Heading4,
    Pilcrow,
    Quote,
    Code,
    LinkIcon,
    ImageIcon,
    Undo,
    Redo,
    Eye,
    FileCode,
    Loader2,
    Save,
    Trash2,
    Search,
    X,
    ImagePlus,
    Settings,
    ChevronLeft,
    Youtube,
    ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    createPost,
    updatePost,
    deletePost,
    searchPublishedPosts,
} from "@/lib/actions/posts";
import CategoryCheckboxTree from "./terms/category-checkbox-tree";
import TagCombobox from "./terms/tag-combobox";
import EditorMediaModal from "./editor-media-modal";
import { parseFeaturedImage, serializeFeaturedImage } from "@/lib/utils/featured-image";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RelatedPost {
    id: string;
    title: string;
}

interface PostData {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    status: "draft" | "published";
    type: "post" | "page";
    featuredImage: string | null;
    createdAt: Date;
    updatedAt: Date;
    relatedPosts: RelatedPost[];
    categories?: { id: string }[];
    tags?: { id: string }[];
}

interface Term {
    id: string;
    name: string;
    slug: string;
    taxonomy: "category" | "tag";
    parentId: string | null;
    description: string | null;
}

interface PostEditorProps {
    type: "post" | "page";
    post?: PostData | null;
    availableCategories?: Term[];
    availableTags?: Term[];
}

// ─── Toolbar Button ─────────────────────────────────────────────────────────

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-md transition-colors ${isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {children}
        </button>
    );
}

// ─── Menu Bar ───────────────────────────────────────────────────────────────

function MenuBar({
    editor,
    isHtmlMode,
    onToggleHtml,
    onOpenMediaModal,
}: {
    editor: ReturnType<typeof useEditor>;
    isHtmlMode: boolean;
    onToggleHtml: () => void;
    onOpenMediaModal: () => void;
}) {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        }
    };

    const addImage = () => {
        onOpenMediaModal();
    };

    return (
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-0">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                isActive={editor.isActive("heading", { level: 4 })}
                title="Heading 4"
            >
                <Heading4 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().setParagraph().run()
                }
                isActive={editor.isActive("paragraph")}
                title="Paragraph"
            >
                <Pilcrow className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code Block"
            >
                <Code className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton onClick={addLink} title="Insert Link">
                <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Insert Image">
                <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </ToolbarButton>

            <div className="flex-1" />

            <ToolbarButton
                onClick={onToggleHtml}
                isActive={isHtmlMode}
                title={isHtmlMode ? "Visual Mode" : "HTML Mode"}
            >
                {isHtmlMode ? (
                    <Eye className="h-4 w-4" />
                ) : (
                    <FileCode className="h-4 w-4" />
                )}
            </ToolbarButton>
        </div>
    );
}

// ─── Related Posts Search ───────────────────────────────────────────────────

function RelatedPostsSelector({
    postId,
    selected,
    onChange,
}: {
    postId?: string;
    selected: RelatedPost[];
    onChange: (posts: RelatedPost[]) => void;
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<RelatedPost[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleSearch = useCallback(
        (value: string) => {
            setQuery(value);
            if (debounceRef.current) clearTimeout(debounceRef.current);

            if (!value.trim()) {
                setResults([]);
                return;
            }

            debounceRef.current = setTimeout(async () => {
                setIsSearching(true);
                try {
                    const items = await searchPublishedPosts(value, postId);
                    setResults(
                        items.filter(
                            (item) => !selected.some((s) => s.id === item.id)
                        )
                    );
                } finally {
                    setIsSearching(false);
                }
            }, 300);
        },
        [postId, selected]
    );

    const addPost = (post: RelatedPost) => {
        onChange([...selected, post]);
        setQuery("");
        setResults([]);
    };

    const removePost = (id: string) => {
        onChange(selected.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-2">
            <Label>Related Posts</Label>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                />
                {isSearching && (
                    <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {results.length > 0 && (
                <div className="border rounded-md bg-popover shadow-md max-h-40 overflow-y-auto">
                    {results.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => addPost(item)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            )}

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map((post) => (
                        <Badge
                            key={post.id}
                            variant="secondary"
                            className="gap-1 pr-1"
                        >
                            <span className="max-w-[120px] truncate text-xs">
                                {post.title}
                            </span>
                            <button
                                type="button"
                                onClick={() => removePost(post.id)}
                                className="hover:bg-muted rounded-full p-0.5 cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Editor Component ──────────────────────────────────────────────────

export function PostEditor({ type, post, availableCategories = [], availableTags = [] }: PostEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [title, setTitle] = useState(post?.title ?? "");
    const [slug, setSlug] = useState(post?.slug ?? "");
    const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
    const [status, setStatus] = useState<"draft" | "published">(
        post?.status ?? "draft"
    );
    const parsedFI = parseFeaturedImage(post?.featuredImage);
    const [featuredImage, setFeaturedImage] = useState(parsedFI?.url ?? "");
    const [featuredImageAlt, setFeaturedImageAlt] = useState(parsedFI?.altText ?? "");
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>(
        post?.relatedPosts ?? []
    );
    const [categoryIds, setCategoryIds] = useState<string[]>(
        post?.categories?.map((c) => c.id) ?? []
    );
    const [tagIds, setTagIds] = useState<string[]>(
        post?.tags?.map((t) => t.id) ?? []
    );
    const [postId, setPostId] = useState<string | undefined>(post?.id);

    // Editor UI State
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [isFeaturedImageModalOpen, setIsFeaturedImageModalOpen] = useState(false);
    const [isMetadataSheetOpen, setIsMetadataSheetOpen] = useState(false);
    const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
    const [youtubeInputUrl, setYoutubeInputUrl] = useState("");

    // HTML mode
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [rawHtml, setRawHtml] = useState(post?.content ?? "");

    // Autosave
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(
        post?.updatedAt ? new Date(post.updatedAt) : null
    );
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const contentRef = useRef(post?.content ?? "");

    // Error / success state
    const [message, setMessage] = useState<{
        type: "error" | "success";
        text: string;
    } | null>(null);

    const handleSaveYoutube = () => {
        if (!youtubeInputUrl) return;
        if (youtubeInputUrl.includes("youtube.com") || youtubeInputUrl.includes("youtu.be")) {
            setFeaturedImage(youtubeInputUrl);
            setHasUnsavedChanges(true);
            setIsYoutubeModalOpen(false);
            setYoutubeInputUrl("");
        } else {
            alert("Please enter a valid YouTube URL.");
        }
    };

    // Sidebar Content Renderer (for reuse in desktop and mobile sheet)
    const renderSidebarContent = () => (
        <div className="space-y-4">
            {/* Publish Box */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
                <h3 className="font-semibold text-sm">Publish</h3>

                {/* Status toggle */}
                <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={status === "draft" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setStatus("draft");
                                setHasUnsavedChanges(true);
                            }}
                            className="flex-1"
                        >
                            Draft
                        </Button>
                        <Button
                            type="button"
                            variant={status === "published" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setStatus("published");
                                setHasUnsavedChanges(true);
                            }}
                            className="flex-1"
                        >
                            Published
                        </Button>
                    </div>
                </div>

                {/* Save / Publish button */}
                <Button
                    type="button"
                    onClick={() => performSave(false)}
                    disabled={isSaving || isPending}
                    className="w-full"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving…
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            {postId ? "Update" : "Save"} {label}
                        </>
                    )}
                </Button>

                {/* Visit button */}
                {postId && (
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="w-full"
                    >
                        <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                        </a>
                    </Button>
                )}

                {/* Delete button */}
                {postId && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete {label}
                    </Button>
                )}
            </div>

            {/* Slug */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                    id="slug"
                    type="text"
                    placeholder="post-url-slug"
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value);
                        setHasUnsavedChanges(true);
                    }}
                />
                {slug && (
                    <p className="text-xs text-muted-foreground truncate">
                        /{type === "page" ? "" : "post/"}
                        {slug}
                    </p>
                )}
            </div>

            {/* Featured Image */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <Label>Featured Image</Label>

                {featuredImage ? (
                    <>
                    <div className="relative group rounded-lg overflow-hidden border">
                        {featuredImage.includes("youtube.com") || featuredImage.includes("youtu.be") ? (
                            <div className="w-full h-40 bg-zinc-900 flex flex-col items-center justify-center text-white">
                                <Youtube className="h-8 w-8 text-red-500 mb-2" />
                                <span className="text-xs text-zinc-400 truncate px-4 max-w-full">
                                    {featuredImage}
                                </span>
                            </div>
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={featuredImage}
                                alt={featuredImageAlt || "Featured"}
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setIsFeaturedImageModalOpen(true)}
                            >
                                Replace
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    setFeaturedImage("");
                                    setFeaturedImageAlt("");
                                    setHasUnsavedChanges(true);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-2 space-y-1">
                        <Label htmlFor="featuredImageAlt" className="text-xs">Alt Text</Label>
                        <Input
                            id="featuredImageAlt"
                            type="text"
                            placeholder="Describe the image..."
                            value={featuredImageAlt}
                            onChange={(e) => {
                                setFeaturedImageAlt(e.target.value);
                                setHasUnsavedChanges(true);
                            }}
                            className="h-8 text-xs"
                        />
                    </div>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setIsFeaturedImageModalOpen(true)}
                            className="w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-card"
                        >
                            <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
                            <span className="text-xs font-medium">Add Image</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsYoutubeModalOpen(true)}
                            className="w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-card"
                        >
                            <Youtube className="h-6 w-6 text-muted-foreground/50" />
                            <span className="text-xs font-medium">Add YouTube</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Taxonomies (only for posts, not pages) */}
            {type === "post" && (
                <>
                    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
                        <Label>Categories</Label>
                        <CategoryCheckboxTree
                            categories={availableCategories}
                            selectedIds={categoryIds}
                            onChange={(ids) => {
                                setCategoryIds(ids);
                                setHasUnsavedChanges(true);
                            }}
                        />
                    </div>

                    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
                        <Label>Tags</Label>
                        <TagCombobox
                            availableTags={availableTags}
                            selectedIds={tagIds}
                            onChange={(ids) => {
                                setTagIds(ids);
                                setHasUnsavedChanges(true);
                            }}
                        />
                    </div>
                </>
            )}

            {/* Related Posts (only for posts, not pages) */}
            {type === "post" && (
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <RelatedPostsSelector
                        postId={postId}
                        selected={relatedPosts}
                        onChange={(posts) => {
                            setRelatedPosts(posts);
                            setHasUnsavedChanges(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    // TipTap editor
    // Force toolbar re-render on selection change
    const [, setEditorState] = useState(0);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false }),
        ],
        content: post?.content ?? "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            contentRef.current = html;
            setRawHtml(html);
            setHasUnsavedChanges(true);
            triggerAutosave();
        },
        onSelectionUpdate: () => {
            setEditorState((c) => c + 1);
        },
        editorProps: {
            attributes: {
                class: "tiptap focus:outline-none max-w-none min-h-[400px] p-4",
            },
        },
    });

    // Slug auto-generation from title (only for new posts)
    useEffect(() => {
        if (!post && title) {
            const generated = title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 200);
            setSlug(generated);
        }
    }, [title, post]);

    // Simple HTML prettifier
    const prettifyHtml = (html: string): string => {
        let formatted = "";
        let indent = 0;
        // Insert newlines between tags
        const tokens = html.replace(/>\s*</g, ">\n<").split("\n");
        for (const token of tokens) {
            const trimmed = token.trim();
            if (!trimmed) continue;
            // Closing tag or self-closing: decrease indent first
            if (trimmed.match(/^<\/\w/)) {
                indent = Math.max(0, indent - 1);
            }
            formatted += "  ".repeat(indent) + trimmed + "\n";
            // Opening tag (not self-closing, not void elements): increase indent
            if (
                trimmed.match(/^<\w[^>]*[^/]>$/) &&
                !trimmed.match(/^<(br|hr|img|input|meta|link)\b/i)
            ) {
                indent++;
            }
        }
        return formatted.trim();
    };

    // HTML mode toggle
    const toggleHtmlMode = useCallback(() => {
        if (isHtmlMode) {
            // Switch back to visual — push raw HTML into editor
            editor?.commands.setContent(rawHtml);
        } else {
            // Switch to HTML mode — prettify and display
            setRawHtml(prettifyHtml(editor?.getHTML() ?? ""));
        }
        setIsHtmlMode(!isHtmlMode);
    }, [isHtmlMode, rawHtml, editor]);

    // When raw HTML changes in textarea
    const handleRawHtmlChange = (value: string) => {
        setRawHtml(value);
        contentRef.current = value;
        setHasUnsavedChanges(true);
        triggerAutosave();
    };

    // Autosave trigger (debounced 3s)
    const triggerAutosave = useCallback(() => {
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
        }
        autosaveTimerRef.current = setTimeout(() => {
            performSave(true);
        }, 3000);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Save function
    const performSave = useCallback(
        async (isAutosave = false) => {
            if (isSaving) return;
            setIsSaving(true);
            setMessage(null);

            try {
                const content = contentRef.current;

                // Auto-fill excerpt if empty
                let currentExcerpt = excerpt;
                if (!currentExcerpt.trim() && content) {
                    const match = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
                    if (match) {
                        const text = match[1].replace(/<[^>]*>/g, "").trim();
                        currentExcerpt = text.length > 200
                            ? text.slice(0, 200).replace(/\s+\S*$/, "") + "…"
                            : text;
                        setExcerpt(currentExcerpt);
                    }
                }
                if (postId) {
                    // Update existing
                    const result = await updatePost(postId, {
                        title,
                        slug,
                        content,
                        excerpt: currentExcerpt || undefined,
                        status,
                        featuredImage: featuredImage ? serializeFeaturedImage(featuredImage, featuredImageAlt) : undefined,
                        relatedPostIds: relatedPosts.map((p) => p.id),
                        termIds: [...categoryIds, ...tagIds],
                    });

                    if (result.error) {
                        setMessage({ type: "error", text: result.error });
                    } else {
                        setLastSaved(new Date());
                        setHasUnsavedChanges(false);
                        if (!isAutosave) {
                            setMessage({
                                type: "success",
                                text: "Saved successfully!",
                            });
                        }
                    }
                } else {
                    // Create new
                    if (!title.trim()) {
                        setIsSaving(false);
                        if (!isAutosave) {
                            setMessage({
                                type: "error",
                                text: "Title is required",
                            });
                        }
                        return;
                    }

                    const result = await createPost({
                        title,
                        slug,
                        content,
                        excerpt: currentExcerpt || undefined,
                        status,
                        type,
                        featuredImage: featuredImage ? serializeFeaturedImage(featuredImage, featuredImageAlt) : undefined,
                        relatedPostIds: relatedPosts.map((p) => p.id),
                        termIds: [...categoryIds, ...tagIds],
                    });

                    if (result.error) {
                        setMessage({ type: "error", text: result.error });
                    } else if (result.id) {
                        setPostId(result.id);
                        setLastSaved(new Date());
                        setHasUnsavedChanges(false);
                        // Navigate to edit URL without full reload
                        const basePath =
                            type === "page"
                                ? "/admin/pages"
                                : "/admin/posts";
                        const targetParam = type === "page" ? result.id : result.slug;
                        window.history.replaceState(
                            null,
                            "",
                            `${basePath}/${targetParam}`
                        );
                        if (!isAutosave) {
                            setMessage({
                                type: "success",
                                text: "Created successfully!",
                            });
                        }
                    }
                }
            } catch {
                setMessage({
                    type: "error",
                    text: "An unexpected error occurred",
                });
            } finally {
                setIsSaving(false);
            }
        },
        [
            isSaving,
            postId,
            title,
            slug,
            excerpt,
            status,
            featuredImage,
            featuredImageAlt,
            relatedPosts,
            categoryIds,
            tagIds,
            type,
        ]
    );

    // Delete handler
    const handleDelete = () => {
        if (!postId) return;
        if (!confirm("Are you sure you want to delete this? This action cannot be undone.")) return;

        startTransition(async () => {
            const result = await deletePost(postId);
            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                const basePath =
                    type === "page" ? "/admin/pages" : "/admin/posts";
                router.push(basePath);
            }
        });
    };

    const label = type === "page" ? "Page" : "Post";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {post ? `Edit ${label}` : `New ${label}`}
                    </h1>
                    <p className="text-muted-foreground">
                        {post
                            ? `Editing "${post.title}"`
                            : `Create a new ${label.toLowerCase()}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Autosave indicator */}
                    {isSaving && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Saving…
                        </span>
                    )}
                    {!isSaving && lastSaved && !hasUnsavedChanges && (
                        <span className="text-sm text-muted-foreground">
                            Saved{" "}
                            {lastSaved.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                    {!isSaving && hasUnsavedChanges && (
                        <span className="text-sm text-amber-600">
                            Unsaved changes
                        </span>
                    )}
                </div>
            </div>

            {/* Sticky Mobile Header (Hidden on Desktop) */}
            <div className="sticky top-0 z-30 flex items-center justify-between py-2 bg-background/80 backdrop-blur-sm border-b lg:hidden -mx-4 px-4">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-11 w-11 shrink-0"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {/* Save button (Mobile) */}
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => performSave(false)}
                        disabled={isSaving || isPending}
                        className="h-11 px-5"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </>
                        )}
                    </Button>

                    {/* Visit button (Mobile) */}
                    {postId && (
                        <Button variant="outline" size="icon" className="h-11 w-11" asChild>
                            <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-5 w-5" />
                                <span className="sr-only">Visit</span>
                            </a>
                        </Button>
                    )}

                    {/* Settings Sheet Trigger (Mobile) */}
                    <Sheet open={isMetadataSheetOpen} onOpenChange={setIsMetadataSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="h-11 w-11">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                            <SheetHeader className="pb-4 border-b">
                                <SheetTitle>{label} Settings</SheetTitle>
                            </SheetHeader>
                            <div className="py-6">
                                {renderSidebarContent()}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`rounded-lg border px-4 py-3 text-sm ${message.type === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-green-200 bg-green-50 text-green-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Main layout: Editor + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Main editor area */}
                <div className="space-y-4">
                    {/* Title */}
                    <textarea
                        ref={(el) => {
                            if (el) {
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                            }
                        }}
                        placeholder={`${label} title`}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setHasUnsavedChanges(true);
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        rows={1}
                        className="w-full text-3xl font-bold border-0 border-b border-border rounded-none px-0 py-3 bg-transparent outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none overflow-hidden"
                    />

                    {/* Editor */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        {editor && (
                            <MenuBar
                                editor={editor}
                                isHtmlMode={isHtmlMode}
                                onToggleHtml={toggleHtmlMode}
                                onOpenMediaModal={() => setIsMediaModalOpen(true)}
                            />
                        )}
                        {isHtmlMode ? (
                            <textarea
                                value={rawHtml}
                                onChange={(e) =>
                                    handleRawHtmlChange(e.target.value)
                                }
                                className="w-full min-h-[400px] p-4 font-mono text-sm bg-muted/20 focus:outline-none resize-y"
                                spellCheck={false}
                            />
                        ) : editor ? (
                            <EditorContent editor={editor} />
                        ) : null}
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <textarea
                            id="excerpt"
                            placeholder="Write a short summary..."
                            value={excerpt}
                            onChange={(e) => {
                                setExcerpt(e.target.value);
                                setHasUnsavedChanges(true);
                            }}
                            rows={3}
                            className="w-full rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                        />
                    </div>
                </div>

                {/* Sidebar (Desktop Only) */}
                <div className="hidden lg:block space-y-4">
                    {renderSidebarContent()}
                </div>
            </div>

            <EditorMediaModal
                open={isMediaModalOpen}
                onOpenChange={setIsMediaModalOpen}
                onInsert={(url, alt) => {
                    editor?.chain().focus().setImage({ src: url, alt: alt || "" }).run();
                }}
                description={
                    <>
                        <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                            Compress images at TinyPNG
                        </a> before uploading for better performance.
                    </>
                }
            />

            <EditorMediaModal
                open={isFeaturedImageModalOpen}
                onOpenChange={setIsFeaturedImageModalOpen}
                onInsert={(url) => {
                    setFeaturedImage(url);
                    setHasUnsavedChanges(true);
                }}
                insertLabel="Set Featured Image"
                description={
                    <>
                        Recommended: 1200×630px.{" "}
                        <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                            Compress images at TinyPNG
                        </a>
                    </>
                }
            />

            <Dialog open={isYoutubeModalOpen} onOpenChange={setIsYoutubeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add YouTube Video</DialogTitle>
                        <DialogDescription>
                            Enter the full YouTube URL to use a video as the featured image.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="ytUrl" className="sr-only">URL</Label>
                        <Input
                            id="ytUrl"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={youtubeInputUrl}
                            onChange={(e) => setYoutubeInputUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveYoutube();
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsYoutubeModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveYoutube}>Add Video</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
