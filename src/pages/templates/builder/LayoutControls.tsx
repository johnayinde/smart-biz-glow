// src/components/templates/builder/LayoutControls.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface LayoutControlsProps {
  layout: {
    pageSize: "A4" | "Letter";
    orientation: "portrait" | "landscape";
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  onChange: (layout: any) => void;
}

export function LayoutControls({ layout, onChange }: LayoutControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Page Size</Label>
        <RadioGroup
          value={layout.pageSize}
          onValueChange={(pageSize: "A4" | "Letter") =>
            onChange({ ...layout, pageSize })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="A4" id="a4" />
            <Label htmlFor="a4" className="font-normal cursor-pointer">
              A4 (210 × 297 mm)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Letter" id="letter" />
            <Label htmlFor="letter" className="font-normal cursor-pointer">
              Letter (8.5 × 11 in)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Orientation</Label>
        <RadioGroup
          value={layout.orientation}
          onValueChange={(orientation: "portrait" | "landscape") =>
            onChange({ ...layout, orientation })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portrait" id="portrait" />
            <Label htmlFor="portrait" className="font-normal cursor-pointer">
              Portrait
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landscape" id="landscape" />
            <Label htmlFor="landscape" className="font-normal cursor-pointer">
              Landscape
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <Label>Margins</Label>
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <div key={side} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize text-sm">{side}</Label>
              <span className="text-sm text-muted-foreground">
                {layout.margins[side]}px
              </span>
            </div>
            <Slider
              value={[layout.margins[side]]}
              onValueChange={([value]) =>
                onChange({
                  ...layout,
                  margins: { ...layout.margins, [side]: value },
                })
              }
              min={10}
              max={80}
              step={5}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
