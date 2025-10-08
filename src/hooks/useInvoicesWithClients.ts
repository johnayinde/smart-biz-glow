import { useQuery } from "@tanstack/react-query";
import { invoiceService, InvoiceFilters } from "@/services/invoiceService";
import { clientService } from "@/services/clientService";

export function useInvoicesWithClients(filters?: InvoiceFilters) {
  const { search, ...invoiceFilters } = filters || {};
  const {
    data: invoicesQuery,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => invoiceService.getInvoices(filters),
  });

  // Fetch clients
  const clientsQuery = useQuery({
    queryKey: ["clients", "all"],
    queryFn: () => clientService.getClients({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  // Merge data
  let invoicesWithClients = (invoicesQuery?.data || []).map((invoice) => {
    const client = (clientsQuery.data?.data || []).find(
      (c) => c.id === invoice.clientId
    );
    return {
      ...invoice,
      client: client || null,
    };
  });

  // Filter by search on frontend (includes client name)
  // if (search) {
  //   const searchLower = search.toLowerCase();
  //   invoicesWithClients = invoicesWithClients.filter((invoice) => {
  //     return (
  //       invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
  //       invoice.client?.name?.toLowerCase().includes(searchLower) ||
  //       invoice.client?.email?.toLowerCase().includes(searchLower) ||
  //       invoice.client?.company?.toLowerCase().includes(searchLower) ||
  //       invoice.notes?.toLowerCase().includes(searchLower)
  //     );
  //   });
  // }

  return {
    invoices: invoicesWithClients || [],
    isLoading: isLoading || clientsQuery.isLoading,
    error: error || clientsQuery.error,
    meta: invoicesQuery?.meta,
    refetch,
  };
}
