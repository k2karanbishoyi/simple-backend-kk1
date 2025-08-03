import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("users", {
  migrations: "./migrations",
});

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  credits: number;
  token: string;
}

// Registers a new user account.
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    console.log('Register request received:', { email: req.email });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.email)) {
      console.log('Invalid email format:', req.email);
      throw APIError.invalidArgument("Invalid email format");
    }

    // Validate password length
    if (req.password.length < 6) {
      console.log('Password too short');
      throw APIError.invalidArgument("Password must be at least 6 characters long");
    }

    try {
      // Check if user already exists
      const existingUser = await db.queryRow`
        SELECT id FROM users WHERE email = ${req.email}
      `;
      
      if (existingUser) {
        console.log('User already exists:', req.email);
        throw APIError.alreadyExists("User with this email already exists");
      }

      // Create new user with 5 free credits
      const user = await db.queryRow<{
        id: string;
        email: string;
        credits: number;
      }>`
        INSERT INTO users (email, password_hash, credits)
        VALUES (${req.email}, ${req.password}, 5)
        RETURNING id, email, credits
      `;

      if (!user) {
        console.log('Failed to create user in database');
        throw APIError.internal("Failed to create user");
      }

      // Generate a simple token (in production, use proper JWT)
      const token = `token_${user.id}_${Date.now()}`;

      console.log('User created successfully:', { id: user.id, email: user.email, credits: user.credits });

      return {
        id: user.id,
        email: user.email,
        credits: user.credits,
        token
      };
    } catch (error) {
      console.error('Database error during registration:', error);
      
      // Re-throw APIErrors as-is
      if (error instanceof Error && error.message.includes('APIError')) {
        throw error;
      }
      
      // Handle database constraint violations
      if (error instanceof Error && error.message.includes('unique constraint')) {
        throw APIError.alreadyExists("User with this email already exists");
      }
      
      throw APIError.internal("Failed to create user account");
    }
  }
);
