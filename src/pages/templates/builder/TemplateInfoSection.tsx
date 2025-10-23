// src/components/templates/builder/TemplateInfoSection.tsx
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateDefaults } from "@/services/templateService";

interface TemplateInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  defaults?: TemplateDefaults;
  onDefaultsChange: (defaults: TemplateDefaults) => void;
}

export function TemplateInfoSection({
  register,
  errors,
  defaults = {},
  onDefaultsChange,
}: TemplateInfoSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            Basic details about your invoice template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Template Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Modern Professional"
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe when to use this template..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Set as Default</Label>
              <p className="text-sm text-muted-foreground">
                Use this template for new invoices
              </p>
            </div>
            <Switch {...register("isDefault")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          <CardDescription>
            Pre-fill these values in new invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={defaults.paymentTerms || ""}
              onChange={(e) =>
                onDefaultsChange({ ...defaults, paymentTerms: e.target.value })
              }
              placeholder="e.g., Net 30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Default Notes</Label>
            <Textarea
              id="notes"
              value={defaults.notes || ""}
              onChange={(e) =>
                onDefaultsChange({ ...defaults, notes: e.target.value })
              }
              placeholder="Thank you for your business..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={defaults.terms || ""}
              onChange={(e) =>
                onDefaultsChange({ ...defaults, terms: e.target.value })
              }
              placeholder="Payment is due within 30 days..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
