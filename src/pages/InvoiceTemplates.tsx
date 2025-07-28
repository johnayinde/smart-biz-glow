import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Copy, Trash, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { CreateTemplateDialog } from "@/components/invoices/create-template-dialog";
import { toast } from "@/hooks/use-toast";

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'freelance' | 'service' | 'custom';
  isDefault: boolean;
  isCustom: boolean;
  previewImage: string;
  companyInfo: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    taxId?: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
    headerStyle: 'minimal' | 'bold' | 'branded';
    footerText?: string;
  };
  fields: {
    showLogo: boolean;
    showNotes: boolean;
    showTerms: boolean;
    showTax: boolean;
    showDiscount: boolean;
    customFields: Array<{
      name: string;
      label: string;
      type: 'text' | 'number' | 'date';
      required: boolean;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const mockTemplates: InvoiceTemplate[] = [
  {
    id: "standard",
    name: "Standard Business",
    description: "Classic business invoice with essential details",
    category: "business",
    isDefault: true,
    isCustom: false,
    previewImage: "https://placehold.co/300x200/e2e8f0/64748b?text=Standard&font=open-sans",
    companyInfo: {
      name: "Your Company Name",
      address: "123 Business Street, City, State 12345",
      phone: "(555) 123-4567",
      email: "contact@company.com",
    },
    design: {
      primaryColor: "#1f2937",
      secondaryColor: "#6b7280",
      fontFamily: "Inter",
      fontSize: "14",
      headerStyle: "minimal",
    },
    fields: {
      showLogo: true,
      showNotes: true,
      showTerms: true,
      showTax: true,
      showDiscount: false,
      customFields: [],
    },
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: "modern",
    name: "Modern Corporate",
    description: "Contemporary design with improved readability",
    category: "business",
    isDefault: true,
    isCustom: false,
    previewImage: "https://placehold.co/300x200/f1f5f9/475569?text=Modern&font=open-sans",
    companyInfo: {
      name: "Your Company Name",
      address: "123 Business Street, City, State 12345",
      phone: "(555) 123-4567",
      email: "contact@company.com",
    },
    design: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      fontFamily: "Inter",
      fontSize: "14",
      headerStyle: "bold",
    },
    fields: {
      showLogo: true,
      showNotes: true,
      showTerms: true,
      showTax: true,
      showDiscount: true,
      customFields: [],
    },
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: "freelance",
    name: "Freelancer Pro",
    description: "Perfect for freelancers and consultants",
    category: "freelance",
    isDefault: true,
    isCustom: false,
    previewImage: "https://placehold.co/300x200/f8fafc/334155?text=Freelance&font=open-sans",
    companyInfo: {
      name: "Your Name",
      address: "Your Address",
      phone: "Your Phone",
      email: "your@email.com",
    },
    design: {
      primaryColor: "#10b981",
      secondaryColor: "#6b7280",
      fontFamily: "Inter",
      fontSize: "14",
      headerStyle: "minimal",
    },
    fields: {
      showLogo: false,
      showNotes: true,
      showTerms: true,
      showTax: false,
      showDiscount: false,
      customFields: [
        {
          name: "projectName",
          label: "Project Name",
          type: "text",
          required: true,
        },
      ],
    },
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
];

const InvoiceTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(mockTemplates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditTemplate = (templateId: string) => {
    const templateToEdit = templates.find(t => t.id === templateId);
    if (templateToEdit) {
      // For now, we'll open create dialog with the template data
      // In a real app, this would be a separate edit dialog
      setIsCreateDialogOpen(true);
      toast({
        title: "Edit Template",
        description: `Opening editor for ${templateToEdit.name}. Editing functionality will be available soon.`,
      });
    }
  };

  const handleDuplicateTemplate = (template: InvoiceTemplate) => {
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'freelance': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoice Templates</h2>
          <p className="text-muted-foreground">
            Create and manage custom invoice templates for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="w-full sm:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {template.isCustom && (
                    <Badge variant="outline" className="text-xs">
                      Custom
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      {!template.isDefault && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState query={searchQuery} onCreateTemplate={handleCreateTemplate} />
      )}

      <CreateTemplateDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onTemplateCreated={(template) => {
          setTemplates([...templates, template]);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
};

const EmptyState = ({ query, onCreateTemplate }: { query: string; onCreateTemplate: () => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>No templates found</CardTitle>
      <CardDescription>
        {query ? `No templates matching "${query}"` : "Create your first custom template to get started"}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-6">
      <FileText className="h-12 w-12 text-muted-foreground/60" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {query ? "Try adjusting your search terms" : "Custom templates help you maintain consistent branding"}
      </p>
      <Button className="mt-4" onClick={onCreateTemplate}>
        <Plus className="mr-2 h-4 w-4" /> Create Template
      </Button>
    </CardContent>
  </Card>
);

export default InvoiceTemplates;