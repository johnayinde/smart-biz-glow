// src/components/templates/builder/ColorPicker.tsx
import { HexColorPicker } from "react-colorful";
import { ColorScheme } from "@/services/templateService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  colors: ColorScheme;
  onChange: (colors: ColorScheme) => void;
}

const presets = [
  {
    name: "Blue Professional",
    colors: {
      primary: "#1e3a8a",
      secondary: "#3b82f6",
      text: "#1f2937",
      textSecondary: "#6b7280",
      accent: "#10b981",
      background: "#ffffff",
      border: "#e5e7eb",
    },
  },
  {
    name: "Purple Gradient",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      text: "#333333",
      textSecondary: "#666666",
      accent: "#28a745",
      background: "#ffffff",
      border: "#e0e0e0",
    },
  },
  {
    name: "Green Fresh",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      text: "#1f2937",
      textSecondary: "#6b7280",
      accent: "#f59e0b",
      background: "#ffffff",
      border: "#d1d5db",
    },
  },
  {
    name: "Orange Warm",
    colors: {
      primary: "#ea580c",
      secondary: "#f97316",
      text: "#292524",
      textSecondary: "#78716c",
      accent: "#0891b2",
      background: "#ffffff",
      border: "#e7e5e4",
    },
  },
];

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Preset Themes</Label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => onChange(preset.colors)}
              className="justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <span className="text-xs">{preset.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <ColorInput
          label="Primary Color"
          color={colors.primary}
          onChange={(primary) => onChange({ ...colors, primary })}
        />
        <ColorInput
          label="Secondary Color"
          color={colors.secondary}
          onChange={(secondary) => onChange({ ...colors, secondary })}
        />
        <ColorInput
          label="Accent Color"
          color={colors.accent}
          onChange={(accent) => onChange({ ...colors, accent })}
        />
        <ColorInput
          label="Text Color"
          color={colors.text}
          onChange={(text) => onChange({ ...colors, text })}
        />
        <ColorInput
          label="Secondary Text"
          color={colors.textSecondary}
          onChange={(textSecondary) => onChange({ ...colors, textSecondary })}
        />
        <ColorInput
          label="Background"
          color={colors.background}
          onChange={(background) => onChange({ ...colors, background })}
        />
        <ColorInput
          label="Border Color"
          color={colors.border}
          onChange={(border) => onChange({ ...colors, border })}
        />
      </div>
    </div>
  );
}

function ColorInput({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 h-8 text-xs font-mono"
        />
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-10 h-8 rounded border border-input"
              style={{ backgroundColor: color }}
              aria-label={`Pick ${label}`}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <HexColorPicker color={color} onChange={onChange} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
