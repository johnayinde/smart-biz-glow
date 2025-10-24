// src/pages/templates/builder.tsx - FIXED VERSION
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
  layout: "classic", // Changed from object
  paperSize: "A4", // Changed from layout.pageSize
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
    // Changed from typography
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
      // Added (was missing)
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
    // Removed notes section
  },
  spacing: {
    sectionGap: 32, // Changed from 24
    elementGap: 16, // Added (was itemGap)
    padding: 48,
  },
  advanced: {
    // Changed from borders
    showBorders: true,
    borderStyle: "solid",
    showWatermark: false,
    watermarkText: "DRAFT",
    showPageNumbers: false,
    roundedCorners: true,
  },
};

const templateSchema = z.object({
  name: z.string(),
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

  // Block navigation if there are unsaved changes
  // const blocker = useBlocker(
  //   ({ currentLocation, nextLocation }) =>
  //     isDirty && !isSaving && currentLocation.pathname !== nextLocation.pathname
  // );

  // Warn before leaving with unsaved changes
  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (isDirty && !isSaving) {
  //       e.preventDefault();
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [isDirty, isSaving]);

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

  const handleDesignChange = (updates: Partial<DesignConfig>) => {
    setValue("design", { ...design, ...updates }, { shouldDirty: true });
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      console.log(data);
      setIsSaving(true);

      // Validate required fields
      if (!data.name || data.name.trim() === "") {
        toast({
          title: "error",
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
          title: "success",
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
          title: "success",
          description: `"${data.name}" has been created successfully`,
        });
      }

      // Reset form dirty state before navigation
      reset(data, { keepValues: true });
      setIsSaving(false);

      // Navigate after successful save
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

  // Loading state
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
                <p className="text-sm text-muted-foreground">
                  {templateName || "Untitled Template"}
                  {isDirty && (
                    <span className="text-orange-500 ml-2">
                      • Unsaved changes
                    </span>
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

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Form & Design Controls */}
          <div className="w-96 border-r bg-card flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="info" className="flex-1">
                  Info
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1">
                  Design
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All your
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
