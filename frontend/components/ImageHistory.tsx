import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface ImageItem {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: string;
  createdAt: string;
}

interface ImageHistoryProps {
  userId: string;
}

export default function ImageHistory({ userId }: ImageHistoryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [userId]);

  const fetchImages = async () => {
    try {
      const response = await backend.images.list({ userId });
      setImages(response.images);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to load image history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
        <p className="text-gray-600">
          Upload your first image to get started with background removal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Image Preview */}
              <div className="flex space-x-4">
                <div className="relative">
                  <img
                    src={image.originalUrl}
                    alt="Original"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    Original
                  </div>
                </div>
                
                {image.processedUrl && (
                  <div className="relative">
                    <img
                      src={image.processedUrl}
                      alt="Processed"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded">
                      Processed
                    </div>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(image.status)}
                  <span className="text-sm text-gray-500">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Image ID: {image.id.slice(0, 8)}...
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {image.processedUrl && (
                  <Button
                    size="sm"
                    onClick={() => handleDownload(image.processedUrl!, `processed-${image.id}.png`)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(image.originalUrl, `original-${image.id}.jpg`)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Original
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
