// src/services/clientService.ts
import { apiService } from "./api";

// ===== Types matching backend schema =====
export interface Client {
  _id: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
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
}

export interface UpdateClientData extends Partial<CreateClientData> {
  isActive?: boolean;
}

export interface ClientsListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class ClientService {
  async getClients(filters?: ClientFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/client${queryString ? `?${queryString}` : ""}`;

    return apiService.get<ClientsListResponse>(url);
  }

  async getClientById(id: string) {
    return apiService.get<Client>(`/client/${id}`);
  }

  async createClient(data: CreateClientData) {
    return apiService.post<Client>("/client", data);
  }

  async updateClient(id: string, data: UpdateClientData) {
    return apiService.patch<Client>(`/client/${id}`, data);
  }

  async deleteClient(id: string) {
    return apiService.delete(`/client/${id}`);
  }

  async archiveClient(id: string) {
    return apiService.patch<Client>(`/client/${id}`, { isActive: false });
  }

  async restoreClient(id: string) {
    return apiService.patch<Client>(`/client/${id}`, { isActive: true });
  }

  async searchClients(searchTerm: string) {
    return this.getClients({ search: searchTerm, limit: 10 });
  }
}

export const clientService = new ClientService();
