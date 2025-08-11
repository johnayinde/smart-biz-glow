import { apiService } from './api';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  tax_id?: string;
  notes?: string;
  contact_type?: string;
  payment_terms?: string;
  status: 'active' | 'inactive';
  totalBilled: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  tax_id?: string;
  notes?: string;
  contact_type?: string;
  payment_terms?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateClientData extends Partial<CreateClientData> {}

class ClientService {
  async getClients(): Promise<{ data: Client[] | null; error: string | null }> {
    return apiService.get<Client[]>('/clients');
  }

  async getClient(id: string): Promise<{ data: Client | null; error: string | null }> {
    return apiService.get<Client>(`/clients/${id}`);
  }

  async createClient(clientData: CreateClientData): Promise<{ data: Client | null; error: string | null }> {
    return apiService.post<Client>('/clients', clientData);
  }

  async updateClient(id: string, clientData: UpdateClientData): Promise<{ data: Client | null; error: string | null }> {
    return apiService.put<Client>(`/clients/${id}`, clientData);
  }

  async deleteClient(id: string): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/clients/${id}`);
  }
}

export const clientService = new ClientService();