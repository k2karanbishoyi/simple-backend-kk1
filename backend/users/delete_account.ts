import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";

const usersDb = SQLDatabase.named("users");
const imagesDb = SQLDatabase.named("images");
const imagesBucket = new Bucket("images", {
  public: true
});

export interface DeleteAccountRequest {
  userId: string;
  password: string;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

// Deletes a user account and all associated data.
export const deleteAccount = api<DeleteAccountRequest, DeleteAccountResponse>(
  { expose: true, method: "DELETE", path: "/users/delete-account" },
  async (req) => {
    if (!req.userId || !req.password) {
      throw APIError.invalidArgument("User ID and password are required");
    }

    // Verify user exists and password is correct
    const user = await usersDb.queryRow<{
      id: string;
      password_hash: string;
    }>`
      SELECT id, password_hash 
      FROM users 
      WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    if (user.password_hash !== req.password) {
      throw APIError.unauthenticated("Invalid password");
    }

    const transaction = await usersDb.begin();
    
    try {
      // Get all user images to delete from storage
      const userImages = await imagesDb.queryAll<{
        original_url: string;
        processed_url: string | null;
      }>`
        SELECT original_url, processed_url
        FROM images 
        WHERE user_id = ${req.userId}
      `;

      // Delete images from storage
      for (const image of userImages) {
        try {
          const originalFileName = image.original_url.split('/').pop();
          if (originalFileName) {
            await imagesBucket.remove(originalFileName);
          }
        } catch (error) {
          console.error('Error deleting original image:', error);
        }

        if (image.processed_url) {
          try {
            const processedFileName = image.processed_url.split('/').pop();
            if (processedFileName) {
              await imagesBucket.remove(processedFileName);
            }
          } catch (error) {
            console.error('Error deleting processed image:', error);
          }
        }
      }

      // Delete user images from database
      await imagesDb.exec`
        DELETE FROM images WHERE user_id = ${req.userId}
      `;

      // Delete user account
      await transaction.exec`
        DELETE FROM users WHERE id = ${req.userId}
      `;

      await transaction.commit();

      return {
        success: true,
        message: "Account deleted successfully"
      };

    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting account:', error);
      throw APIError.internal("Failed to delete account. Please try again.");
    }
  }
);
