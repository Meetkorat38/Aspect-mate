"use client";

import React, { useState, useEffect, useRef } from "react";

import { CldImage } from "next-cloudinary";

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 960,
    height: 600,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    // Create a new Image to read the uploaded file's dimensions
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = async () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });

      // Clean up the object URL
      URL.revokeObjectURL(objectURL);

      // Upload image after getting dimensions
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        setUploadedImage(data.publicId);
      } catch (error) {
        console.log(error);
        alert("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    };

    img.src = objectURL;
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `image-${imageDimensions.width}x${imageDimensions.height}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Remove Background</h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                  <CldImage
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    removeBackground
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
