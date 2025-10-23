// src/components/templates/builder/SpacingControls.tsx
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpacingControlsProps {
  spacing: {
    lineHeight: number;
    sectionGap: number;
    itemGap: number;
  };
  onChange: (spacing: any) => void;
}

export function SpacingControls({ spacing, onChange }: SpacingControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Line Height</Label>
          <span className="text-sm text-muted-foreground">
            {spacing.lineHeight}
          </span>
        </div>
        <Slider
          value={[spacing.lineHeight]}
          onValueChange={([lineHeight]) => onChange({ ...spacing, lineHeight })}
          min={1}
          max={2.5}
          step={0.1}
        />
        <p className="text-xs text-muted-foreground">
          Space between lines of text
        </p>
      </div>

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
          max={48}
          step={4}
        />
        <p className="text-xs text-muted-foreground">
          Space between major sections
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Item Gap</Label>
          <span className="text-sm text-muted-foreground">
            {spacing.itemGap}px
          </span>
        </div>
        <Slider
          value={[spacing.itemGap]}
          onValueChange={([itemGap]) => onChange({ ...spacing, itemGap })}
          min={4}
          max={24}
          step={2}
        />
        <p className="text-xs text-muted-foreground">
          Space between line items
        </p>
      </div>
    </div>
  );
}
