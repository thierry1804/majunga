import { useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  isDisabled?: boolean;
}

// This is a mock PayPal button integration
// In a real project, we would integrate with PayPal's official SDK
export default function PayPalButton({ 
  amount, 
  currency, 
  onSuccess, 
  onError,
  isDisabled = false 
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async () => {
    if (isDisabled) return;
    
    setLoading(true);
    
    // Simulate a payment process
    setTimeout(() => {
      setLoading(false);
      
      // Random success (90% chance) or failure
      if (Math.random() > 0.1) {
        onSuccess({
          id: `PAY-${Date.now().toString().substring(5)}`,
          status: 'COMPLETED',
          payer: {
            email_address: 'customer@example.com'
          },
          purchase_units: [
            {
              amount: {
                value: amount,
                currency_code: currency
              }
            }
          ],
          create_time: new Date().toISOString()
        });
      } else {
        onError({
          message: 'Le traitement du paiement a échoué. Veuillez réessayer.'
        });
      }
    }, 2000);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isDisabled || loading}
      className={`flex items-center justify-center w-full rounded px-4 py-3 font-bold text-white transition-colors ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : loading
            ? 'bg-blue-400 cursor-wait'
            : 'bg-[#0070BA] hover:bg-[#003087]'
      }`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement en cours...
        </span>
      ) : (
        <>
            <span className="mr-2">Payer avec</span>
          <span className="font-bold">Pay<span className="text-[#27346A]">Pal</span></span>
        </>
      )}
    </button>
  );
}