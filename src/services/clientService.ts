import { apiService } from "./api";
import { BulkDeleteResponse, BulkUpdateResponse } from "./invoiceService";

export interface Client {
  _id: string;
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  company?: string;
  taxId?: string;
  notes?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  company?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: "active" | "inactive";
}

export interface ClientsListResponse {
  success: boolean;
  data: Client[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class ClientService {
  // ✅ FIXED: Handle full response structure
  async getClients(filters?: ClientFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status !== undefined)
      params.append("status", filters.status.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/clients${queryString ? `?${queryString}` : ""}`;

    // ✅ Returns { success, data: Client[], meta }
    return apiService.get<Client[]>(url);
  }

  async getClientById(id: string) {
    // ✅ Returns { success, data: Client }
    return apiService.get<Client>(`/clients/${id}`);
  }

  async createClient(data: CreateClientData) {
    return apiService.post<Client>("/clients", data);
  }

  async updateClient(id: string, data: UpdateClientData) {
    console.log("Updating client:", id, data);

    return apiService.patch<Client>(`/clients/${id}`, data);
  }

  async deleteClient(id: string) {
    return apiService.delete(`/clients/${id}`);
  }

  async archiveClient(id: string) {
    return apiService.patch<Client>(`/clients/${id}`, { status: "inactive" });
  }

  async restoreClient(id: string) {
    return apiService.patch<Client>(`/clients/${id}`, { status: "active" });
  }

  async searchClients(searchTerm: string) {
    return this.getClients({ search: searchTerm, limit: 10 });
  }

  async bulkDelete(ids: string[]): Promise<BulkDeleteResponse> {
    const response = await apiService.post<BulkDeleteResponse>(
      "/clients/bulk/delete",
      { ids }
    );
    return response.data;
  }

  async bulkArchive(ids: string[]): Promise<BulkUpdateResponse> {
    const response = await apiService.post<BulkUpdateResponse>(
      "/clients/bulk/archive",
      { ids }
    );
    return response.data;
  }

  async bulkRestore(ids: string[]): Promise<BulkUpdateResponse> {
    const response = await apiService.post<BulkUpdateResponse>(
      "/clients/bulk/restore",
      { ids }
    );
    return response.data;
  }
}

export const clientService = new ClientService();
