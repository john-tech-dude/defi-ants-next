import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Define the Stripe error type
type StripeError = Error & {
  statusCode?: number;
  code?: string;
  type?: string;
  requestId?: string;
  raw?: any;
};

// Initialize Stripe with environment variable check
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Stripe with the API version that matches the installed package version
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil', // Matches stripe@18.2.1
});

// Define the expected request body type
interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  crypto_type?: string;
  crypto_amount?: number;
  payment_method_type?: string;
  [key: string]: any; // Allow additional properties
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { 
    amount,
    currency = 'usd',
    crypto_type,
    crypto_amount,
    payment_method_type,
    ...rest
  } = req.body as PaymentIntentRequest;

  try {
    // Validate required fields
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'A valid positive amount is required' 
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount is already in cents from the client
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
        ...(crypto_type && { crypto_type }),
        ...(crypto_amount && { crypto_amount: String(crypto_amount) }),
        ...(payment_method_type && { payment_method_type }),
        // Include any additional metadata from the request
        ...Object.entries(rest).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      },
    });
    
    console.log('Created payment intent:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    const stripeError = error as StripeError;
    const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown error occurred';
    const statusCode = stripeError.statusCode || 500;
    
    // Log detailed error for debugging
    if (stripeError.raw) {
      console.error('Stripe API error details:', {
        code: stripeError.code,
        type: stripeError.type,
        statusCode: stripeError.statusCode,
        requestId: stripeError.requestId,
        raw: stripeError.raw
      });
    }

    res.status(statusCode).json({ 
      error: 'Error creating payment intent',
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: stripeError instanceof Error ? stripeError.stack : undefined 
      })
    });
  }
}
