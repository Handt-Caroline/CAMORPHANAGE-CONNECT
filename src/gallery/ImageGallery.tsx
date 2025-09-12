'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileUpload from '../upload/FileUpload';

interface ImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  editable?: boolean;
  maxImages?: number;
}

export default function ImageGallery({
  images,
  onImagesChange,
  editable = false,
  maxImages = 10,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (url: string) => {
    if (images.length < maxImages) {
      onImagesChange([...images, url]);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            {editable && (
              <button
                onClick={() => handleImageRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Upload Slot */}
        {editable && images.length < maxImages && (
          <div className="aspect-square">
            <FileUpload
              type="gallery"
              onUploadComplete={handleImageUpload}
              className="h-full"
            >
              <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-gray-600">Add Image</p>
              </div>
            </FileUpload>
          </div>
        )}
      </div>

      {/* Image Counter */}
      {editable && (
        <p className="text-sm text-gray-600 text-center">
          {images.length} of {maxImages} images
        </p>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Gallery image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
