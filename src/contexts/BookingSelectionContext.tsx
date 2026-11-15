import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface BookingSelection {
  service: 'tour' | 'shuttle';
  /** Identifiant du circuit ou de la navette, tel qu'utilisé par le formulaire. */
  id: number;
  /** Change à chaque clic, pour que le formulaire réagisse même si on reclique sur le même choix. */
  nonce: number;
}

interface BookingSelectionValue {
  selection: BookingSelection | null;
  /** Présélectionne un circuit ou une navette dans le formulaire, puis y amène le visiteur. */
  selectForBooking: (choice: { service: 'tour' | 'shuttle'; id: number }) => void;
}

const BookingSelectionContext = createContext<BookingSelectionValue>({
  selection: null,
  selectForBooking: () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  },
});

export function BookingSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection | null>(null);

  const selectForBooking = useCallback((choice: { service: 'tour' | 'shuttle'; id: number }) => {
    setSelection({ ...choice, nonce: Date.now() });
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({ selection, selectForBooking }), [selection, selectForBooking]);

  return <BookingSelectionContext.Provider value={value}>{children}</BookingSelectionContext.Provider>;
}

export function useBookingSelection() {
  return useContext(BookingSelectionContext);
}
