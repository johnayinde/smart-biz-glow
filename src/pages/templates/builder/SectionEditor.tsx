// src/components/templates/builder/SectionEditor.tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface SectionEditorProps {
  sections: {
    [key: string]: {
      enabled: boolean;
      fields: string[];
      order: number;
    };
  };
  onChange: (sections: any) => void;
}

const sectionLabels: { [key: string]: string } = {
  header: "Header (Company Info)",
  billTo: "Bill To (Client Info)",
  items: "Line Items Table",
  summary: "Summary (Subtotal, Tax, Total)",
  footer: "Footer (Payment Info)",
  notes: "Notes & Terms",
};

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const handleToggle = (sectionKey: string, enabled: boolean) => {
    onChange({
      ...sections,
      [sectionKey]: {
        ...sections[sectionKey],
        enabled,
      },
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Toggle sections on/off to customize your invoice layout
      </p>
      {Object.keys(sections).map((sectionKey) => (
        <Card key={sectionKey} className="p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={sectionKey} className="cursor-pointer">
              {sectionLabels[sectionKey] || sectionKey}
            </Label>
            <Switch
              id={sectionKey}
              checked={sections[sectionKey].enabled}
              onCheckedChange={(enabled) => handleToggle(sectionKey, enabled)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
