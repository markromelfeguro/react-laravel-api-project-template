import React, { useRef, useState, useEffect } from 'react';
import { MaterialIcon } from '../MaterialIcon';

interface FileUploadProps {
  label: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  progress?: number;
  isUploading?: boolean;
  previewUrl?: string | null;
  error?: string;
}

export const FileUpload = ({ 
  label,
  name = "", 
  accept, 
  multiple = false, 
  onFileSelect, 
  progress = 0, 
  isUploading = false,
  previewUrl,
  error
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const getFileIcon = () => {
    if (error) return "warning";
    if (fileCount > 1) return "library_add";
    if (!fileType) return "cloud_upload";
    if (fileType.includes('image')) return "image";
    if (fileType.includes('pdf')) return "description";
    if (fileType.includes('zip') || fileType.includes('rar')) return "folder_zip";
    if (fileType.includes('video')) return "movie";
    if (fileType.includes('audio')) return "audiotrack";
    return "insert_drive_file";
  };

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFileCount(fileArray.length);
      setFileType(fileArray[0].type);
      onFileSelect(fileArray);

      const firstFile = fileArray[0];
      if (firstFile.type.startsWith('image/')) {
        const newPreview = URL.createObjectURL(firstFile);
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
        setPreview(newPreview);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center ml-1">
        <label className="text-xs text-primary font-black uppercase tracking-widest italic leading-none">
          {label}
        </label>
        {error && (
          <span className="text-[10px] font-black uppercase italic text-red-500 animate-pulse tracking-tighter">
            Critical Error Detected
          </span>
        )}
      </div>
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer overflow-hidden
          border-2 border-dashed rounded-[2.5rem] 
          bg-surface transition-all duration-500
          min-h-40 flex flex-col items-center justify-center p-6
          ${error 
            ? 'border-red-500 bg-red-500/5 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]' 
            : (isDragging ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-border hover:border-primary shadow-main')}
          ${isUploading ? 'cursor-not-allowed opacity-80' : 'active:scale-95'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          name={name} 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={(e) => processFiles(e.target.files)} 
        />

        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${error ? 'opacity-10 grayscale' : 'opacity-20 group-hover:opacity-40'}`} 
          />
        )}

        <div className="flex flex-col items-center z-10 text-center pointer-events-none">
          <MaterialIcon 
            iconName={getFileIcon()} 
            size={48} 
            className={`transition-all duration-300 mb-2 ${error ? 'text-red-500' : (isDragging ? 'text-primary scale-110' : 'text-muted group-hover:text-primary')}`} 
          />
          <span className={`text-xs font-black uppercase italic tracking-tighter max-w-50 leading-tight ${error ? 'text-red-500' : 'text-primary'}`}>
            {error ? 'Asset Rejected by Server' : (isUploading ? 'Synchronizing Assets...' : (
              isDragging ? 'Drop to Initialize' : (fileCount > 1 ? `${fileCount} Assets Selected` : 'Select or Drag & Drop Assets')
            ))}
          </span>
          {!isUploading && !error && fileCount === 1 && (
            <span className="text-[9px] text-muted uppercase font-mono mt-1 italic font-bold">Encrypted Asset Ready</span>
          )}
        </div>

        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-border/30 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${error ? 'bg-red-500' : 'bg-primary'}`} 
              style={{ width: progress > 0 ? `${progress}%` : '30%' }} 
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-[10px] font-bold italic text-red-500 ml-2 mt-1 uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
      
      {!error && progress > 0 && isUploading && (
        <span className="text-[10px] font-black uppercase italic text-primary self-end tracking-widest mt-1">
          {progress}% SYNCED
        </span>
      )}
    </div>
  );
};