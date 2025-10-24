// src/components/templates/builder/BorderControls.tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface BorderControlsProps {
  borders: {
    enabled: boolean;
    width: number;
    style: "solid" | "dashed" | "dotted";
    color: string;
  };
  advanced: {
    showWatermark: boolean;
    watermarkText: string;
    showPageNumbers: boolean;
    showBorders: boolean;
    borderStyle: "solid" | "dashed" | "none";
    roundedCorners: boolean;
  };
  onChange: (borders: any) => void;
}

export function BorderControls({ borders, onChange }: BorderControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Enable Borders</Label>
        <Switch
          checked={borders.enabled}
          onCheckedChange={(enabled) => onChange({ ...borders, enabled })}
        />
      </div>

      {borders.enabled && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Border Width</Label>
              <span className="text-sm text-muted-foreground">
                {borders.width}px
              </span>
            </div>
            <Slider
              value={[borders.width]}
              onValueChange={([width]) => onChange({ ...borders, width })}
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Border Style</Label>
            <Select
              value={borders.style}
              onValueChange={(style: "solid" | "dashed" | "dotted") =>
                onChange({ ...borders, style })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Border Color</Label>
            <Input
              type="text"
              value={borders.color}
              onChange={(e) => onChange({ ...borders, color: e.target.value })}
              placeholder="#e0e0e0"
            />
          </div>
        </>
      )}
    </div>
  );
}
