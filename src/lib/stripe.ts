import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(publishableKey, {
      // Add any Stripe options here
    });
  }
  
  return stripePromise;
};
