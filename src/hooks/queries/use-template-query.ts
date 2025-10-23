// src/hooks/queries/use-template-query.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  templateService,
  Template,
  TemplateFilters,
  CreateTemplateDto,
  UpdateTemplateDto,
} from "@/services/templateService";
import { useToast } from "@/hooks/use-toast";

/**
 * Fetch all templates (user + system)
 */
export function useTemplates(filters?: TemplateFilters) {
  return useQuery({
    queryKey: ["templates", filters],
    queryFn: () => templateService.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single template by ID
 */
export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: () => {
      if (!id) throw new Error("Template ID is required");
      return templateService.getTemplateById(id);
    },
    enabled: !!id,
  });
}

/**
 * Fetch system templates only
 */
export function useSystemTemplates() {
  return useQuery({
    queryKey: ["templates", "system"],
    queryFn: () => templateService.getSystemTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes (system templates rarely change)
  });
}

/**
 * Fetch user templates only
 */
export function useUserTemplates(
  filters?: Omit<TemplateFilters, "isSystemTemplate">
) {
  return useQuery({
    queryKey: ["templates", "user", filters],
    queryFn: () => templateService.getUserTemplates(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Create a new template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTemplateDto) =>
      templateService.createTemplate(data),
    onSuccess: (newTemplate) => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: ["templates"] });

      toast({
        title: "Template created",
        description: `Template "${newTemplate.data.name}" has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Update a template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateDto }) =>
      templateService.updateTemplate(id, data),
    onSuccess: (updatedTemplate, { id }) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", id] });

      toast({
        title: "Template updated",
        description: `Template "${updatedTemplate.data.name}" has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete a template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => templateService.deleteTemplate(id),
    onSuccess: () => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: ["templates"] });

      toast({
        title: "Template deleted",
        description: "Template has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Duplicate a template
 */
export function useDuplicateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => templateService.duplicateTemplate(id),
    onSuccess: (duplicatedTemplate) => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: ["templates"] });

      toast({
        title: "Template duplicated",
        description: `Template "${duplicatedTemplate.data.name}" has been created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to duplicate template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Set template as default
 */
export function useSetDefaultTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => templateService.setDefaultTemplate(id),
    onSuccess: (template) => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: ["templates"] });

      toast({
        title: "Default template set",
        description: `"${template.data.name}" is now your default template.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to set default template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
