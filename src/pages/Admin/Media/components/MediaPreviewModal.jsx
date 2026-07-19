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
                <div className="bg-white/10 backdrop-blur text-white px-4 py-3 rounded flex flex-wrap items-center justify-center gap-6 text-sm">
                    <p><strong>Tên:</strong> {previewFile.fileName}</p>
                    <p><strong>Kích thước:</strong> {formatFileSize(previewFile.fileSize)}</p>
                    <p><strong>Phân loại:</strong> {getBucketLabel(previewFile.bucket || '').text}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); window.open(previewFile.url, '_blank'); }}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Xem ảnh gốc toàn màn hình
                    </button>
                </div>
            </div>
        </div>
    );
}
