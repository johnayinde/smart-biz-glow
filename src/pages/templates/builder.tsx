// src/pages/templates/builder.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useTemplate,
  useCreateTemplate,
  useUpdateTemplate,
} from "@/hooks/queries/use-template-query";
import { DesignConfig, TemplateDefaults } from "@/services/templateService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Smartphone,
  Monitor,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { DesignPanel } from "./builder/DesignPanel";
import { LivePreview } from "./builder/LivePreview";
import { TemplateInfoSection } from "./builder/TemplateInfoSection";
// import { TemplateInfoSection } from "./builder/TemplateInfoSection";

const defaultDesign: DesignConfig = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    text: "#333333",
    textSecondary: "#666666",
    accent: "#28a745",
    background: "#ffffff",
    border: "#e0e0e0",
  },
  typography: {
    heading: "Inter",
    body: "Inter",
    size: {
      heading: 24,
      subheading: 18,
      body: 14,
      small: 12,
    },
  },
  logo: {
    url: "",
    position: "left",
    size: "medium",
    enabled: true,
  },
  layout: {
    pageSize: "A4",
    orientation: "portrait",
    margins: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40,
    },
  },
  sections: {
    header: {
      enabled: true,
      fields: ["logo", "companyName", "companyAddress", "companyContact"],
      order: 1,
    },
    billTo: {
      enabled: true,
      fields: ["clientName", "clientAddress", "clientEmail"],
      order: 2,
    },
    items: {
      enabled: true,
      fields: ["description", "quantity", "unitPrice", "amount"],
      order: 3,
    },
    summary: {
      enabled: true,
      fields: ["subtotal", "tax", "discount", "total"],
      order: 4,
    },
    footer: {
      enabled: true,
      fields: ["notes", "terms", "paymentInfo"],
      order: 5,
    },
    notes: {
      enabled: true,
      fields: ["notes"],
      order: 6,
    },
  },
  spacing: {
    lineHeight: 1.5,
    sectionGap: 24,
    itemGap: 12,
  },
  borders: {
    enabled: true,
    width: 1,
    style: "solid",
    color: "#e0e0e0",
  },
};

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  design: z.any(),
  defaults: z
    .object({
      paymentTerms: z.string().optional(),
      notes: z.string().optional(),
      terms: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function TemplateBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("design");

  const { data: existingTemplate, isLoading: loadingTemplate } =
    useTemplate(id);

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  console.log(existingTemplate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      design: defaultDesign,
      defaults: {
        paymentTerms: "Net 30",
        notes: "",
        terms: "",
      },
      tags: [],
      isDefault: false,
    },
  });

  const design = watch("design");
  const templateName = watch("name");
  const templateDefaults = watch("defaults");

  useEffect(() => {
    if (existingTemplate) {
      reset({
        name: existingTemplate.name,
        description: existingTemplate.description || "",
        design: existingTemplate.design,
        defaults: existingTemplate.defaults,
        tags: existingTemplate.tags,
        isDefault: existingTemplate.isDefault,
      });
    }
  }, [existingTemplate, reset]);

  const handleDesignChange = (updates: Partial<DesignConfig>) => {
    setValue("design", { ...design, ...updates }, { shouldDirty: true });
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            name: data.name,
            description: data.description,
            design: data.design,
            defaults: data.defaults,
            tags: data.tags,
            isDefault: data.isDefault,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          design: data.design,
          defaults: data.defaults,
          tags: data.tags,
          isDefault: data.isDefault,
        });
      }
      navigate("/templates");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      navigate("/templates");
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  if (loadingTemplate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/templates")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isEditMode ? "Edit Template" : "Create Template"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {templateName || "Untitled Template"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r bg-card flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                <TabsContent value="info" className="mt-0 space-y-6">
                  <TemplateInfoSection
                    register={register}
                    errors={errors}
                    defaults={templateDefaults}
                    onDefaultsChange={(defaults) =>
                      setValue("defaults", defaults, { shouldDirty: true })
                    }
                  />
                </TabsContent>

                <TabsContent value="design" className="mt-0 space-y-6">
                  <DesignPanel design={design} onChange={handleDesignChange} />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="flex-1 bg-muted/30 flex flex-col">
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-2" />
                <span className="text-sm text-muted-foreground">
                  {viewMode === "desktop" ? "Desktop" : "Mobile"} Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 150}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 flex justify-center">
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
                className="transition-transform"
              >
                <LivePreview
                  design={design}
                  viewMode={viewMode}
                  templateName={templateName}
                  defaults={templateDefaults}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
