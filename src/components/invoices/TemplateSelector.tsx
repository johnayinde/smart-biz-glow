// src/components/invoices/TemplateSelector.tsx
import { Template } from "@/services/templateService";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  const navigate = useNavigate();

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No templates available</p>
        <Button onClick={() => navigate("/invoice-templates/builder")}>
          <Plus className="h-4 w-4 mr-2" />
          Create First Template
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedTemplateId} onValueChange={onSelect}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <label
              key={template.id}
              htmlFor={template.id}
              className="relative cursor-pointer"
            >
              <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={template.id}
                    id={template.id}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{template.name}</span>
                      {template.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
                        <div
                          className="w-3 h-3 rounded"
                          style={{
                            backgroundColor: template.design.colors.primary,
                          }}
                        />
                        <div
                          className="w-3 h-3 rounded"
                          style={{
                            backgroundColor: template.design.colors.secondary,
                          }}
                        />
                        <div
                          className="w-3 h-3 rounded"
                          style={{
                            backgroundColor: template.design.colors.accent,
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/invoice-templates/preview/${template.id}`);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </RadioGroup>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => navigate("/invoice-templates/builder")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Template
      </Button>
    </div>
  );
}
