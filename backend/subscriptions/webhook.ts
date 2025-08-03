import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { secret } from "encore.dev/config";

const usersDb = SQLDatabase.named("users");
const stripeWebhookSecret = secret("StripeWebhookSecret");

export interface WebhookRequest {
  body: string;
  signature: string;
}

export interface WebhookResponse {
  received: boolean;
}

// Handles Stripe webhook events for subscription updates.
export const webhook = api<WebhookRequest, WebhookResponse>(
  { expose: true, method: "POST", path: "/subscriptions/webhook" },
  async (req) => {
    const webhookSecret = stripeWebhookSecret();
    if (!webhookSecret) {
      throw APIError.internal("Webhook secret not configured");
    }

    try {
      // In a real implementation, you would verify the webhook signature here
      // For demo purposes, we'll parse the event directly
      const event = JSON.parse(req.body);

      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };

    } catch (error) {
      console.error('Webhook error:', error);
      throw APIError.internal("Webhook processing failed");
    }
  }
);

async function handleCheckoutCompleted(session: any) {
  const userId = session.client_reference_id || session.metadata?.user_id;
  if (!userId) return;

  // Update user subscription status and add credits
  const credits = getCreditsForPrice(session.amount_total);
  
  await usersDb.exec`
    UPDATE users 
    SET subscription_status = 'active', 
        credits = credits + ${credits},
        updated_at = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionUpdated(subscription: any) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  const status = subscription.status === 'active' ? 'active' : 'inactive';
  
  await usersDb.exec`
    UPDATE users 
    SET subscription_status = ${status},
        updated_at = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionDeleted(subscription: any) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  await usersDb.exec`
    UPDATE users 
    SET subscription_status = 'free',
        updated_at = NOW()
    WHERE id = ${userId}
  `;
}

function getCreditsForPrice(amountTotal: number): number {
  // Convert cents to dollars and determine credits
  const dollars = amountTotal / 100;
  
  if (dollars >= 99) {
    return 6000; // Annual plan
  } else if (dollars >= 9) {
    return 500; // Monthly plan
  }
  
  return 0;
}
