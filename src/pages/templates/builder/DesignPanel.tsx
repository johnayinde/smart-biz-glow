// src/components/templates/builder/DesignPanel.tsx
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

      <AccordionItem value="typography">
        <AccordionTrigger className="text-base font-semibold">
          ✍️ Typography
        </AccordionTrigger>
        <AccordionContent>
          <FontSelector
            typography={design.typography}
            onChange={(typography) => onChange({ typography })}
          />
        </AccordionContent>
      </AccordionItem>

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

      <AccordionItem value="layout">
        <AccordionTrigger className="text-base font-semibold">
          📐 Layout
        </AccordionTrigger>
        <AccordionContent>
          <LayoutControls
            layout={design.layout}
            onChange={(layout) => onChange({ layout })}
          />
        </AccordionContent>
      </AccordionItem>

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

      <AccordionItem value="borders">
        <AccordionTrigger className="text-base font-semibold">
          ➖ Borders
        </AccordionTrigger>
        <AccordionContent>
          <BorderControls
            borders={design.borders}
            onChange={(borders) => onChange({ borders })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
