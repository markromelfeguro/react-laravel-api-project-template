import React, { useRef, useState } from 'react';
import { MaterialIcon } from '../MaterialIcon';

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  progress?: number;
  isUploading?: boolean;
}

export const FileUpload = ({ 
  label, 
  accept, 
  multiple = false, 
  onFileSelect, 
  progress = 0, 
  isUploading = false 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFileCount(fileArray.length);
      onFileSelect(fileArray);

      // Handle Preview (Show the first image if multiple)
      const firstFile = fileArray[0];
      if (firstFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(firstFile));
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">{label}</label>
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer overflow-hidden
          border-2 border-dashed border-border rounded-2xl 
          bg-surface hover:border-primary transition-all duration-300
          min-h-40 flex flex-col items-center justify-center p-6
          ${isUploading ? 'cursor-not-allowed opacity-80' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={handleFileChange} 
        />

        {preview ? (
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
        ) : (
          <MaterialIcon 
            iconName={fileCount > 1 ? "library_add" : "cloud_upload"} 
            size={40} 
            className="text-muted group-hover:text-primary transition-colors mb-2" 
          />
        )}

        <div className="flex flex-col items-center z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-tighter text-main-text">
            {isUploading ? 'Uploading Data...' : (
              fileCount > 1 ? `${fileCount} Files Selected` : 'Click to upload or drag & drop'
            )}
          </span>
          {!isUploading && fileCount === 1 && (
            <span className="text-[9px] text-muted uppercase font-mono mt-1">Ready for transfer</span>
          )}
        </div>

        {/* PROGRESS BAR */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-border overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 animate-progress" 
              style={{ width: progress > 0 ? `${progress}%` : '20%' }}
            />
          </div>
        )}
      </div>
      
      {progress > 0 && isUploading && (
        <span className="text-[10px] font-bold uppercase text-primary self-end">{progress}% Complete</span>
      )}
    </div>
  );
};