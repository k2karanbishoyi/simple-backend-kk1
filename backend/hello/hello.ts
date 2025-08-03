import { api } from "encore.dev/api";

interface HelloResponse {
  message: string;
}

// Returns a simple hello message.
export const hello = api<void, HelloResponse>(
  { expose: true, method: "GET", path: "/hello" },
  async () => {
    return { message: "Hello, World!" };
  }
);
