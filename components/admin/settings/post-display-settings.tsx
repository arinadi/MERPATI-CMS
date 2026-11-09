"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setOptions } from "@/lib/actions/options";
import {
  POST_DISPLAY_PARTS,
  THEME_PART_SUPPORT,
  postDisplayKey,
  type PostDisplayPart,
  type PostDisplaySettings,
  type ThemeName,
} from "@/lib/post-display";

const PART_LABELS: Record<PostDisplayPart, string> = {
  credits: "Credits (reporter and editor)",
  writer: "Writer (author)",
  date_reading: "Date and reading time",
  share: "Share buttons",
  terms: "Categories and tags",
};

export default function PostDisplaySettings({ values, theme }: { values: PostDisplaySettings; theme: ThemeName }) {
  const [settings, setSettings] = useState(values);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Every switch is saved, on or off, so a later default change cannot silently flip a saved value.
    const payload = Object.fromEntries(POST_DISPLAY_PARTS.map((part) => [postDisplayKey(part), String(settings[part])]));
    const result = await setOptions(payload);
    setIsSaving(false);
    if (result.success) toast.success("Post display saved");
    else toast.error(result.error ?? "Could not save post display");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public post</CardTitle>
        <CardDescription>
          Choose which parts of a public post are shown. The post editor always shows every part.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {POST_DISPLAY_PARTS.map((part) => {
          const id = `post-display-${part}`;
          return (
            <div key={part} data-part={part} className="flex items-start gap-3">
              <Checkbox
                id={id}
                checked={settings[part]}
                onCheckedChange={(checked) => setSettings((current) => ({ ...current, [part]: checked === true }))}
              />
              <div className="space-y-1">
                <Label htmlFor={id}>{PART_LABELS[part]}</Label>
                {THEME_PART_SUPPORT[theme][part] === "partial" && (
                  <p className="text-xs text-muted-foreground">Partly shown in this theme. The switch still saves.</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
