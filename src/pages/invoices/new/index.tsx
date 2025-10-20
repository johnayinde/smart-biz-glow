// src/pages/invoices/new/index.tsx - UPDATED VERSION
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { clientService } from "@/services/clientService";
import {
  useCreateInvoice,
  useUpdateInvoice,
} from "@/hooks/queries/use-invoices-query";
import { toast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoiceService";
import { ReminderConfigSection } from "@/components/invoices/ReminderConfigSection";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
  total: z.number(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  items: z.array(lineItemSchema).min(1, "At least one item is required"),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  reminderConfig: z.object({
    enabled: z.boolean().default(true),
    sequenceType: z
      .enum(["default", "aggressive", "gentle"])
      .default("default"),
  }),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function CreateInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");
  const isEditMode = !!id;

  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();

  // Fetch existing invoice if editing
  const { data: existingInvoice } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: isEditMode,
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues:
      isEditMode && existingInvoice?.data
        ? {
            clientId: existingInvoice.data.clientId,
            issueDate: new Date(existingInvoice.data.issueDate),
            dueDate: new Date(existingInvoice.data.dueDate),
            items: existingInvoice.data.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.rate,
              total: item.amount,
            })),
            tax: existingInvoice.data.tax || 0,
            discount: existingInvoice.data.discount || 0,
            notes: existingInvoice.data.notes || "",
            terms: existingInvoice.data.terms || "",
            reminderConfig: {
              enabled: existingInvoice.data.reminderConfig?.enabled ?? true,
              sequenceType:
                existingInvoice.data.reminderConfig?.sequenceType || "default",
            },
          }
        : {
            clientId: clientIdFromUrl || "",
            issueDate: new Date(),
            dueDate: addDays(new Date(), 30),
            items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
            tax: 0,
            discount: 0,
            notes: "",
            terms: "Payment is due within 30 days",
            reminderConfig: {
              enabled: true,
              sequenceType: "default",
            },
          },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch clients
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", "active"],
    queryFn: () =>
      clientService.getClients({
        status: "active",
        limit: 100,
      }),
  });

  const clients = clientsData?.data || [];

  // Reset form when existing invoice data loads (for edit mode)
  useEffect(() => {
    if (isEditMode && existingInvoice?.data) {
      const invoice = existingInvoice.data;
      form.reset({
        clientId: invoice.clientId,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.rate,
          total: item.amount,
        })),
        tax: invoice.tax || 0,
        discount: invoice.discount || 0,
        notes: invoice.notes || "",
        terms: invoice.terms || "",
        reminderConfig: {
          enabled: invoice.reminderConfig?.enabled ?? true,
          sequenceType: invoice.reminderConfig?.sequenceType || "default",
        },
      });
    }
  }, [existingInvoice, isEditMode, form]);

  // Set clientId from URL if provided (for create mode)
  useEffect(() => {
    if (!isEditMode && clientIdFromUrl && clients.length > 0) {
      const clientExists = clients.some(
        (client) => client.id === clientIdFromUrl
      );
      if (clientExists) {
        form.setValue("clientId", clientIdFromUrl);
      }
    }
  }, [clientIdFromUrl, clients, isEditMode, form]);

  // Calculate line item total
  const calculateLineTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    const items = form.getValues("items");
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = form.getValues("tax") || 0;
    const discount = form.getValues("discount") || 0;
    const taxAmount = (subtotal * tax) / 100;
    const total = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, total };
  };

  // Update line item total when quantity or price changes
  const handleLineItemChange = (index: number) => {
    const item = form.getValues(`items.${index}`);
    const total = calculateLineTotal(item.quantity, item.unitPrice);
    form.setValue(`items.${index}.total`, total);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const { subtotal, taxAmount, total } = calculateTotals();

      const invoicePayload = {
        clientId: data.clientId,
        issueDate: data.issueDate.toISOString(),
        dueDate: data.dueDate.toISOString(),
        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.unitPrice,
          amount: item.total,
        })),
        subtotal,
        taxRate: data.tax || 0,
        taxAmount,
        discount: data.discount || 0,
        total,
        notes: data.notes,
        terms: data.terms,
        status: "draft" as const,
        reminderConfig: data.reminderConfig,
      };

      if (isEditMode) {
        await updateInvoiceMutation.mutateAsync({
          id: id!,
          data: invoicePayload,
        });
        toast({
          title: "Success",
          description: "Invoice updated successfully",
        });
      } else {
        await createInvoiceMutation.mutateAsync(invoicePayload);
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

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/invoices")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Invoice" : "Create New Invoice"}
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client & Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientsLoading ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Loading clients...
                          </div>
                        ) : clients.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No clients found. Create a client first.
                          </div>
                        ) : (
                          clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}{" "}
                              {client.company && `(${client.company})`}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Issue Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Description</FormLabel>}
                        <FormControl>
                          <Input {...field} placeholder="Item description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        {index === 0 && <FormLabel>Qty</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value);
                              field.onChange(value);
                              handleLineItemChange(index);
                            }}
                            onFocus={(e) => e.target.select()}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        {index === 0 && <FormLabel>Price</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value);
                              field.onChange(value);
                              handleLineItemChange(index);
                            }}
                            onFocus={(e) => e.target.select()}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.total`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        {index === 0 && <FormLabel>Total</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.toFixed(2)}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Additional notes for the client"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Payment terms and conditions"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  {(form.getValues("discount") || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="font-medium text-red-600">
                        -${(form.getValues("discount") || 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminder Configuration - NEW SECTION */}
          <ReminderConfigSection form={form} />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/invoices")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createInvoiceMutation.isPending ||
                updateInvoiceMutation.isPending
              }
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
