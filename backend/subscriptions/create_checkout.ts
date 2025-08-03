import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

const stripeSecretKey = secret("StripeSecretKey");

export interface CreateCheckoutRequest {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
}

// Creates a Stripe checkout session for subscription.
export const createCheckout = api<CreateCheckoutRequest, CreateCheckoutResponse>(
  { expose: true, method: "POST", path: "/subscriptions/create-checkout" },
  async (req) => {
    if (!req.userId || !req.priceId) {
      throw APIError.invalidArgument("User ID and price ID are required");
    }

    const apiKey = stripeSecretKey();
    if (!apiKey) {
      throw APIError.internal("Payment system not configured");
    }

    try {
      // Create Stripe checkout session
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'subscription',
          'line_items[0][price]': req.priceId,
          'line_items[0][quantity]': '1',
          'success_url': req.successUrl,
          'cancel_url': req.cancelUrl,
          'client_reference_id': req.userId,
          'metadata[user_id]': req.userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stripe API error: ${errorText}`);
      }

      const session = await response.json();

      return {
        checkoutUrl: session.url
      };

    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw APIError.internal("Failed to create checkout session");
    }
  }
);
