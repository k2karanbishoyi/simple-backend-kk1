import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isProcessing?: boolean;
}

export default function UploadZone({ onUpload, isProcessing = false }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
    setDragOver(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
        isDragActive || dragOver
          ? "border-purple-400 bg-purple-50"
          : "border-gray-300 hover:border-gray-400",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Processing your image...
          </p>
          <p className="text-gray-600">
            This usually takes less than 5 seconds
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-purple-600" />
          </div>
          
          <Button 
            className="mb-4 bg-purple-600 hover:bg-purple-700"
            disabled={isProcessing}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Image
          </Button>
          
          <p className="text-gray-600 mb-2">
            {isDragActive ? "Drop your image here" : "or drag and drop your image here"}
          </p>
          
          <p className="text-sm text-gray-500">
            Supports JPEG, PNG, WebP up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}
