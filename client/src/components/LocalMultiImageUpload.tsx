import { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { uploadToLocal, type UploadProgress } from '@/lib/local-upload';
import { useToast } from '@/hooks/use-toast';

interface LocalMultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function LocalMultiImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 5
}: LocalMultiImageUploadProps) {
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (index: number, file: File) => {
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

    setUploadingIndexes(prev => [...prev, index]);
    setProgress(prev => ({ ...prev, [index]: 0 }));

    try {
      const url = await uploadToLocal(file, (prog: UploadProgress) => {
        setProgress(prev => ({ ...prev, [index]: prog.percentage }));
      });

      const newImages = [...images];
      newImages[index] = url;
      onImagesChange(newImages);
      
      toast({
        title: "Success",
        description: `Image ${index + 1} uploaded successfully!`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingIndexes(prev => prev.filter(i => i !== index));
      setProgress(prev => {
        const newProg = { ...prev };
        delete newProg[index];
        return newProg;
      });
    }
  };

  const handleBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages = [...images];
    let startIndex = images.findIndex(img => !img);
    if (startIndex === -1) startIndex = images.length;

    const filesToUpload = Array.from(files).slice(0, maxImages - startIndex);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const index = startIndex + i;
      if (index >= maxImages) break;
      await handleFileSelect(index, file);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    onImagesChange(newImages);
  };

  const imageSlots = Array.from({ length: maxImages }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Images (Max {maxImages})</label>
        <input
          ref={bulkInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleBulkUpload(e.target.files)}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => bulkInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Bulk Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {imageSlots.map((index) => {
          const image = images[index];
          const isUploading = uploadingIndexes.includes(index);
          const uploadProgress = progress[index] || 0;

          return (
            <div key={index} className="relative">
              <input
                ref={el => fileInputRefs.current[index] = el}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(index, file);
                }}
                className="hidden"
              />

              {image ? (
                <div className="relative group">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemove(index)}
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  disabled={isUploading}
                  className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
