import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("users");

export interface GetProfileRequest {
  userId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  credits: number;
  subscriptionStatus: string;
  createdAt: string;
}

// Gets user profile information.
export const getProfile = api<GetProfileRequest, UserProfile>(
  { expose: true, method: "GET", path: "/users/profile/:userId" },
  async (req) => {
    if (!req.userId) {
      throw APIError.invalidArgument("User ID is required");
    }

    const user = await db.queryRow<{
      id: string;
      email: string;
      credits: number;
      subscription_status: string;
      created_at: string;
    }>`
      SELECT id, email, credits, subscription_status, created_at
      FROM users 
      WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      credits: user.credits,
      subscriptionStatus: user.subscription_status,
      createdAt: user.created_at
    };
  }
);
