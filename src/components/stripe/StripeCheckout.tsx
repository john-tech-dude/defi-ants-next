'use client';

import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import Button from "@/components/ui/button";
import useToast from '@/components/ui/use-toast';
import { getStripe } from '@/lib/stripe';

const CheckoutForm = () => {
  const [amount, setAmount] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      toast({
        title: 'Error',
        description: 'Stripe.js has not loaded yet. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create a payment intent on your server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          source: 'stripe_checkout',
          fiat_amount: amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      
      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // Confirm the payment on the client
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        toast({
          title: 'Payment failed',
          description: stripeError.message || 'An error occurred',
          variant: 'destructive',
        });
      } else if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment successful!',
          description: 'Your payment was processed successfully.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing your payment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (USD)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 25, 50, 100].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  amount === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
          />
        </div>

        <div className="border border-gray-700 rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

export const StripeCheckout = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Stripe when component mounts
    const loadStripeInstance = async () => {
      try {
        const stripeInstance = await getStripe();
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStripeInstance();
  }, []);

  if (loading) {
    return <div>Loading payment gateway...</div>;
  }

  if (!stripe) {
    return <div>Failed to load payment gateway. Please try again later.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-6">Buy with Credit Card</h2>
      <Elements stripe={stripe}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default StripeCheckout;
