// Re-export React Query hooks for backward compatibility
export {
  useInvoicesQuery as useInvoices,
  useInvoiceQuery,
  // useCreateInvoiceMutation,
  // useUpdateInvoiceMutation,
  // useMarkInvoiceAsPaidMutation,
  // useDeleteInvoiceMutation,
  // useInvoiceTemplatesQuery,
  // useCreateTemplateMutation
} from "@/hooks/queries/use-invoices-query";
