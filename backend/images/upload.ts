import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";

const db = new SQLDatabase("images", {
  migrations: "./migrations",
});

const imagesBucket = new Bucket("images", {
  public: true
});

export interface UploadRequest {
  userId: string;
  fileName: string;
  fileData: string; // base64 encoded
}

export interface UploadResponse {
  id: string;
  originalUrl: string;
  status: string;
}

// Uploads an image for background removal processing.
export const upload = api<UploadRequest, UploadResponse>(
  { expose: true, method: "POST", path: "/images/upload" },
  async (req) => {
    // Validate input
    if (!req.userId || !req.fileName || !req.fileData) {
      throw APIError.invalidArgument("User ID, file name, and file data are required");
    }

    // Validate file size (base64 encoded, so actual size is ~75% of string length)
    const estimatedSize = (req.fileData.length * 3) / 4;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (estimatedSize > maxSize) {
      throw APIError.invalidArgument("File size exceeds 10MB limit");
    }

    // Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = req.fileName.split('.').pop()?.toLowerCase() || '';
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw APIError.invalidArgument("File type not supported. Please use JPEG, PNG, or WebP format.");
    }

    const transaction = await db.begin();
    
    try {
      // Convert base64 to buffer
      const fileBuffer = Buffer.from(req.fileData, 'base64');
      
      // Validate actual file size
      if (fileBuffer.length > maxSize) {
        throw APIError.invalidArgument("File size exceeds 10MB limit");
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const originalFileName = `original_${req.userId}_${timestamp}.${fileExtension}`;
      
      // Upload to storage
      try {
        await imagesBucket.upload(originalFileName, fileBuffer, {
          contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
        });
      } catch (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw APIError.internal("Failed to upload image to storage");
      }
      
      const originalUrl = imagesBucket.publicUrl(originalFileName);
      
      // Save to database
      const image = await transaction.queryRow<{
        id: string;
        original_url: string;
        status: string;
      }>`
        INSERT INTO images (user_id, original_url, status, file_size)
        VALUES (${req.userId}, ${originalUrl}, 'uploaded', ${fileBuffer.length})
        RETURNING id, original_url, status
      `;

      if (!image) {
        throw APIError.internal("Failed to save image record to database");
      }

      await transaction.commit();

      return {
        id: image.id,
        originalUrl: image.original_url,
        status: image.status
      };
    } catch (error) {
      await transaction.rollback();
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid character')) {
          throw APIError.invalidArgument("Invalid file data format. Please select a valid image file.");
        }
        // Re-throw APIErrors as-is
        if (error.message.includes('APIError')) {
          throw error;
        }
      }
      console.error('Upload error:', error);
      throw APIError.internal("Failed to process image upload");
    }
  }
);
