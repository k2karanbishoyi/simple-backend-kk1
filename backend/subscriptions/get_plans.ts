import { api } from "encore.dev/api";

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  credits: number;
  features: string[];
  stripePriceId: string;
  popular: boolean;
}

export interface GetPlansResponse {
  plans: Plan[];
}

// Gets available subscription plans.
export const getPlans = api<void, GetPlansResponse>(
  { expose: true, method: "GET", path: "/subscriptions/plans" },
  async () => {
    const plans: Plan[] = [
      {
        id: "free",
        name: "Free",
        price: 0,
        period: "one-time",
        credits: 5,
        features: [
          "5 background removals",
          "High-quality results",
          "JPEG, PNG, WebP support",
          "Basic download options"
        ],
        stripePriceId: "",
        popular: false
      },
      {
        id: "pro-monthly",
        name: "Pro Monthly",
        price: 9.99,
        period: "per month",
        credits: 500,
        features: [
          "500 background removals/month",
          "High-quality results",
          "All file formats",
          "Priority processing",
          "Advanced download options",
          "Email support"
        ],
        stripePriceId: "price_monthly_demo", // Replace with actual Stripe price ID
        popular: true
      },
      {
        id: "pro-annual",
        name: "Pro Annual",
        price: 99.99,
        period: "per year",
        credits: 6000,
        features: [
          "6000 background removals/year",
          "2 months free",
          "High-quality results",
          "All file formats",
          "Priority processing",
          "Advanced download options",
          "Priority email support"
        ],
        stripePriceId: "price_annual_demo", // Replace with actual Stripe price ID
        popular: false
      }
    ];

    return { plans };
  }
);
