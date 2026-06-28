import React, { useRef } from 'react';
import { FiImage, FiUploadCloud, FiX } from 'react-icons/fi';

export default function ImageUpload({
  label,
  previewUrl,
  onImageSelect,
  onClearImage,
  required = false,
  error = '',
  className = '',
  height = 'h-48'
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!previewUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
    // reset so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        onClick={handleClick}
        className={`relative w-full ${height} border-2 border-dashed rounded-xl overflow-hidden transition-colors flex items-center justify-center group
          ${previewUrl ? 'border-gray-200' : error ? 'border-red-300 bg-red-50 hover:bg-red-100 cursor-pointer' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClearImage) onClearImage();
                }}
                className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-red-50 hover:scale-110 transition-all shadow-lg"
                title="Xóa ảnh"
              >
                <FiX size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <FiUploadCloud className={`mx-auto h-10 w-10 mb-2 ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-[#b5624a] transition-colors'}`} />
            <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
              <span className="font-semibold text-[#b5624a]">Bấm để chọn ảnh</span> hoặc kéo thả vào đây
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP lên đến 5MB</p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
