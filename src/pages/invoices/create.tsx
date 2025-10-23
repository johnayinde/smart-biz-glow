// src/pages/invoices/create.tsx - UPDATED WITH TEMPLATE INTEGRATION
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useTemplates } from "@/hooks/queries/use-template-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { InvoiceItemsTable } from "@/components/invoices/InvoiceItemsTable";
import { TemplateSelector } from "@/components/invoices/TemplateSelector";
import {
  useCreateInvoice,
  useInvoiceQuery,
  useUpdateInvoice,
} from "@/hooks/queries/use-invoices-query";
import { useInvoices } from "@/hooks/useInvoices";
import { invoiceService } from "@/services/invoiceService";
import { useQuery } from "@tanstack/react-query";

const invoiceSchema = z.object({
  templateId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email"),
  clientAddress: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  issueDate: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
        amount: z.number(),
      })
    )
    .min(1),
  subtotal: z.number(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function CreateInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  // const {
  //   data: { data: existingInvoice },
  //   isLoading: loadingInvoice,
  // } = useInvoiceQuery(id);

  const {
    data: { data: existingInvoice },
    isLoading: loadingInvoice,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: isEditMode,
  });

  const {
    data: { data: templates },
  } = useTemplates();
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      templateId: "",
      clientName: "",
      clientEmail: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        Date.now()
      ).slice(-4)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [{ description: "", quantity: 1, unitPrice: 0, amount: 0 }],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      status: "draft",
    },
  });

  const items = watch("items");
  const templateId = watch("templateId");
  const taxRate = watch("tax") || 0;
  const discount = watch("discount") || 0;

  useEffect(() => {
    if (existingInvoice) {
      reset({
        ...existingInvoice,
        status:
          existingInvoice.status === "cancelled"
            ? "draft"
            : existingInvoice.status,
        invoiceDate: existingInvoice.invoiceDate.split("T")[0],
        dueDate: existingInvoice.dueDate.split("T")[0],
      });
    }
  }, [existingInvoice, reset]);

  useEffect(() => {
    if (!isEditMode && templates && !templateId) {
      const defaultTemplate = templates.find((t) => t.isDefault);
      if (defaultTemplate) {
        setValue("templateId", defaultTemplate.id);
        if (defaultTemplate.defaults) {
          if (defaultTemplate.defaults.notes)
            setValue("notes", defaultTemplate.defaults.notes);
          if (defaultTemplate.defaults.terms)
            setValue("terms", defaultTemplate.defaults.terms);
        }
      }
    }
  }, [templates, isEditMode, templateId, setValue]);

  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discount;
    setValue("subtotal", subtotal);
    setValue("total", total);
    items.forEach((item, index) => {
      setValue(`items.${index}.amount`, item.quantity * item.unitPrice);
    });
  }, [items, taxRate, discount, setValue]);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            ...data,
            items: data.items.map((item) => ({
              description: item.description || "", // Ensure description is always provided
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
              rate: item.unitPrice, // Map unitPrice to rate
            })),
          },
        });
        toast({
          title: "Success",
          description: "Invoice updated successfully",
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          subtotal: data.subtotal,
          total: data.total,
          dueDate: data.dueDate || new Date().toISOString(), // Provide a default dueDate if missing
          items: data.items.map((item) => ({
            description: item.description || "", // Ensure description is always provided
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            rate: item.unitPrice, // Map unitPrice to rate
          })),
        });
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
      }
      navigate("/invoices");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  const selectedTemplate = templates?.find((t) => t.id === templateId);

  if (loadingInvoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/invoices")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Invoice" : "Create Invoice"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {watch("invoiceNumber")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/invoices/${id}/preview`, "_blank")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
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
      </div>

      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector
                  templates={templates || []}
                  selectedTemplateId={templateId}
                  onSelect={(id) => {
                    setValue("templateId", id);
                    const template = templates?.find((t) => t.id === id);
                    if (template?.defaults) {
                      if (template.defaults.notes)
                        setValue("notes", template.defaults.notes);
                      if (template.defaults.terms)
                        setValue("terms", template.defaults.terms);
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Client Name *</Label>
                    <Input {...register("clientName")} />
                    {errors.clientName && (
                      <p className="text-sm text-destructive">
                        {errors.clientName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Client Email *</Label>
                    <Input type="email" {...register("clientEmail")} />
                    {errors.clientEmail && (
                      <p className="text-sm text-destructive">
                        {errors.clientEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea {...register("clientAddress")} rows={2} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Invoice Number *</Label>
                    <Input {...register("invoiceNumber")} />
                  </div>
                  <div>
                    <Label>Invoice Date *</Label>
                    <Input type="date" {...register("invoiceDate")} />
                  </div>
                  <div>
                    <Label>Due Date *</Label>
                    <Input type="date" {...register("dueDate")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceItemsTable
                  items={items}
                  register={register}
                  onAdd={() =>
                    setValue("items", [
                      ...items,
                      { description: "", quantity: 1, unitPrice: 0, amount: 0 },
                    ])
                  }
                  onRemove={(idx) =>
                    setValue(
                      "items",
                      items.filter((_, i) => i !== idx)
                    )
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Notes</Label>
                  <Textarea {...register("notes")} rows={3} />
                </div>
                <div>
                  <Label>Terms & Conditions</Label>
                  <Textarea {...register("terms")} rows={3} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">
                    ${watch("subtotal").toFixed(2)}
                  </span>
                </div>
                <div>
                  <Label>Tax (%)</Label>
                  <Input
                    type="number"
                    {...register("tax", { valueAsNumber: true })}
                    step="0.01"
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Tax Amount:</span>
                    <span>
                      ${((watch("subtotal") * taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Discount ($)</Label>
                  <Input
                    type="number"
                    {...register("discount", { valueAsNumber: true })}
                    step="0.01"
                  />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ${watch("total").toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
