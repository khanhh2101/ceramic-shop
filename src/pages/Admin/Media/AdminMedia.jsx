import React, { useState, useEffect, useRef } from 'react';
import { FiImage, FiCopy, FiTrash2, FiSearch, FiFilter, FiUpload, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { mediaService } from '../../../services/index';

export default function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bucketFilter, setBucketFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMedia = async (page = 1, bucket = '', search = '', sort = 'newest') => {
    try {
      setLoading(true);
      const res = await api.get('/media', {
        params: { page, pageSize: 24, bucket, search, sort }
      });
      if (res.data) {
        // PagedResponse
        setFiles(res.data.data || []);
        setTotalPages(Math.ceil((res.data.totalCount || 0) / (res.data.pageSize || 24)));
      }
    } catch (err) {
      toast.error('Lỗi khi tải danh sách Media');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add debounce for search
    const timer = setTimeout(() => {
      fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, bucketFilter, searchTerm, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá file này? File sẽ bị xoá khỏi hệ thống và không thể phục hồi.')) return;
    
    try {
      await api.delete(`/media/${id}`);
      toast.success('Xoá file thành công!');
      fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder);
    } catch (err) {
      toast.error('Lỗi khi xoá file');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Đã copy link ảnh!');
  };

  const handleBucketChange = (e) => {
    setBucketFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Lỗi khi tải ảnh xuống');
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (!uploadedFiles.length) return;

    // Validate
    const invalidFile = uploadedFiles.find(f => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024);
    if (invalidFile) {
      toast.error('Chỉ hỗ trợ file hình ảnh và kích thước dưới 5MB');
      return;
    }

    try {
      setUploading(true);
      const targetBucket = bucketFilter.replace('ecommerce-', '') || 'general';
      await mediaService.uploadMultiple(uploadedFiles, targetBucket);
      toast.success('Upload ảnh thành công!');
      fetchMedia(1, bucketFilter, searchTerm, sortOrder);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Lỗi khi upload ảnh');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBucketLabel = (bucket) => {
    if (bucket.includes('products')) return { text: 'Sản phẩm', color: 'bg-blue-100 text-blue-800' };
    if (bucket.includes('blogs')) return { text: 'Bài viết', color: 'bg-green-100 text-green-800' };
    if (bucket.includes('banners')) return { text: 'Banner', color: 'bg-purple-100 text-purple-800' };
    if (bucket.includes('general')) return { text: 'Thư viện chung', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Khác', color: 'bg-gray-100 text-gray-800' };
  };

  const formatUsedIn = (usedIn) => {
    if (!usedIn) return 'Chưa phân loại';
    if (usedIn.startsWith('Product_')) return `ID Sản phẩm: #${usedIn.split('_')[1]}`;
    if (usedIn.startsWith('Blog_')) return `ID Bài viết: #${usedIn.split('_')[1]}`;
    if (usedIn === 'AdminMediaUpload') return 'Tải lên tự do';
    return usedIn;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Thư Viện Media</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tất cả hình ảnh và file đã tải lên hệ thống.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên file..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-white"
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-36">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-white"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="size_desc">Nặng nhất</option>
              <option value="name_asc">Tên (A-Z)</option>
            </select>
          </div>

          {/* Filter */}
          <div className="relative flex-1 sm:w-48">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={bucketFilter}
              onChange={handleBucketChange}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-white"
            >
              <option value="">Tất cả (All)</option>
              <option value="ecommerce-products">Sản phẩm (Products)</option>
              <option value="ecommerce-blogs">Bài viết (Blogs)</option>
              <option value="ecommerce-banners">Banners</option>
              <option value="ecommerce-general">Thư viện chung</option>
            </select>
          </div>
          
          <button 
            onClick={() => fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder)}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="Làm mới"
          >
            <FiRefreshCw size={18} />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b5624a] hover:bg-[#8e4a36]'
            }`}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiUpload />
            )}
            {uploading ? 'Đang Upload...' : 'Upload Ảnh'}
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b5624a]"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiImage size={48} className="mb-4 opacity-50" />
            <p>Không có file nào trong thư mục này.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map(file => (
                <div key={file.id} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image Thumbnail */}
                  <div className="aspect-square bg-gray-200 relative overflow-hidden cursor-pointer" onClick={() => setPreviewFile(file)}>
                    <img 
                      src={file.url} 
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => copyToClipboard(file.url)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-[#b5624a] shadow-sm transform hover:scale-110 transition-all"
                        title="Copy Link"
                      >
                        <FiCopy size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownload(file.url, file.fileName)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm transform hover:scale-110 transition-all"
                        title="Tải xuống"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(file.id)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 shadow-sm transform hover:scale-110 transition-all"
                        title="Xóa File"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-800 truncate mb-2" title={file.fileName}>
                      {file.fileName}
                    </p>
                    
                    {/* Extra Info */}
                    <div className="flex flex-col gap-1.5 mb-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${getBucketLabel(file.bucket || '').color}`}>
                          {getBucketLabel(file.bucket || '').text}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">
                          {formatFileSize(file.fileSize)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 truncate bg-gray-100 px-2 py-1 rounded" title={formatUsedIn(file.usedIn)}>
                        Mục đích: <span className="font-medium text-gray-800">{formatUsedIn(file.usedIn)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#b5624a] text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox Preview Modal ── */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewFile(null)}>
          <div className="relative max-w-5xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setPreviewFile(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={previewFile.url} alt={previewFile.fileName} className="max-h-[80vh] object-contain rounded shadow-2xl" />
            <div className="bg-white/10 backdrop-blur text-white px-4 py-2 rounded flex gap-4 text-sm">
              <p><strong>Tên:</strong> {previewFile.fileName}</p>
              <p><strong>Kích thước:</strong> {formatFileSize(previewFile.fileSize)}</p>
              <p><strong>Phân loại:</strong> {getBucketLabel(previewFile.bucket || '').text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
