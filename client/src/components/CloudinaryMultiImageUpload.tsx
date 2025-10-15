import { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { uploadToLocal, type UploadProgress } from '@/lib/local-upload';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryMultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function CloudinaryMultiImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 5
}: CloudinaryMultiImageUploadProps) {
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

  const handleBulkUpload = async (files: FileList) => {
    const filesToUpload: File[] = [];
    for (let i = 0; i < Math.min(files.length, maxImages); i++) {
      const file = files[i];
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is over ${maxSizeMB}MB and was skipped.`,
          variant: "destructive"
        });
        continue;
      }
      if (!file.type.startsWith('image/')) {
        continue;
      }
      filesToUpload.push(file);
    }

    if (filesToUpload.length === 0) return;

    const newImages = [...images];
    let uploadedCount = 0;

    for (const file of filesToUpload) {
      const emptyIndex = newImages.findIndex(img => !img || img.trim() === '');
      if (emptyIndex === -1) break;

      setUploadingIndexes(prev => [...prev, emptyIndex]);
      
      try {
        const url = await uploadToLocal(file, (prog: UploadProgress) => {
          setProgress(prev => ({ ...prev, [emptyIndex]: prog.percentage }));
        });

        newImages[emptyIndex] = url;
        uploadedCount++;
        
        setUploadingIndexes(prev => prev.filter(i => i !== emptyIndex));
        setProgress(prev => {
          const newProg = { ...prev };
          delete newProg[emptyIndex];
          return newProg;
        });
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingIndexes(prev => prev.filter(i => i !== emptyIndex));
      }
    }

    if (uploadedCount > 0) {
      onImagesChange(newImages);
      toast({
        title: "Success",
        description: `${uploadedCount} image(s) uploaded successfully!`
      });
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Images (Up to {maxImages})</label>
        <input
          ref={bulkInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleBulkUpload(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => bulkInputRef.current?.click()}
          disabled={uploadingIndexes.length > 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
          const isUploading = uploadingIndexes.includes(index);
          const currentProgress = progress[index] || 0;
          const hasImage = images[index] && images[index].trim() !== '';

          return (
            <div key={index} className="space-y-2">
              <input
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(index, file);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />

              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
                {hasImage ? (
                  <>
                    <img
                      src={images[index]}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={isUploading}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="text-xs text-gray-500">{currentProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </>
                    )}
                  </button>
                )}

                {isUploading && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-700 h-1">
                    <div
                      className="bg-blue-600 h-1 transition-all duration-300"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-center text-gray-500">
                Image {index + 1}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
