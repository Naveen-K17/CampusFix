import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  isUploading?: boolean;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  previewUrl,
  setPreviewUrl,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndHandle = (file: File) => {
    setErrorMsg(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Only JPG, JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Image size must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandle(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onImageSelected(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <img
            src={previewUrl}
            alt="Complaint Preview"
            referrerPolicy="no-referrer"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-medium shadow hover:bg-slate-50 transition-colors"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-2.5 left-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
            Photo Attached
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
            {dragActive ? (
              <UploadCloud className="w-6 h-6 text-indigo-600 animate-bounce" />
            ) : (
              <Camera className="w-6 h-6 text-slate-600" />
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 text-center">
            Click to upload or drag & drop photo
          </p>
          <p className="text-xs text-slate-500 mt-1 text-center">
            JPG, JPEG, PNG, or WEBP (Max {MAX_SIZE_MB}MB)
          </p>
          <span className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            Attach photo proof of issue
          </span>
        </div>
      )}

      {errorMsg && (
        <p className="mt-2 text-xs font-medium text-rose-600">{errorMsg}</p>
      )}
    </div>
  );
};
