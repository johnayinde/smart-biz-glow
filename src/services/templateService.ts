// src/services/templateService.ts
// import { apiService } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { apiService } from "./api";

// Types
export interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  background: string;
  border: string;
}

export interface Typography {
  heading: string;
  body: string;
  size: {
    heading: number;
    subheading: number;
    body: number;
    small: number;
  };
}

export interface LogoConfig {
  url?: string;
  position: "left" | "center" | "right";
  size: string;
  enabled: boolean;
}

export interface Section {
  enabled: boolean;
  fields: string[];
  order: number;
  label?: string;
}

export interface DesignConfig {
  colors: ColorScheme;
  typography: Typography;
  logo: LogoConfig;
  layout: {
    pageSize: string;
    // pageSize: "A4" | "Letter";
    // orientation: "portrait" | "landscape";
    orientation: string;
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  sections: {
    header: Section;
    billTo: Section;
    items: Section;
    summary: Section;
    footer: Section;
    notes: Section;
  };
  spacing: {
    lineHeight: number;
    sectionGap: number;
    itemGap: number;
  };
  borders: {
    enabled: boolean;
    width: number;
    // style: "solid" | "dashed" | "dotted";
    style: string;
    color: string;
  };
}

export interface TemplateDefaults {
  paymentTerms?: string;
  notes?: string;
  terms?: string;
}

export interface Template {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isSystemTemplate: boolean;
  design: DesignConfig;
  defaults: TemplateDefaults;
  lastUsedAt?: string;
  usageCount: number;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  isDefault?: boolean;
  design: DesignConfig;
  defaults?: TemplateDefaults;
  tags?: string[];
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface TemplateFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  isSystemTemplate?: boolean;
  sortBy?: "name" | "createdAt" | "usageCount" | "lastUsedAt";
  sortOrder?: "asc" | "desc";
}

export interface TemplateResponse {
  templates: Template[];
  total: number;
  page: number;
  totalPages: number;
}

class TemplateService {
  /**
   * Get all templates (user + system)
   */
  async getTemplates(filters?: TemplateFilters) {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.search) params.append("search", filters.search);
      if (filters?.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append("tags", tag));
      }
      if (filters?.isSystemTemplate !== undefined) {
        params.append("isSystemTemplate", filters.isSystemTemplate.toString());
      }
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.TEMPLATES.LIST}?${queryString}`
        : API_ENDPOINTS.TEMPLATES.LIST;
      console.log("Fetching templates with URL:", url);
      return await apiService.get<Template[]>(url);
      // return response.data;
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string) {
    try {
      return await apiService.get<Template>(API_ENDPOINTS.TEMPLATES.GET(id));
      // return response.data;
    } catch (error: any) {
      console.error("Error fetching template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch template"
      );
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(data: CreateTemplateDto) {
    try {
      return await apiService.post<Template>(
        API_ENDPOINTS.TEMPLATES.CREATE,
        data
      );
      // return response.data;
    } catch (error: any) {
      console.error("Error creating template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create template"
      );
    }
  }

  /**
   * Update a template
   */
  async updateTemplate(id: string, data: UpdateTemplateDto) {
    try {
      return await apiService.patch<Template>(
        API_ENDPOINTS.TEMPLATES.UPDATE(id),
        data
      );
    } catch (error: any) {
      console.error("Error updating template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update template"
      );
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string) {
    try {
      await apiService.delete(API_ENDPOINTS.TEMPLATES.DELETE(id));
    } catch (error: any) {
      console.error("Error deleting template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete template"
      );
    }
  }

  /**
   * Duplicate a template
   */
  async duplicateTemplate(id: string) {
    try {
      return apiService.post<Template>(API_ENDPOINTS.TEMPLATES.DUPLICATE(id));
    } catch (error: any) {
      console.error("Error duplicating template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to duplicate template"
      );
    }
  }

  /**
   * Set template as default
   */
  async setDefaultTemplate(id: string) {
    try {
      return await apiService.patch<Template>(
        API_ENDPOINTS.TEMPLATES.SET_DEFAULT(id)
      );
    } catch (error: any) {
      console.error("Error setting default template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to set default template"
      );
    }
  }

  /**
   * Get system templates only
   */
  async getSystemTemplates() {
    try {
      return await this.getTemplates({
        isSystemTemplate: true,
        limit: 100,
      });
    } catch (error: any) {
      console.error("Error fetching system templates:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch system templates"
      );
    }
  }

  /**
   * Get user templates only
   */
  async getUserTemplates(filters?: Omit<TemplateFilters, "isSystemTemplate">) {
    try {
      return await this.getTemplates({
        ...filters,
        isSystemTemplate: false,
      });
    } catch (error: any) {
      console.error("Error fetching user templates:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user templates"
      );
    }
  }
}

export const templateService = new TemplateService();
