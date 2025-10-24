// src/components/templates/builder/LayoutControls.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LayoutControlsProps {
  layout: "classic" | "modern" | "minimal" | "creative";
  paperSize: "A4" | "Letter" | "Legal";
  orientation: "portrait" | "landscape";
  onLayoutChange: (layout: string) => void;
  onPaperSizeChange: (size: string) => void;
  onOrientationChange: (orientation: string) => void;
}

export function LayoutControls({
  layout,
  paperSize,
  orientation,
  onLayoutChange,
  onPaperSizeChange,
  onOrientationChange,
}: LayoutControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Layout</Label>
        <RadioGroup
          value={layout}
          onValueChange={(
            layout: "classic" | "modern" | "minimal" | "creative"
          ) => onLayoutChange(layout)}
        >
          {["classic", "modern", "minimal", "creative"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={type} />
              <Label
                htmlFor={type}
                className="font-normal cursor-pointer capitalize"
              >
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Paper Size</Label>
        <RadioGroup
          value={paperSize}
          onValueChange={(size: "A4" | "Letter" | "Legal") =>
            onPaperSizeChange(size)
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Legal" id="legal" />
            <Label htmlFor="legal" className="font-normal cursor-pointer">
              Legal (8.5 × 14 in)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Orientation</Label>
        <RadioGroup
          value={orientation}
          onValueChange={(orientation: "portrait" | "landscape") =>
            onOrientationChange(orientation)
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
    </div>
  );
}
