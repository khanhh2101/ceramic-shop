import React from 'react';

export default function MediaPreviewModal({ previewFile, setPreviewFile, formatFileSize, getBucketLabel }) {
    if (!previewFile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewFile(null)}>
            <div className="relative max-w-5xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                    onClick={() => setPreviewFile(null)}
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img src={previewFile.url} alt={previewFile.fileName} className="max-h-[80vh] object-contain rounded shadow-2xl" />
                <div className="bg-white/10 backdrop-blur text-white px-4 py-2 rounded flex gap-4 text-sm">
                    <p><strong>Tên:</strong> {previewFile.fileName}</p>
                    <p><strong>Kích thước:</strong> {formatFileSize(previewFile.fileSize)}</p>
                    <p><strong>Phân loại:</strong> {getBucketLabel(previewFile.bucket || '').text}</p>
                </div>
            </div>
        </div>
    );
}
