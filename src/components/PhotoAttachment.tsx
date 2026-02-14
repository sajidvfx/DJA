import React, { useRef } from 'react';
import { cn } from '@/utils/cn';

interface PhotoAttachmentProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  darkMode: boolean;
}

export const PhotoAttachment: React.FC<PhotoAttachmentProps> = ({ photos, onPhotosChange, darkMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          onPhotosChange([...photos, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full py-3 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2",
          darkMode 
            ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400" 
            : "border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500"
        )}
      >
        <span className="text-xl">📷</span>
        <span>Add Photos</span>
      </button>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
