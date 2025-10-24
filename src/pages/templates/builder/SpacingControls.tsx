// src/pages/templates/builder/SpacingControls.tsx
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpacingControlsProps {
  spacing: {
    sectionGap: number;
    elementGap: number;
    padding: number;
  };
  onChange: (spacing: SpacingControlsProps["spacing"]) => void;
}

export function SpacingControls({ spacing, onChange }: SpacingControlsProps) {
  return (
    <div className="space-y-6">
      {/* Section Gap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Section Gap</Label>
          <span className="text-sm text-muted-foreground">
            {spacing.sectionGap}px
          </span>
        </div>
        <Slider
          value={[spacing.sectionGap]}
          onValueChange={([sectionGap]) => onChange({ ...spacing, sectionGap })}
          min={8}
          max={64}
          step={4}
        />
        <p className="text-xs text-muted-foreground">
          Space between major sections (header, items, summary)
        </p>
      </div>

      {/* Element Gap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Element Gap</Label>
          <span className="text-sm text-muted-foreground">
            {spacing.elementGap}px
          </span>
        </div>
        <Slider
          value={[spacing.elementGap]}
          onValueChange={([elementGap]) => onChange({ ...spacing, elementGap })}
          min={4}
          max={32}
          step={2}
        />
        <p className="text-xs text-muted-foreground">
          Space between elements within sections (line items, fields)
        </p>
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Page Padding</Label>
          <span className="text-sm text-muted-foreground">
            {spacing.padding}px
          </span>
        </div>
        <Slider
          value={[spacing.padding]}
          onValueChange={([padding]) => onChange({ ...spacing, padding })}
          min={16}
          max={80}
          step={4}
        />
        <p className="text-xs text-muted-foreground">
          Inner padding around the entire invoice content
        </p>
      </div>
    </div>
  );
}
