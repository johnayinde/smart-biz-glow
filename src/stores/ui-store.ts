import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

interface FiltersState {
  invoiceFilters: {
    status: string;
    dateRange: [Date | null, Date | null];
    clientId: string;
    search: string;
  };
  clientFilters: {
    status: string;
    search: string;
  };
  setInvoiceFilters: (filters: Partial<FiltersState['invoiceFilters']>) => void;
  setClientFilters: (filters: Partial<FiltersState['clientFilters']>) => void;
  resetInvoiceFilters: () => void;
  resetClientFilters: () => void;
}

interface UIState extends SidebarState, FiltersState {
  loading: {
    [key: string]: boolean;
  };
  setLoading: (key: string, loading: boolean) => void;
}

const defaultInvoiceFilters = {
  status: '',
  dateRange: [null, null] as [Date | null, Date | null],
  clientId: '',
  search: '',
};

const defaultClientFilters = {
  status: '',
  search: '',
};

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Sidebar state
      isOpen: true,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      // Filters state
      invoiceFilters: defaultInvoiceFilters,
      clientFilters: defaultClientFilters,
      setInvoiceFilters: (filters) =>
        set((state) => ({
          invoiceFilters: { ...state.invoiceFilters, ...filters },
        })),
      setClientFilters: (filters) =>
        set((state) => ({
          clientFilters: { ...state.clientFilters, ...filters },
        })),
      resetInvoiceFilters: () => set({ invoiceFilters: defaultInvoiceFilters }),
      resetClientFilters: () => set({ clientFilters: defaultClientFilters }),

      // Loading state
      loading: {},
      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),
    }),
    { name: 'ui-store' }
  )
);