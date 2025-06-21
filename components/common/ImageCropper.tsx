"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, RotateCw, Move, Square } from "lucide-react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface AspectRatio {
  label: string;
  value: number | null; // null means free form
}

interface ImageCropperProps {
  onSubmit?: (croppedImageBlob: Blob, cropData: CropArea) => void;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { label: "Free", value: null },
  { label: "1:1 (Square)", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3 (Portrait)", value: 2 / 3 },
];

const ImageCropper: React.FC<ImageCropperProps> = ({ onSubmit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maintainAspectRatio = (
    newArea: CropArea,
    aspectRatio: number
  ): CropArea => {
    const targetWidth = newArea.height * aspectRatio;
    const targetHeight = newArea.width / aspectRatio;

    if (targetWidth <= newArea.width) {
      return { ...newArea, width: targetWidth };
    } else {
      return { ...newArea, height: targetHeight };
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });

      // Get the actual rendered dimensions of the image
      const renderedWidth = imageRef.current.offsetWidth;
      const renderedHeight = imageRef.current.offsetHeight;

      // Set initial crop area to center of the rendered image
      const initialSize = Math.min(renderedWidth, renderedHeight, 200);

      let initialCrop = {
        x: (renderedWidth - initialSize) / 2,
        y: (renderedHeight - initialSize) / 2,
        width: initialSize,
        height: initialSize,
      };

      // Apply aspect ratio if selected
      if (selectedAspectRatio) {
        if (selectedAspectRatio > 1) {
          // Landscape
          initialCrop.height = initialSize / selectedAspectRatio;
        } else {
          // Portrait
          initialCrop.width = initialSize * selectedAspectRatio;
        }
        initialCrop.x = (renderedWidth - initialCrop.width) / 2;
        initialCrop.y = (renderedHeight - initialCrop.height) / 2;
      }

      setCropArea(initialCrop);
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    action: "drag" | "resize",
    handle?: string
  ) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (action === "drag") {
      setIsDragging(true);
    } else if (action === "resize") {
      setIsResizing(true);
      setResizeHandle(handle || "");
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // Calculate position relative to the image, not the container
      const currentX = e.clientX - imageRect.left;
      const currentY = e.clientY - imageRect.top;
      const deltaX =
        currentX - (dragStart.x - (imageRect.left - containerRect.left));
      const deltaY =
        currentY - (dragStart.y - (imageRect.top - containerRect.top));

      const imageWidth = imageRef.current.offsetWidth;
      const imageHeight = imageRef.current.offsetHeight;

      if (isDragging) {
        setCropArea((prev) => ({
          ...prev,
          x: Math.max(0, Math.min(prev.x + deltaX, imageWidth - prev.width)),
          y: Math.max(0, Math.min(prev.y + deltaY, imageHeight - prev.height)),
        }));
        setDragStart({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        });
      }

      if (isResizing && resizeHandle) {
        setCropArea((prev) => {
          let newArea = { ...prev };

          switch (resizeHandle) {
            case "nw":
              newArea.width = Math.max(50, prev.width - deltaX);
              newArea.height = Math.max(50, prev.height - deltaY);
              newArea.x = Math.max(0, prev.x + deltaX);
              newArea.y = Math.max(0, prev.y + deltaY);
              break;
            case "ne":
              newArea.width = Math.max(
                50,
                Math.min(imageWidth - prev.x, prev.width + deltaX)
              );
              newArea.height = Math.max(50, prev.height - deltaY);
              newArea.y = Math.max(0, prev.y + deltaY);
              break;
            case "sw":
              newArea.width = Math.max(50, prev.width - deltaX);
              newArea.height = Math.max(
                50,
                Math.min(imageHeight - prev.y, prev.height + deltaY)
              );
              newArea.x = Math.max(0, prev.x + deltaX);
              break;
            case "se":
              newArea.width = Math.max(
                50,
                Math.min(imageWidth - prev.x, prev.width + deltaX)
              );
              newArea.height = Math.max(
                50,
                Math.min(imageHeight - prev.y, prev.height + deltaY)
              );
              break;
          }

          // Apply aspect ratio constraint if selected
          if (selectedAspectRatio) {
            newArea = maintainAspectRatio(newArea, selectedAspectRatio);
          }

          // Ensure crop area stays within image bounds
          newArea.x = Math.max(
            0,
            Math.min(newArea.x, imageWidth - newArea.width)
          );
          newArea.y = Math.max(
            0,
            Math.min(newArea.y, imageHeight - newArea.height)
          );

          return newArea;
        });
        setDragStart({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        });
      }
    },
    [isDragging, isResizing, dragStart, resizeHandle, selectedAspectRatio]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const cropImage = () => {
    if (!imageRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const img = imageRef.current;

    // Calculate scaling factors between natural image size and rendered size
    const scaleX = imageDimensions.width / img.offsetWidth;
    const scaleY = imageDimensions.height / img.offsetHeight;

    // Set canvas size to crop area size
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Draw the cropped portion
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    return canvas;
  };

  const handleSubmit = () => {
    const canvas = cropImage();
    if (canvas && onSubmit) {
      canvas.toBlob((blob) => {
        if (blob) {
          onSubmit(blob, cropArea);
        }
      }, "image/png");
    }
  };

  const resetCrop = () => {
    if (imageRef.current && containerRef.current) {
      const renderedWidth = imageRef.current.offsetWidth;
      const renderedHeight = imageRef.current.offsetHeight;
      const initialSize = Math.min(renderedWidth, renderedHeight, 200);

      let newCrop = {
        x: (renderedWidth - initialSize) / 2,
        y: (renderedHeight - initialSize) / 2,
        width: initialSize,
        height: initialSize,
      };

      // Apply aspect ratio if selected
      if (selectedAspectRatio) {
        if (selectedAspectRatio > 1) {
          newCrop.height = initialSize / selectedAspectRatio;
        } else {
          newCrop.width = initialSize * selectedAspectRatio;
        }
        newCrop.x = (renderedWidth - newCrop.width) / 2;
        newCrop.y = (renderedHeight - newCrop.height) / 2;
      }

      setCropArea(newCrop);
    }
  };

  const handleAspectRatioChange = (aspectRatio: number | null) => {
    setSelectedAspectRatio(aspectRatio);

    if (aspectRatio && imageRef.current && containerRef.current) {
      setCropArea((prev) => {
        let newArea = { ...prev };

        if (aspectRatio > 1) {
          // Landscape - adjust height based on width
          newArea.height = newArea.width / aspectRatio;
        } else {
          // Portrait or square - adjust width based on height
          newArea.width = newArea.height * aspectRatio;
        }

        // Center the crop area within image bounds
        const imageWidth = imageRef.current!.offsetWidth;
        const imageHeight = imageRef.current!.offsetHeight;
        newArea.x = Math.max(
          0,
          Math.min(newArea.x, imageWidth - newArea.width)
        );
        newArea.y = Math.max(
          0,
          Math.min(newArea.y, imageHeight - newArea.height)
        );

        return newArea;
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Image Cropper</h2>
          <p className="text-zinc-400">
            Upload an image and drag to select the area you want to crop
          </p>
        </div>

        {/* Upload Area */}
        {!image && (
          <div
            className="border-2 border-dashed border-zinc-600 rounded-lg p-12 text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-800"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-lg font-medium text-white mb-2">
              Upload an image
            </p>
            <p className="text-zinc-400">
              Click here or drag and drop your image file
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            {image ? "Change Image" : "Upload Image"}
          </button>

          {image && (
            <>
              <button
                type="button"
                onClick={resetCrop}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors border border-zinc-600"
              >
                <Square className="h-4 w-4" />
                Reset Crop
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Submit
              </button>
            </>
          )}
        </div>

        {/* Aspect Ratio Controls */}
        {image && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white text-center">
              Aspect Ratio
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  type="button"
                  key={ratio.label}
                  onClick={() => handleAspectRatioChange(ratio.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAspectRatio === ratio.value
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Cropper */}
        {image && (
          <div className="relative border border-zinc-700 rounded-lg overflow-hidden bg-zinc-800">
            <div ref={containerRef} className="relative flex justify-center">
              <img
                ref={imageRef}
                src={image}
                alt="Image to crop"
                className="max-w-full max-h-96 object-contain block"
                onLoad={handleImageLoad}
                draggable={false}
              />

              {/* Crop Overlay */}
              <div className="absolute inset-0 bg-black/30">
                {/* Crop Area */}
                <div
                  className="absolute border-2 border-white bg-transparent cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "drag")}
                >
                  {/* Resize Handles */}
                  <div
                    className="absolute w-3 h-3 bg-emerald-400 border border-emerald-300 cursor-nw-resize -top-1 -left-1 rounded-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "resize", "nw");
                    }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-emerald-400 border border-emerald-300 cursor-ne-resize -top-1 -right-1 rounded-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "resize", "ne");
                    }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-emerald-400 border border-emerald-300 cursor-sw-resize -bottom-1 -left-1 rounded-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "resize", "sw");
                    }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-emerald-400 border border-emerald-300 cursor-se-resize -bottom-1 -right-1 rounded-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "resize", "se");
                    }}
                  />

                  {/* Move Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Move className="h-6 w-6 text-emerald-400 opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Elements */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;

/* example on how to use it


const [croppedImage, setCroppedImage] = useState<string | null>(null);

const handleCropSubmit = (blob: Blob, cropData: CropArea) => {
  // Convert blob to data URL for display
  const reader = new FileReader();
  reader.onload = (e) => {
    setCroppedImage(e.target?.result as string);
  };
  reader.readAsDataURL(blob);
};

return (
  <ImageCropper onSubmit={handleCropSubmit} />
);
*/
