"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  initialImages?: string[];
};

export function ImageUploader({
  onImagesChange,
  maxImages = 9,
  initialImages = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial images to parent on mount
  useEffect(() => {
    onImagesChange(initialImages);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "上传失败");
    }

    const data = await res.json();
    return data.url as string;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        toast.error(`最多只能上传 ${maxImages} 张图片`);
        return;
      }

      const fileArray = Array.from(files).slice(0, remaining);
      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        toast.error("请选择图片文件");
        return;
      }

      setUploading(true);
      try {
        const newUrls: string[] = [];
        for (const file of imageFiles) {
          const url = await uploadFile(file);
          newUrls.push(url);
        }

        const updatedImages = [...images, ...newUrls];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        toast.success(`成功上传 ${newUrls.length} 张图片`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "上传失败");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      onImagesChange(updated);
    },
    [images, onImagesChange],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          图片（可选，最多 {maxImages} 张）
        </label>
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {images.length} / {maxImages}
        </span>
      </div>

      {/* 图片预览网格 */}
      {images.length > 0 && (
        <div className="image-uploader-grid">
          {images.map((url, index) => (
            <div key={url} className="image-uploader-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`图片 ${index + 1}`} />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="image-uploader-remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 上传区域 */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`image-uploader-dropzone${dragOver ? " drag-over" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
          {uploading ? (
            <div style={{ color: "var(--color-muted)" }}>
              <div className="image-uploader-loading-text">上传中...</div>
              <div className="image-uploader-progress">
                <div className="image-uploader-progress-bar" />
              </div>
            </div>
          ) : (
            <>
              <UploadIcon />
              <div className="image-uploader-upload-text">
                点击或拖拽图片到此处上传
              </div>
              <div className="image-uploader-upload-hint">
                支持 JPG、PNG、GIF、WebP，不超过 5MB
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-muted)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ margin: "0 auto" }}
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
