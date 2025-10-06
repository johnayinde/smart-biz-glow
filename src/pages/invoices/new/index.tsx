// src/pages/invoices/new/index.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const createInvoiceMutation = useCreateInvoice();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
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
        isActive: true,
        limit: 100,
      }),
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

  const handleSubmit = (data: InvoiceFormData) => {
    const payload = {
      clientId: data.clientId,
      issueDate: data.issueDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal,
      tax: data.tax || 0,
      discount: data.discount || 0,
      total,
      currency: "USD",
      notes: data.notes || undefined,
      terms: data.terms || undefined,
      reminderConfig: {
        enabled: data.reminderEnabled,
        sequenceType: "default" as const,
      },
    };

    createInvoiceMutation.mutate(payload as any, {
      onSuccess: (response) => {
        navigate(`/invoices/${response.data._id}`);
      },
    });
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Invoice</h1>
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
                              <SelectItem key={client._id} value={client._id}>
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
                    className="grid grid-cols-12 gap-4 items-end"
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

                    {/* Quantity */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>Qty</FormLabel>}
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 1
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            {index === 0 && <FormLabel>Price</FormLabel>}
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
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
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1">
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

                    {/* Tax */}
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
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Discount */}
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
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createInvoiceMutation.isPending
                ? "Creating..."
                : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
