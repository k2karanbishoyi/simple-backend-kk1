import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("users");

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  credits: number;
  token: string;
}

// Authenticates a user and returns a session token.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    console.log('Login request received:', { email: req.email });

    // Validate input
    if (!req.email || !req.password) {
      console.log('Missing email or password');
      throw APIError.invalidArgument("Email and password are required");
    }

    try {
      const user = await db.queryRow<{
        id: string;
        email: string;
        credits: number;
        password_hash: string;
      }>`
        SELECT id, email, credits, password_hash 
        FROM users 
        WHERE email = ${req.email}
      `;

      if (!user) {
        console.log('User not found:', req.email);
        throw APIError.unauthenticated("Invalid email or password");
      }

      if (user.password_hash !== req.password) {
        console.log('Invalid password for user:', req.email);
        throw APIError.unauthenticated("Invalid email or password");
      }

      // Generate a simple token (in production, use proper JWT)
      const token = `token_${user.id}_${Date.now()}`;

      console.log('Login successful:', { id: user.id, email: user.email, credits: user.credits });

      return {
        id: user.id,
        email: user.email,
        credits: user.credits,
        token
      };
    } catch (error) {
      console.error('Database error during login:', error);
      
      // Re-throw APIErrors as-is
      if (error instanceof Error && error.message.includes('APIError')) {
        throw error;
      }
      
      throw APIError.internal("Login failed");
    }
  }
);
