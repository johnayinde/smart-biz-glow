// src/pages/templates/builder/DesignPanel.tsx
import { DesignConfig } from "@/services/templateService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BorderControls } from "./BorderControls";
import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";
import { LayoutControls } from "./LayoutControls";
import { LogoUploader } from "./LogoUploader";
import { SectionEditor } from "./SectionEditor";
import { SpacingControls } from "./SpacingControls";

interface DesignPanelProps {
  design: DesignConfig;
  onChange: (updates: Partial<DesignConfig>) => void;
}

export function DesignPanel({ design, onChange }: DesignPanelProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={["colors", "typography", "layout"]}
      className="w-full"
    >
      {/* Colors Section */}
      <AccordionItem value="colors">
        <AccordionTrigger className="text-base font-semibold">
          🎨 Colors
        </AccordionTrigger>
        <AccordionContent>
          <ColorPicker
            colors={design.colors}
            onChange={(colors) => onChange({ colors })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Typography Section */}
      <AccordionItem value="typography">
        <AccordionTrigger className="text-base font-semibold">
          ✍️ Typography
        </AccordionTrigger>
        <AccordionContent>
          <FontSelector
            typography={design.fonts}
            onChange={(fonts) => onChange({ fonts })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Logo Section */}
      <AccordionItem value="logo">
        <AccordionTrigger className="text-base font-semibold">
          🏢 Logo
        </AccordionTrigger>
        <AccordionContent>
          <LogoUploader
            logo={design.logo}
            onChange={(logo) => onChange({ logo })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Layout Section */}
      <AccordionItem value="layout">
        <AccordionTrigger className="text-base font-semibold">
          📐 Layout
        </AccordionTrigger>
        <AccordionContent>
          <LayoutControls
            layout={design.layout}
            paperSize={design.paperSize}
            orientation={design.orientation}
            onLayoutChange={(layout) => onChange({ layout })}
            onPaperSizeChange={(paperSize) => onChange({ paperSize })}
            onOrientationChange={(orientation) => onChange({ orientation })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Sections Management */}
      <AccordionItem value="sections">
        <AccordionTrigger className="text-base font-semibold">
          📋 Sections
        </AccordionTrigger>
        <AccordionContent>
          <SectionEditor
            sections={design.sections}
            onChange={(sections) => onChange({ sections })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Spacing Controls */}
      <AccordionItem value="spacing">
        <AccordionTrigger className="text-base font-semibold">
          📏 Spacing
        </AccordionTrigger>
        <AccordionContent>
          <SpacingControls
            spacing={design.spacing}
            onChange={(spacing) => onChange({ spacing })}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Advanced Options (Borders, Watermark, etc.) */}
      <AccordionItem value="advanced">
        <AccordionTrigger className="text-base font-semibold">
          ⚙️ Advanced Options
        </AccordionTrigger>
        <AccordionContent>
          <BorderControls
            advanced={design.advanced}
            onChange={(advanced) => onChange({ advanced })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
