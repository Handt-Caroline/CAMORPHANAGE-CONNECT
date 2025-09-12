'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  type: 'profile-image' | 'document' | 'gallery';
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function FileUpload({
  type,
  onUploadComplete,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
  children,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;
    
    switch (type) {
      case 'profile-image':
      case 'gallery':
        return 'image/jpeg,image/png,image/webp';
      case 'document':
        return 'application/pdf,image/jpeg,image/png';
      default:
        return '*/*';
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    const allowedTypes: Record<string, string[]> = {
      'profile-image': ['image/jpeg', 'image/png', 'image/webp'],
      'document': ['application/pdf', 'image/jpeg', 'image/png'],
      'gallery': ['image/jpeg', 'image/png', 'image/webp'],
    };

    if (allowedTypes[type] && !allowedTypes[type].includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const result = await response.json();
      onUploadComplete(result.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {children ? (
        <div onClick={openFileDialog} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-600">
                {type === 'profile-image' && 'Upload a profile image (JPEG, PNG, WebP)'}
                {type === 'gallery' && 'Upload gallery images (JPEG, PNG, WebP)'}
                {type === 'document' && 'Upload documents (PDF, JPEG, PNG)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
