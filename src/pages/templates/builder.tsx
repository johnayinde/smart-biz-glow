// src/pages/templates/builder.tsx - COMPLETE FIX WITH DEEP MERGE
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
import { DesignConfig } from "@/services/templateService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Save,
  Smartphone,
  Monitor,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { DesignPanel } from "./builder/DesignPanel";
import { LivePreview } from "./builder/LivePreview";
import { TemplateInfoSection } from "./builder/TemplateInfoSection";

const defaultDesign: DesignConfig = {
  layout: "classic",
  paperSize: "A4",
  orientation: "portrait",
  logo: {
    url: "",
    position: "left",
    size: "medium",
    enabled: true,
  },
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    text: "#333333",
    textSecondary: "#666666",
    accent: "#28a745",
    background: "#ffffff",
    border: "#e0e0e0",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    size: {
      heading: 24,
      subheading: 18,
      body: 14,
      small: 12,
    },
  },
  sections: {
    header: {
      enabled: true,
      fields: ["logo", "companyName", "companyAddress", "companyContact"],
      order: 1,
    },
    invoiceInfo: {
      enabled: true,
      fields: ["invoiceNumber", "invoiceDate", "dueDate"],
      order: 2,
    },
    billTo: {
      enabled: true,
      fields: ["clientName", "clientAddress", "clientEmail"],
      order: 3,
    },
    items: {
      enabled: true,
      fields: ["description", "quantity", "unitPrice", "amount"],
      order: 4,
    },
    summary: {
      enabled: true,
      fields: ["subtotal", "tax", "discount", "total"],
      order: 5,
    },
    footer: {
      enabled: true,
      fields: ["notes", "terms", "paymentInfo"],
      order: 6,
    },
  },
  spacing: {
    sectionGap: 32,
    elementGap: 16,
    padding: 48,
  },
  advanced: {
    showBorders: true,
    borderStyle: "solid",
    showWatermark: false,
    watermarkText: "DRAFT",
    showPageNumbers: false,
    roundedCorners: true,
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: existingTemplate, isLoading: loadingTemplate } =
    useTemplate(id);
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
    if (existingTemplate?.data) {
      reset({
        name: existingTemplate.data.name,
        description: existingTemplate.data.description || "",
        design: existingTemplate.data.design,
        defaults: existingTemplate.data.defaults,
        tags: existingTemplate.data.tags || [],
        isDefault: existingTemplate.data.isDefault || false,
      });
    }
  }, [existingTemplate, reset]);

  // FIXED: Deep merge for nested design updates
  const handleDesignChange = (updates: Partial<DesignConfig>) => {
    // Create a properly deep-merged design object
    const updatedDesign: DesignConfig = {
      // Start with current design
      ...design,
      // Spread top-level updates
      ...updates,

      // Deep merge colors if provided
      colors: updates.colors
        ? { ...design.colors, ...updates.colors }
        : design.colors,

      // Deep merge fonts (including nested size object)
      fonts: updates.fonts
        ? {
            ...design.fonts,
            ...updates.fonts,
            // Ensure font sizes are also merged
            size: updates.fonts.size
              ? { ...design.fonts.size, ...updates.fonts.size }
              : design.fonts.size,
          }
        : design.fonts,

      // Deep merge logo
      logo: updates.logo ? { ...design.logo, ...updates.logo } : design.logo,

      // Deep merge sections
      sections: updates.sections
        ? {
            ...design.sections,
            ...updates.sections,
            // Also merge each section if only partial updates
            header: updates.sections.header
              ? { ...design.sections.header, ...updates.sections.header }
              : design.sections.header,
            invoiceInfo: updates.sections.invoiceInfo
              ? {
                  ...design.sections.invoiceInfo,
                  ...updates.sections.invoiceInfo,
                }
              : design.sections.invoiceInfo,
            billTo: updates.sections.billTo
              ? { ...design.sections.billTo, ...updates.sections.billTo }
              : design.sections.billTo,
            items: updates.sections.items
              ? { ...design.sections.items, ...updates.sections.items }
              : design.sections.items,
            summary: updates.sections.summary
              ? { ...design.sections.summary, ...updates.sections.summary }
              : design.sections.summary,
            footer: updates.sections.footer
              ? { ...design.sections.footer, ...updates.sections.footer }
              : design.sections.footer,
          }
        : design.sections,

      // Deep merge spacing
      spacing: updates.spacing
        ? { ...design.spacing, ...updates.spacing }
        : design.spacing,

      // Deep merge advanced options
      advanced: updates.advanced
        ? { ...design.advanced, ...updates.advanced }
        : design.advanced,
    };

    // Debug logging (remove in production)

    setValue("design", updatedDesign, { shouldDirty: true });
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      setIsSaving(true);

      if (!data.name || data.name.trim() === "") {
        toast({
          title: "Error",
          description: "Template name is required",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            name: data.name.trim(),
            description: data.description?.trim(),
            design: data.design,
            defaults: data.defaults,
            tags: data.tags || [],
            isDefault: data.isDefault || false,
          },
        });

        toast({
          title: "Success",
          description: `"${data.name}" has been updated successfully`,
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name.trim(),
          description: data.description?.trim(),
          design: data.design,
          defaults: data.defaults,
          tags: data.tags || [],
          isDefault: data.isDefault || false,
        });

        toast({
          title: "Success",
          description: `"${data.name}" has been created successfully`,
        });
      }

      reset(data, { keepValues: true });
      setIsSaving(false);
      navigate("/templates");
    } catch (error: any) {
      console.error("Template save error:", error);
      setIsSaving(false);
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} template`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate("/templates");
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    navigate("/templates");
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  if (loadingTemplate) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div>
            <p className="text-lg font-medium">Loading template...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch your template
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {isEditMode ? "Edit Template" : "Create Template"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {templateName || "Untitled Template"}
                  {isDirty && (
                    <span className="text-orange-500 ml-2">
                      • Unsaved changes
                    </span>
                  )}
                  {errors.name && (
                    <p className="text-lg text-destructive">
                      {errors.name.message as string}
                    </p>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={
                  isSaving ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {isSaving ||
                createMutation.isPending ||
                updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-auto">
          {/* Left Panel */}
          <div className="w-96 border-r bg-card flex flex-col min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="info" className="flex-1">
                  Info
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1">
                  Design
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 h-full">
                <TabsContent value="info" className="p-6 mt-0">
                  <TemplateInfoSection
                    register={register}
                    errors={errors}
                    defaults={templateDefaults}
                    onDefaultsChange={(defaults) =>
                      setValue("defaults", defaults, { shouldDirty: true })
                    }
                  />
                </TabsContent>

                <TabsContent value="design" className="p-6 mt-0">
                  <DesignPanel design={design} onChange={handleDesignChange} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col bg-muted/30">
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
                    {viewMode === "desktop" ? "Desktop View" : "Mobile View"}
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
                  <span className="text-sm text-muted-foreground w-12 text-center">
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
              <div
                className="p-8 flex justify-center items-start min-h-full"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
              >
                <LivePreview
                  design={design}
                  viewMode={viewMode}
                  templateName={templateName}
                  defaults={templateDefaults}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
