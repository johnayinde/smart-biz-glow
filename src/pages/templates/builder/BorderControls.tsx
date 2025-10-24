// src/pages/templates/builder/BorderControls.tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BorderControlsProps {
  advanced: {
    showWatermark: boolean;
    watermarkText: string;
    showPageNumbers: boolean;
    showBorders: boolean;
    borderStyle: "solid" | "dashed" | "none";
    roundedCorners: boolean;
  };
  onChange: (advanced: BorderControlsProps["advanced"]) => void;
}

export function BorderControls({ advanced, onChange }: BorderControlsProps) {
  return (
    <div className="space-y-4">
      {/* Enable Borders Toggle */}
      <div className="flex items-center justify-between">
        <Label>Enable Borders</Label>
        <Switch
          checked={advanced.showBorders}
          onCheckedChange={(showBorders) =>
            onChange({ ...advanced, showBorders })
          }
        />
      </div>

      {/* Border Style Selection - Only shown when borders are enabled */}
      {advanced.showBorders && (
        <div className="space-y-2">
          <Label>Border Style</Label>
          <Select
            value={advanced.borderStyle}
            onValueChange={(borderStyle: "solid" | "dashed" | "none") =>
              onChange({ ...advanced, borderStyle })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select border style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Rounded Corners Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Rounded Corners</Label>
          <p className="text-xs text-muted-foreground">
            Add rounded corners to sections
          </p>
        </div>
        <Switch
          checked={advanced.roundedCorners}
          onCheckedChange={(roundedCorners) =>
            onChange({ ...advanced, roundedCorners })
          }
        />
      </div>

      {/* Page Numbers Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Show Page Numbers</Label>
          <p className="text-xs text-muted-foreground">
            Display page numbers on invoices
          </p>
        </div>
        <Switch
          checked={advanced.showPageNumbers}
          onCheckedChange={(showPageNumbers) =>
            onChange({ ...advanced, showPageNumbers })
          }
        />
      </div>

      {/* Watermark Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Show Watermark</Label>
          <p className="text-xs text-muted-foreground">
            Display watermark on drafts
          </p>
        </div>
        <Switch
          checked={advanced.showWatermark}
          onCheckedChange={(showWatermark) =>
            onChange({ ...advanced, showWatermark })
          }
        />
      </div>
    </div>
  );
}
