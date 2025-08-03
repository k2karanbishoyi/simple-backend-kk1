import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("images");

export interface ListImagesRequest {
  userId: string;
}

export interface ImageItem {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: string;
  createdAt: string;
}

export interface ListImagesResponse {
  images: ImageItem[];
}

// Lists all images for a user.
export const list = api<ListImagesRequest, ListImagesResponse>(
  { expose: true, method: "GET", path: "/images/list/:userId" },
  async (req) => {
    if (!req.userId) {
      throw APIError.invalidArgument("User ID is required");
    }

    try {
      const images = await db.queryAll<{
        id: string;
        original_url: string;
        processed_url: string | null;
        status: string;
        created_at: string;
      }>`
        SELECT id, original_url, processed_url, status, created_at
        FROM images 
        WHERE user_id = ${req.userId}
        ORDER BY created_at DESC
      `;

      return {
        images: images.map(img => ({
          id: img.id,
          originalUrl: img.original_url,
          processedUrl: img.processed_url || undefined,
          status: img.status,
          createdAt: img.created_at
        }))
      };
    } catch (error) {
      throw APIError.internal("Failed to fetch images");
    }
  }
);
