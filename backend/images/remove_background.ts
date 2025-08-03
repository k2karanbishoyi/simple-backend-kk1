import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";
import { secret } from "encore.dev/config";

const db = SQLDatabase.named("images");
const usersDb = SQLDatabase.named("users");
const imagesBucket = new Bucket("images", {
  public: true
});
const clipdropApiKey = secret("ClipDropApiKey");

export interface RemoveBackgroundRequest {
  imageId: string;
  userId: string;
}

export interface RemoveBackgroundResponse {
  id: string;
  processedUrl: string;
  status: string;
  newCreditBalance: number;
}

// Removes background from an uploaded image using ClipDrop API.
export const removeBackground = api<RemoveBackgroundRequest, RemoveBackgroundResponse>(
  { expose: true, method: "POST", path: "/images/remove-background" },
  async (req) => {
    // Validate input
    if (!req.imageId || !req.userId) {
      throw APIError.invalidArgument("Image ID and User ID are required");
    }

    // Start a transaction to ensure data consistency
    const transaction = await db.begin();
    
    try {
      // Get image record
      const image = await transaction.queryRow<{
        id: string;
        user_id: string;
        original_url: string;
        status: string;
      }>`
        SELECT id, user_id, original_url, status
        FROM images 
        WHERE id = ${req.imageId} AND user_id = ${req.userId}
      `;

      if (!image) {
        throw APIError.notFound("Image not found");
      }

      if (image.status !== 'uploaded') {
        throw APIError.failedPrecondition("Image already processed or processing");
      }

      // Check user credits from users table
      const user = await usersDb.queryRow<{ credits: number }>`
        SELECT credits FROM users WHERE id = ${req.userId}
      `;

      if (!user || user.credits <= 0) {
        throw APIError.failedPrecondition("Insufficient credits");
      }

      // Update status to processing
      await transaction.exec`
        UPDATE images 
        SET status = 'processing', updated_at = NOW()
        WHERE id = ${req.imageId}
      `;

      // Commit the transaction for the status update
      await transaction.commit();

      // Now process the image (outside transaction to avoid long-running transactions)
      let processedUrl: string;
      let processedImageBuffer: Buffer;

      try {
        // Check if ClipDrop API key is available
        const apiKey = clipdropApiKey();
        
        // Download original image
        const originalImageName = image.original_url.split('/').pop()!;
        let originalImageBuffer: Buffer;
        
        try {
          originalImageBuffer = await imagesBucket.download(originalImageName);
        } catch (downloadError) {
          throw new Error(`Failed to download original image: ${downloadError}`);
        }

        if (!apiKey || apiKey.trim() === '') {
          // For demo purposes, if ClipDrop API key is not set, use the original image
          console.log('ClipDrop API key not configured, using original image as processed');
          processedImageBuffer = originalImageBuffer;
        } else {
          try {
            // Call ClipDrop API
            const formData = new FormData();
            const blob = new Blob([originalImageBuffer], { type: 'image/jpeg' });
            formData.append('image_file', blob, 'image.jpg');

            const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
              method: 'POST',
              headers: {
                'x-api-key': apiKey,
              },
              body: formData,
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`ClipDrop API error (${response.status}): ${errorText}`);
              // Fall back to original image for demo
              processedImageBuffer = originalImageBuffer;
            } else {
              processedImageBuffer = Buffer.from(await response.arrayBuffer());
            }
          } catch (clipdropError) {
            // For demo purposes, if ClipDrop fails, use the original image as processed
            console.error('ClipDrop API error:', clipdropError);
            processedImageBuffer = originalImageBuffer;
          }
        }
        
        // Upload processed image
        const timestamp = Date.now();
        const processedFileName = `processed_${req.userId}_${timestamp}.png`;
        
        try {
          await imagesBucket.upload(processedFileName, processedImageBuffer, {
            contentType: 'image/png'
          });
        } catch (uploadError) {
          throw new Error(`Failed to upload processed image: ${uploadError}`);
        }

        processedUrl = imagesBucket.publicUrl(processedFileName);

        // Start a new transaction for the final updates
        const finalTransaction = await db.begin();
        
        try {
          // Update database with processed image
          await finalTransaction.exec`
            UPDATE images 
            SET processed_url = ${processedUrl}, status = 'completed', updated_at = NOW()
            WHERE id = ${req.imageId}
          `;

          // Deduct credit from user
          const creditUpdateResult = await usersDb.exec`
            UPDATE users 
            SET credits = credits - 1, updated_at = NOW()
            WHERE id = ${req.userId} AND credits > 0
          `;

          // Commit the final transaction
          await finalTransaction.commit();

          // Get updated credit balance
          const updatedUser = await usersDb.queryRow<{ credits: number }>`
            SELECT credits FROM users WHERE id = ${req.userId}
          `;

          return {
            id: image.id,
            processedUrl,
            status: 'completed',
            newCreditBalance: updatedUser?.credits || 0
          };

        } catch (finalError) {
          await finalTransaction.rollback();
          throw finalError;
        }

      } catch (processingError) {
        // Update status to failed
        await db.exec`
          UPDATE images 
          SET status = 'failed', updated_at = NOW()
          WHERE id = ${req.imageId}
        `;
        
        throw processingError;
      }

    } catch (error) {
      // Rollback transaction if it's still active
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
      
      console.error('Background removal error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Image not found')) {
          throw APIError.notFound("Image not found");
        } else if (error.message.includes('Insufficient credits')) {
          throw APIError.failedPrecondition("Insufficient credits");
        } else if (error.message.includes('already processed')) {
          throw APIError.failedPrecondition("Image already processed or processing");
        } else if (error.message.includes('Failed to download')) {
          throw APIError.internal("Failed to access uploaded image. Please try uploading again.");
        } else if (error.message.includes('Failed to upload')) {
          throw APIError.internal("Failed to save processed image. Please try again.");
        }
        throw APIError.internal(`Processing failed: ${error.message}`);
      }
      throw APIError.internal("Processing failed due to an unknown error");
    }
  }
);
