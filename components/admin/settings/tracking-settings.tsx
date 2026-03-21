"use client";

import { useState } from "react";
import { setOption } from "@/lib/actions/options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { BarChart } from "lucide-react";

interface TrackingSettingsProps {
    gaId: string;
}

export default function TrackingSettings({ gaId }: TrackingSettingsProps) {
    const [measurementId, setMeasurementId] = useState(gaId);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await setOption("ga_measurement_id", measurementId);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Tracking settings saved successfully");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-500" />
                    Analytics & Tracking
                </CardTitle>
                <CardDescription>
                    Configure third-party tracking like Google Analytics.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 max-w-md">
                    <Label htmlFor="gaId">Google Analytics Measurement ID</Label>
                    <Input
                        id="gaId"
                        value={measurementId}
                        onChange={(e) => setMeasurementId(e.target.value)}
                        placeholder="e.g., G-XXXXXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground">
                        Leave empty to disable Google Analytics entirely.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Tracking Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
}
