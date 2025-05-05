import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMockData } from "@/services/mockData";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, Printer, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  rate: z.string().min(1, "Rate is required"),
  amount: z.string().optional(),
});

const formSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
  template: z.string().min(1, "Template is required"),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
  subtotal: z.string().optional(),
  taxRate: z.string().optional(),
  taxAmount: z.string().optional(),
  total: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const invoiceTemplates = [
  {
    id: "standard",
    name: "Standard",
    description: "Classic business invoice with essential details",
    previewImage: "https://placehold.co/120x80/e2e8f0/64748b?text=Standard&font=open-sans",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with improved readability",
    previewImage: "https://placehold.co/120x80/f1f5f9/475569?text=Modern&font=open-sans",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and simple with focus on content",
    previewImage: "https://placehold.co/120x80/f8fafc/334155?text=Minimal&font=open-sans",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Detailed format for corporate requirements",
    previewImage: "https://placehold.co/120x80/e0f2fe/0369a1?text=Pro&font=open-sans",
  },
];

export const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const clients = getMockData.clients();
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum}`;
  };

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  const dueDateString = dueDate.toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: generateInvoiceNumber(),
      issueDate: today,
      dueDate: dueDateString,
      status: "draft",
      template: "standard",
      lineItems: [{ description: "", quantity: "1", rate: "0.00", amount: "0.00" }],
      subtotal: "0.00",
      taxRate: "0",
      taxAmount: "0.00",
      total: "0.00",
      notes: "",
      terms: "Payment due within 30 days of issue.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  // Calculate line item amount
  const calculateLineItemAmount = (quantity: string, rate: string) => {
    const quantityNum = parseFloat(quantity) || 0;
    const rateNum = parseFloat(rate) || 0;
    return (quantityNum * rateNum).toFixed(2);
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    const lineItems = form.getValues("lineItems");
    let subtotal = 0;

    lineItems.forEach((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      subtotal += quantity * rate;
    });

    const taxRate = parseFloat(form.getValues("taxRate")) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    form.setValue("subtotal", subtotal.toFixed(2));
    form.setValue("taxAmount", taxAmount.toFixed(2));
    form.setValue("total", total.toFixed(2));
  };

  // Watch for changes to recalculate totals
  form.watch(["lineItems", "taxRate"]);

  // Handle line item changes
  const handleLineItemChange = (index: number, field: "quantity" | "rate", value: string) => {
    const lineItems = form.getValues("lineItems");
    lineItems[index][field] = value;
    const amount = calculateLineItemAmount(lineItems[index].quantity, lineItems[index].rate);
    
    form.setValue(`lineItems.${index}.amount`, amount);
    calculateTotals();
  };

  // Generate a preview of the selected template
  const generatePreview = () => {
    const values = form.getValues();
    const selectedTemplate = invoiceTemplates.find(t => t.id === values.template);
    const selectedClient = clients.find(c => c.id.toString() === values.clientId);
    
    return (
      <div className="p-4 max-w-[600px] border rounded-md bg-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">{selectedTemplate?.name} Template</h2>
            <p className="text-muted-foreground text-sm">Invoice #{values.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Date: {values.issueDate}</p>
            <p className="text-sm">Due: {values.dueDate}</p>
            <p className="mt-1 text-xs px-2 py-1 rounded bg-gray-100 inline-block">
              {values.status.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">From:</p>
            <p className="font-medium">Your Company</p>
            <p className="text-sm">123 Business St</p>
            <p className="text-sm">contact@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Bill To:</p>
            <p className="font-medium">{selectedClient?.name || "Select a client"}</p>
            {selectedClient && (
              <>
                <p className="text-sm">{selectedClient.company}</p>
                <p className="text-sm">{selectedClient.email}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="border rounded mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2 w-16">Qty</th>
                <th className="text-right p-2 w-24">Rate</th>
                <th className="text-right p-2 w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {values.lineItems.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{item.description || "Item description"}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">${item.rate}</td>
                  <td className="p-2 text-right">${item.amount || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end">
          <div className="w-48">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${values.subtotal}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax ({values.taxRate}%):</span>
              <span>${values.taxAmount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${values.total}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t text-sm">
          <p className="font-medium mb-2">Notes:</p>
          <p className="text-muted-foreground">{values.notes || "No notes provided."}</p>
          
          <p className="font-medium mb-2 mt-4">Terms & Conditions:</p>
          <p className="text-muted-foreground">{values.terms}</p>
        </div>
      </div>
    );
  };

  const onSubmit = (values: FormValues) => {
    console.log("Creating invoice with:", values);
    toast({
      title: "Invoice Created",
      description: `Invoice ${values.invoiceNumber} has been created using the ${values.template} template.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new invoice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem className="space-y-3 flex-1">
                    <FormLabel>Invoice Template</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        {invoiceTemplates.map((template) => (
                          <Card 
                            key={template.id}
                            className={cn(
                              "cursor-pointer hover:border-primary transition-colors",
                              field.value === template.id ? "border-2 border-primary" : ""
                            )}
                            onClick={() => field.onChange(template.id)}
                          >
                            <CardContent className="p-3 flex flex-col items-center text-center">
                              <div className="relative">
                                <img 
                                  src={template.previewImage} 
                                  alt={template.name} 
                                  className="rounded mb-2 border" 
                                />
                                <div className="absolute top-2 right-2">
                                  <RadioGroupItem 
                                    value={template.id} 
                                    id={template.id} 
                                    className="sr-only" 
                                  />
                                  <div className={cn(
                                    "h-4 w-4 rounded-full border border-primary",
                                    field.value === template.id ? "bg-primary" : "bg-background"
                                  )} />
                                </div>
                              </div>
                              <div className="font-medium text-sm">{template.name}</div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Popover open={previewOpen} onOpenChange={setPreviewOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2 mt-6"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Invoice
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[650px] p-0" 
                  align="end"
                >
                  {generatePreview()}
                  <div className="p-2 border-t flex justify-end">
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setPreviewOpen(false)}
                    >
                      <Printer className="h-4 w-4" />
                      Print Preview
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Line Items</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Description</FormLabel>}
                          <FormControl>
                            <Input {...field} placeholder="Item description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Qty</FormLabel>}
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="1" 
                              step="1" 
                              onChange={(e) => {
                                field.onChange(e);
                                handleLineItemChange(index, "quantity", e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Rate</FormLabel>}
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              onChange={(e) => {
                                field.onChange(e);
                                handleLineItemChange(index, "rate", e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Amount</FormLabel>}
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(index)}
                        className="mt-2"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: "", quantity: "1", rate: "0.00", amount: "0.00" })}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Line Item
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes for the client"
                          className="h-24"
                          {...field}
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
                    <FormItem className="mt-4">
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment terms and conditions"
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">${form.watch("subtotal")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Tax Rate:</span>
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              {...field} 
                              type="number"
                              min="0" 
                              max="100" 
                              step="0.1"
                              className="w-20" 
                              onChange={(e) => {
                                field.onChange(e);
                                calculateTotals();
                              }}
                            />
                            <span className="ml-1">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax Amount:</span>
                  <span className="font-medium">${form.watch("taxAmount")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${form.watch("total")}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
