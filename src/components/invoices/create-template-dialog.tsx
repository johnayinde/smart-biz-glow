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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceTemplate } from "@/services/invoiceService";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(['business', 'freelance', 'service', 'custom']),
  
  // Company Information
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  companyWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  companyTaxId: z.string().optional(),

  // Design Settings
  primaryColor: z.string().min(1, "Primary color is required"),
  secondaryColor: z.string().min(1, "Secondary color is required"),
  fontFamily: z.string().min(1, "Font family is required"),
  fontSize: z.string().min(1, "Font size is required"),
  headerStyle: z.enum(['minimal', 'bold', 'branded']),
  footerText: z.string().optional(),

  // Field Settings
  showLogo: z.boolean(),
  showNotes: z.boolean(),
  showTerms: z.boolean(),
  showTax: z.boolean(),
  showDiscount: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreated: (template: InvoiceTemplate) => void;
}

export const CreateTemplateDialog = ({
  open,
  onOpenChange,
  onTemplateCreated,
}: CreateTemplateDialogProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "custom",
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      companyWebsite: "",
      companyTaxId: "",
      primaryColor: "#1f2937",
      secondaryColor: "#6b7280",
      fontFamily: "Inter",
      fontSize: "14",
      headerStyle: "minimal",
      footerText: "",
      showLogo: true,
      showNotes: true,
      showTerms: true,
      showTax: true,
      showDiscount: false,
    },
  });

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Georgia", label: "Georgia" },
    { value: "Times New Roman", label: "Times New Roman" },
  ];

  const onSubmit = (values: TemplateFormValues) => {
    const newTemplate: InvoiceTemplate = {
      id: `template-${Date.now()}`,
      name: values.name,
      description: values.description,
      category: values.category,
      isDefault: false,
      isCustom: true,
      previewImage: "https://placehold.co/300x200/e2e8f0/64748b?text=Custom&font=open-sans",
      companyInfo: {
        name: values.companyName,
        address: values.companyAddress,
        phone: values.companyPhone,
        email: values.companyEmail,
        website: values.companyWebsite,
        taxId: values.companyTaxId,
      },
      design: {
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        fontFamily: values.fontFamily,
        fontSize: values.fontSize,
        headerStyle: values.headerStyle,
        footerText: values.footerText,
      },
      fields: {
        showLogo: values.showLogo,
        showNotes: values.showNotes,
        showTerms: values.showTerms,
        showTax: values.showTax,
        showDiscount: values.showDiscount,
        customFields: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onTemplateCreated(newTemplate);
    form.reset();
    onOpenChange(false);
  };

  // Preview Component
  const TemplatePreview = () => {
    const values = form.watch();
    
    return (
      <div className="border rounded-lg p-4 bg-white" style={{ 
        fontFamily: values.fontFamily,
        fontSize: `${values.fontSize}px`,
        color: values.secondaryColor 
      }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 style={{ 
              color: values.primaryColor,
              fontSize: values.headerStyle === 'bold' ? '24px' : '20px',
              fontWeight: values.headerStyle === 'bold' ? 'bold' : 'normal'
            }}>
              {values.companyName || "Company Name"}
            </h3>
            {values.companyAddress && <p className="text-sm">{values.companyAddress}</p>}
            {values.companyPhone && <p className="text-sm">{values.companyPhone}</p>}
            {values.companyEmail && <p className="text-sm">{values.companyEmail}</p>}
          </div>
          <div className="text-right">
            <h4 style={{ color: values.primaryColor, fontWeight: 'bold' }}>INVOICE</h4>
            <p className="text-sm">#INV-001</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: `${values.primaryColor}20` }}>
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2">Qty</th>
                <th className="text-right p-2">Rate</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Sample Service</td>
                <td className="p-2 text-right">1</td>
                <td className="p-2 text-right">$100.00</td>
                <td className="p-2 text-right">$100.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-4">
          <div className="w-48">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$100.00</span>
            </div>
            {values.showTax && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>$10.00</span>
              </div>
            )}
            {values.showDiscount && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-$5.00</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t" style={{ color: values.primaryColor }}>
              <span>Total:</span>
              <span>${values.showDiscount ? '105.00' : (values.showTax ? '110.00' : '100.00')}</span>
            </div>
          </div>
        </div>
        
        {values.footerText && (
          <div className="mt-4 pt-4 border-t text-xs text-center">
            {values.footerText}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Invoice Template</DialogTitle>
          <DialogDescription>
            Design a custom invoice template with your company branding and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., My Business Template" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe when to use this template..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="freelance">Freelance</SelectItem>
                              <SelectItem value="service">Service</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="company" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="123 Business Street, City, State 12345" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyTaxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID</FormLabel>
                            <FormControl>
                              <Input placeholder="12-3456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input type="color" className="w-16 h-10" {...field} />
                                <Input 
                                  placeholder="#1f2937"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input type="color" className="w-16 h-10" {...field} />
                                <Input 
                                  placeholder="#6b7280"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fontOptions.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
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
                        name="fontSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Size (px)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="12">12px</SelectItem>
                                <SelectItem value="14">14px</SelectItem>
                                <SelectItem value="16">16px</SelectItem>
                                <SelectItem value="18">18px</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="headerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Header Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select header style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="branded">Branded</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="footerText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Text</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Thank you for your business!"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="fields" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">Invoice Fields</h4>
                      
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="showLogo"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Show Logo</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showNotes"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Show Notes Section</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showTerms"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Show Terms & Conditions</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showTax"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Show Tax Field</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showDiscount"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Show Discount Field</FormLabel>
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
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Template</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Live Preview
                  <Badge variant="outline">Real-time</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemplatePreview />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};