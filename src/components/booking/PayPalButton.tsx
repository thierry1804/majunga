import { useState, useEffect, useCallback } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  bookingId: string | null;
  onSuccess: (details: { id?: string; transactionID?: string }) => void;
  onError: (error: unknown) => void;
  isDisabled?: boolean;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

function MockPayPalButton({
  amount,
  currency,
  onSuccess,
  onError,
  isDisabled = false,
}: Omit<PayPalButtonProps, 'bookingId'>) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (isDisabled) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (Math.random() > 0.1) {
        onSuccess({ id: `MOCK-PAY-${Date.now()}`, transactionID: `MOCK-${Date.now()}` });
      } else {
        onError({ message: 'Le traitement du paiement a échoué.' });
      }
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isDisabled || loading}
      className={`flex items-center justify-center w-full rounded px-4 py-3 font-bold text-white transition-colors ${
        isDisabled ? 'bg-gray-400 cursor-not-allowed' : loading ? 'bg-blue-400 cursor-wait' : 'bg-[#0070BA] hover:bg-[#003087]'
      }`}
    >
      {loading ? 'Traitement...' : (
        <>
          <span className="mr-2">Payer {amount} {currency} avec</span>
          <span className="font-bold">Pay<span className="text-[#27346A]">Pal</span></span>
          <span className="ml-2 text-xs opacity-75">(sandbox mock)</span>
        </>
      )}
    </button>
  );
}

export default function PayPalButton({
  amount,
  currency,
  bookingId,
  onSuccess,
  onError,
  isDisabled = false,
}: PayPalButtonProps) {
  const handleApprove = useCallback(async (data: { orderID: string }) => {
    if (!bookingId) {
      onError({ message: 'Réservation non initialisée' });
      return;
    }

    try {
      const { capturePayPalOrder } = await import('../../api/madabookingApi');
      const result = await capturePayPalOrder(data.orderID, bookingId);
      onSuccess({ id: result.capture.captureId, transactionID: data.orderID });
    } catch (error) {
      onError(error);
    }
  }, [bookingId, onSuccess, onError]);

  if (!PAYPAL_CLIENT_ID || !bookingId) {
    return (
      <MockPayPalButton
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        isDisabled={isDisabled}
      />
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency, intent: 'capture' }}>
      <PayPalButtons
        disabled={isDisabled}
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
        createOrder={async () => {
          const { createPayPalOrder } = await import('../../api/madabookingApi');
          const order = await createPayPalOrder(bookingId, amount, currency);
          return order.orderId;
        }}
        onApprove={async (data) => {
          await handleApprove(data);
        }}
        onError={(err) => onError(err)}
      />
    </PayPalScriptProvider>
  );
}
