// src/components/templates/builder/FontSelector.tsx
import { Typography } from "@/services/templateService";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FontSelectorProps {
  typography: Typography;
  onChange: (typography: Typography) => void;
}

const fonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Playfair Display",
  "Merriweather",
  "PT Serif",
  "Source Sans Pro",
  "Nunito",
];

export function FontSelector({ typography, onChange }: FontSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Heading Font</Label>
        <Select
          value={typography.heading}
          onValueChange={(heading) => onChange({ ...typography, heading })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Body Font</Label>
        <Select
          value={typography.body}
          onValueChange={(body) => onChange({ ...typography, body })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Heading Size</Label>
            <span className="text-sm text-muted-foreground">
              {typography.size.heading}px
            </span>
          </div>
          <Slider
            value={[typography.size.heading]}
            onValueChange={([heading]) =>
              onChange({
                ...typography,
                size: { ...typography.size, heading },
              })
            }
            min={18}
            max={36}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Subheading Size</Label>
            <span className="text-sm text-muted-foreground">
              {typography.size.subheading}px
            </span>
          </div>
          <Slider
            value={[typography.size.subheading]}
            onValueChange={([subheading]) =>
              onChange({
                ...typography,
                size: { ...typography.size, subheading },
              })
            }
            min={14}
            max={24}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Body Size</Label>
            <span className="text-sm text-muted-foreground">
              {typography.size.body}px
            </span>
          </div>
          <Slider
            value={[typography.size.body]}
            onValueChange={([body]) =>
              onChange({
                ...typography,
                size: { ...typography.size, body },
              })
            }
            min={10}
            max={18}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Small Text Size</Label>
            <span className="text-sm text-muted-foreground">
              {typography.size.small}px
            </span>
          </div>
          <Slider
            value={[typography.size.small]}
            onValueChange={([small]) =>
              onChange({
                ...typography,
                size: { ...typography.size, small },
              })
            }
            min={8}
            max={14}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
