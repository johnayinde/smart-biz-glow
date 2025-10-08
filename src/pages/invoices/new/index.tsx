// src/pages/invoices/new/index.tsx
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
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { clientService } from "@/services/clientService";
import { useCreateInvoice } from "@/hooks/queries/use-invoices-query";
import { toast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/invoiceService";

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
  reminderEnabled: z.boolean().default(true),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function CreateInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");
  const isEditMode = !!id;

  const createInvoiceMutation = useCreateInvoice();

  // Fetch existing invoice if editing
  const { data: existingInvoice } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: isEditMode,
  });

  // const form = useForm<InvoiceFormData>({
  //   resolver: zodResolver(invoiceSchema),
  //   defaultValues: {
  //     clientId: clientIdFromUrl || "",
  //     issueDate: new Date(),
  //     dueDate: addDays(new Date(), 30),
  //     items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
  //     tax: 0,
  //     discount: 0,
  //     notes: "",
  //     terms: "Payment is due within 30 days",
  //     reminderEnabled: true,
  //   },
  // });
  console.log("🚀 existingInvoice:", existingInvoice);

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
              unitPrice: item.rate, // Backend uses 'rate'
              total: item.amount,
            })),
            tax: existingInvoice.data.tax || 0,
            discount: existingInvoice.data.discount || 0,
            notes: existingInvoice.data.notes || "",
            terms: existingInvoice.data.terms || "",
            reminderEnabled:
              existingInvoice.data.reminderConfig?.enabled ?? true,
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
            reminderEnabled: true,
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
    // staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const clients = clientsData?.data || [];

  // Calculate totals
  const calculateLineTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    const items = form.getValues("items");
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = form.watch("tax") || 0;
    const discount = form.watch("discount") || 0;
    return subtotal + tax - discount;
  };

  // Watch for changes to recalculate
  const watchedItems = form.watch("items");
  const watchedTax = form.watch("tax");
  const watchedDiscount = form.watch("discount");

  useEffect(() => {
    // Recalculate line totals
    watchedItems.forEach((item, index) => {
      const newTotal = calculateLineTotal(item.quantity, item.unitPrice);
      if (item.total !== newTotal) {
        form.setValue(`items.${index}.total`, newTotal);
      }
    });
  }, [watchedItems, form]);

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  const handleSubmit = async (data: InvoiceFormData) => {
    console.log("🚀 Form submitted with data:", data);

    // Validate at least one item
    if (!data.items || data.items.length === 0) {
      console.error("❌ No items in form");
      return;
    }

    const hasInvalidItems = data.items.some(
      (item) => !item.description || item.quantity < 1 || item.unitPrice <= 0
    );

    if (hasInvalidItems) {
      toast({
        title: "Validation Error",
        description:
          "Please ensure all items have a description, quantity (minimum 1), and price greater than 0",
        variant: "destructive",
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const total = calculateTotal();

    console.log("💰 Calculated totals:", { subtotal, total });

    const payload = {
      clientId: data.clientId,
      issueDate: data.issueDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
      items: data.items.map((item) => ({
        description: item.description.trim(),
        quantity: Number(item.quantity),
        rate: Number(item.unitPrice),
        amount: Number(item.total),
      })),
      subtotal: Number(subtotal.toFixed(2)),
      taxRate: 0,
      taxAmount: Number((data.tax || 0).toFixed(2)),
      discount: Number((data.discount || 0).toFixed(2)),
      total: Number(total.toFixed(2)),
      currency: "USD",
      notes: data.notes?.trim() || undefined,
      terms: data.terms?.trim() || undefined,
      reminderConfig: {
        enabled: data.reminderEnabled,
        sequenceType: "default" as const,
      },
    };

    console.log("Sending payload:", payload);

    try {
      const response = await createInvoiceMutation.mutateAsync(payload as any);
      console.log("Invoice created successfully:", response);

      if (response?.data?.id) {
        navigate(`/invoices/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {" "}
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new invoice
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Selection */}
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={clientsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              No clients found.{" "}
                              <button
                                type="button"
                                className="text-primary underline"
                                onClick={() => navigate("/clients")}
                              >
                                Create a client first
                              </button>
                            </div>
                          ) : (
                            clients.map((client) => (
                              <SelectItem key={client?.id} value={client?.id}>
                                {client.name}
                                {client.company && ` - ${client.company}`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reminder Toggle */}
                <FormField
                  control={form.control}
                  name="reminderEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Automatic Reminders
                        </FormLabel>
                        <FormDescription>
                          Send payment reminders automatically
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Issue Date */}
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Issue Date *</FormLabel>
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

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date *</FormLabel>
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
                            disabled={(date) =>
                              date < form.getValues("issueDate")
                            }
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
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-4 items-start"
                  >
                    {/* Description */}
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>Description</FormLabel>}
                            <FormControl>
                              <Input
                                placeholder="Item description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quantity - TEXT INPUT */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>Qty</FormLabel>}
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow empty or only digits
                                  if (value === "" || /^\d+$/.test(value)) {
                                    const numValue =
                                      value === "" ? 0 : parseInt(value);
                                    field.onChange(numValue);

                                    // Immediately recalculate total
                                    const unitPrice =
                                      form.getValues(
                                        `items.${index}.unitPrice`
                                      ) || 0;
                                    const newTotal = numValue * unitPrice;
                                    form.setValue(
                                      `items.${index}.total`,
                                      newTotal
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  const numValue = parseInt(value);
                                  if (!value || numValue < 1) {
                                    field.onChange(1); // Default to 1, not 0
                                    const unitPrice =
                                      form.getValues(
                                        `items.${index}.unitPrice`
                                      ) || 0;
                                    form.setValue(
                                      `items.${index}.total`,
                                      1 * unitPrice
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="h-5">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Unit Price - TEXT INPUT */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>Price</FormLabel>}
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow empty, digits, and one decimal point with up to 2 decimals
                                  if (
                                    value === "" ||
                                    /^\d*\.?\d{0,2}$/.test(value)
                                  ) {
                                    const numValue =
                                      value === "" ? 0 : parseFloat(value) || 0;
                                    field.onChange(numValue);

                                    // Immediately recalculate total
                                    const quantity =
                                      form.getValues(
                                        `items.${index}.quantity`
                                      ) || 0;
                                    const newTotal = quantity * numValue;
                                    form.setValue(
                                      `items.${index}.total`,
                                      newTotal
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  // Format to 2 decimals on blur
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    isNaN(parseFloat(value))
                                  ) {
                                    field.onChange(0);
                                    form.setValue(`items.${index}.total`, 0);
                                  } else {
                                    const formatted = parseFloat(
                                      parseFloat(value).toFixed(2)
                                    );
                                    field.onChange(formatted);

                                    // Recalculate total with formatted price
                                    const quantity =
                                      form.getValues(
                                        `items.${index}.quantity`
                                      ) || 0;
                                    form.setValue(
                                      `items.${index}.total`,
                                      quantity * formatted
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="h-5">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Total */}
                    <div className="col-span-2">
                      {index === 0 && (
                        <FormLabel className="block mb-2">Total</FormLabel>
                      )}
                      <div className="text-right font-medium py-2">
                        {formatter.format(
                          form.watch(`items.${index}.total`) || 0
                        )}
                      </div>
                      <div className="h-5"></div>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className={index === 0 ? "mt-8" : ""}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/2 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        {formatter.format(subtotal)}
                      </span>
                    </div>

                    {/* Tax - TEXT INPUT */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Tax:
                      </span>
                      <FormField
                        control={form.control}
                        name="tax"
                        render={({ field }) => (
                          <FormItem className="flex-1 max-w-[200px]">
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    /^\d*\.?\d{0,2}$/.test(value)
                                  ) {
                                    field.onChange(
                                      value === "" ? "" : parseFloat(value) || 0
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    isNaN(parseFloat(value))
                                  ) {
                                    field.onChange(0);
                                  } else {
                                    field.onChange(
                                      parseFloat(parseFloat(value).toFixed(2))
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Discount - TEXT INPUT */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Discount:
                      </span>
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="flex-1 max-w-[200px]">
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    /^\d*\.?\d{0,2}$/.test(value)
                                  ) {
                                    field.onChange(
                                      value === "" ? "" : parseFloat(value) || 0
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    isNaN(parseFloat(value))
                                  ) {
                                    field.onChange(0);
                                  } else {
                                    field.onChange(
                                      parseFloat(parseFloat(value).toFixed(2))
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatter.format(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or comments..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes will appear on the invoice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Payment terms and conditions..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Payment terms and conditions for the client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/invoices")}
              disabled={createInvoiceMutation.isPending}
              //disabled={false}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createInvoiceMutation.isPending
                ? "Processing..."
                : isEditMode
                ? "Save"
                : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
