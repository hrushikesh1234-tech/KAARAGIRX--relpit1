import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { uploadToLocal, type UploadProgress } from '@/lib/local-upload';
import { useToast } from '@/hooks/use-toast';

interface LocalImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
  maxSizeMB?: number;
}

export default function LocalImageUpload({
  onUploadComplete,
  currentImage,
  label = "Upload Image",
  maxSizeMB = 5
}: LocalImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `Please use images under ${maxSizeMB}MB.`,
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadToLocal(file, (prog: UploadProgress) => {
        setProgress(prog.percentage);
      });

      onUploadComplete(url);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {currentImage ? 'Change Image' : 'Select Image'}
            </>
          )}
        </Button>
        {currentImage && !uploading && (
          <Button
            type="button"
            onClick={handleClear}
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {currentImage && (
        <div className="mt-2">
          <img
            src={currentImage}
            alt="Preview"
            className="h-20 w-20 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
}
