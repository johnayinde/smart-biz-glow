import { apiService } from "./api";

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  paymentTerms?: string;
  status: "active" | "inactive";
  billingStats: {
    totalInvoiced: number;
    totalPaid: number;
    pendingAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  paymentTerms?: string;
}

class ClientService {
  async getClients(): Promise<{ data: Client[] | null; error: string | null }> {
    return apiService.get<Client[]>("/client/clients");
  }

  async getClient(
    id: string
  ): Promise<{ data: Client | null; error: string | null }> {
    return apiService.get<Client>(`/client/clients/${id}`);
  }

  async createClient(
    data: CreateClientData
  ): Promise<{ data: Client | null; error: string | null }> {
    return apiService.post<Client>("/client/clients", data);
  }

  async updateClient(
    id: string,
    data: Partial<CreateClientData>
  ): Promise<{ data: Client | null; error: string | null }> {
    return apiService.patch<Client>(`/client/clients/${id}`, data);
  }

  async deleteClient(id: string): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/client/clients/${id}`);
  }
}

export const clientService = new ClientService();
