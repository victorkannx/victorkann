import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

const CAL_BASE = "https://cal.com/kanayo/15";

type BookingContextValue = { openLeadForm: (source?: string) => void };
const BookingContext = createContext<BookingContextValue>({ openLeadForm: () => {} });

export function useLeadForm() {
  return useContext(BookingContext);
}

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const openLeadForm = useCallback((source?: string) => {
    const url = new URL(CAL_BASE);
    url.searchParams.set("utm_source", "victorkann.com");
    url.searchParams.set("utm_campaign", "book-a-call");
    if (source) url.searchParams.set("a1", source);
    window.location.assign(url.toString());
  }, []);

  const value = useMemo(() => ({ openLeadForm }), [openLeadForm]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
