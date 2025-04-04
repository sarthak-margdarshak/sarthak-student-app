"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, Image as ImageIcon } from "lucide-react";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ImagePickerDialog({ isOpen, onClose }) {
  const { updateProfileImage } = useAuthContext();
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (previewImage) {
      setUploading(true);
      await updateProfileImage(imageFile);
      setUploading(false);
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Profile Picture
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            className="p-2 rounded-full"
            disabled={uploading}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
              dragActive
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-gray-400"
            } ${previewImage ? "py-4" : "py-12"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {previewImage ? (
              <>
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Click or drag to choose a different image
                </p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <Upload size={28} />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop an image here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Or click to browse files
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                    <ImageIcon size={16} />
                    <span>JPG, PNG, GIF</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                    <Camera size={16} />
                    <span>Take Photo</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <Button
            className="px-4 py-2 rounded-lg"
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 rounded-lg"
            onClick={handleSave}
            disabled={!previewImage || uploading}
          >
            {uploading && <Loader2 className="animate-spin" />}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
