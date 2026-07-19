import { useState, useEffect, useRef } from 'react';
import { FiImage, FiCopy, FiTrash2, FiSearch, FiFilter, FiUpload, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminMediaApi } from './api/adminMediaApi';
import MediaPreviewModal from './components/MediaPreviewModal';

export default function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bucketFilter, setBucketFilter] = useState('');
  const [usedInFilter, setUsedInFilter] = useState('');
  const [isOrphanedFilter, setIsOrphanedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [availablePurposes, setAvailablePurposes] = useState([]);
  
  // Modals state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [previewFile, setPreviewFile] = useState(null);
  
  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Upload Modal state
  const [uploadModal, setUploadModal] = useState({ isOpen: false, files: [], bucket: 'ecommerce-general', usedIn: '' });
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const fetchMedia = async (page = 1, bucket = '', search = '', sort = 'newest', usedIn = '', isOrphaned = '') => {
    try {
      setLoading(true);
      const params = { page, pageSize: 24, bucket, search, sort };
      if (usedIn) params.usedIn = usedIn;
      if (isOrphaned !== '') params.isOrphaned = isOrphaned === 'true';
      const res = await adminMediaApi.getMedia(params);
      if (res) {
        setFiles(Array.isArray(res) ? res : (res?.data || res?.items || []));
        setTotalPages(Math.ceil((res.totalCount || 0) / (res.pageSize || 24)));
        setCurrentPage(page);
      }
    } catch (err) {
      toast.error('Lỗi khi tải danh sách media');
    } finally {
      setLoading(false);
    }
  };

  const fetchPurposes = async () => {
    try {
      const res = await adminMediaApi.getPurposes();
      const dbPurposes = res?.data || [];
      const defaultPurposes = ['Logo', 'Banner Trang chủ', 'Ảnh Bài viết', 'Ảnh Sản phẩm', 'Mẫu Email', 'Cài đặt chung'];
      // Merge defaults with DB purposes, ensuring no duplicates
      const combined = [...new Set([...defaultPurposes, ...dbPurposes])];
      setAvailablePurposes(combined);
    } catch (err) {
      // Fallback to defaults if API fails (e.g. backend not restarted yet)
      setAvailablePurposes(['Logo', 'Banner Trang chủ', 'Ảnh Bài viết', 'Ảnh Sản phẩm', 'Mẫu Email', 'Cài đặt chung']);
    }
  };

  useEffect(() => {
    fetchPurposes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter);
      setSelectedFiles([]); // reset selection on filter change
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter]);

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xoá file',
      message: 'Bạn có chắc chắn muốn xoá file này? File sẽ bị xoá khỏi hệ thống và không thể phục hồi.',
      onConfirm: async () => {
        try {
          await adminMediaApi.deleteMedia(id);
          toast.success('Xoá file thành công!');
          fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter);
          setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
        } catch (err) {
          toast.error('Lỗi khi xoá file');
        }
      }
    });
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

  const handleScanOrphans = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Quét ảnh rác hệ thống',
      message: 'Quá trình quét rác sẽ kiểm tra toàn bộ dữ liệu trong hệ thống (Sản phẩm, Cấu hình, Email...). Bạn có muốn tiếp tục?',
      onConfirm: async () => {
        try {
          setScanning(true);
          const res = await adminMediaApi.scanOrphans();
          toast.success(res.message || 'Quét rác hoàn tất.');
          fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter);
        } catch (err) {
          toast.error('Có lỗi xảy ra khi quét rác.');
        } finally {
          setScanning(false);
        }
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedFiles.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: `Xác nhận xoá ${selectedFiles.length} file`,
      message: 'Các file đã chọn sẽ bị xoá vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?',
      onConfirm: async () => {
        try {
          await adminMediaApi.deleteMultiple(selectedFiles);
          toast.success(`Đã xoá ${selectedFiles.length} file thành công!`);
          fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter);
          setSelectedFiles([]);
        } catch (err) {
          toast.error('Lỗi khi xoá hàng loạt file');
        }
      }
    });
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

  const handleUploadModalOpen = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (!uploadedFiles.length) return;

    const invalidFile = uploadedFiles.find(f => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024);
    if (invalidFile) {
      toast.error('Chỉ hỗ trợ file hình ảnh và kích thước dưới 5MB');
      return;
    }

    setUploadModal({ 
      isOpen: true, 
      files: uploadedFiles, 
      bucket: bucketFilter || 'ecommerce-general', 
      usedIn: '' 
    });
    e.target.value = ''; // reset input
  };

  const confirmUpload = async () => {
    try {
      setUploading(true);
      const targetBucket = uploadModal.bucket.replace('ecommerce-', '') || 'general';
      await adminMediaApi.uploadMultiple(uploadModal.files, targetBucket, uploadModal.usedIn);
      toast.success('Upload ảnh thành công!');
      fetchMedia(1, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter);
      fetchPurposes();
      setCurrentPage(1);
      setUploadModal({ isOpen: false, files: [], bucket: 'ecommerce-general', usedIn: '' });
    } catch (err) {
      toast.error('Lỗi khi upload ảnh');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelectFile = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (files.length === 0) return;
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f.id));
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Thư Viện Media</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tất cả hình ảnh và file đã tải lên hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleScanOrphans}
            disabled={scanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              scanning ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            {scanning ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div> : <FiSearch />}
            {scanning ? 'Đang quét...' : 'Quét dọn rác'}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {files.length > 0 && (
              <button
                onClick={handleSelectAll}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                  selectedFiles.length === files.length && files.length > 0
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-4 h-4 rounded border flex items-center justify-center transition-colors">
                  {selectedFiles.length === files.length && files.length > 0 ? (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
                  ) : null}
                </div>
                Chọn tất cả
              </button>
            )}

            {selectedFiles.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <FiTrash2 />
                Xoá ({selectedFiles.length})
              </button>
            )}
            
            <label className="flex items-center gap-2 px-4 py-2 bg-[#b5624a] hover:bg-[#8e4a36] text-white rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm">
              <FiUpload />
              Tải ảnh lên
              <input 
                type="file" 
                onChange={handleUploadModalOpen} 
                accept="image/*" 
                multiple
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên file..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-gray-50"
            />
          </div>

          <div className="relative w-full sm:w-40">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-gray-50"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="size_desc">Nặng nhất</option>
              <option value="name_asc">Tên (A-Z)</option>
            </select>
          </div>

          <div className="relative w-full sm:w-40">
            <select
              value={bucketFilter}
              onChange={handleBucketChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-gray-50"
            >
              <option value="">Bucket: Tất cả</option>
              <option value="ecommerce-products">Products</option>
              <option value="ecommerce-blogs">Blogs</option>
              <option value="ecommerce-banners">Banners</option>
              <option value="ecommerce-general">General</option>
            </select>
          </div>

          <div className="relative w-full sm:w-44">
            <select
              value={isOrphanedFilter}
              onChange={(e) => { setIsOrphanedFilter(e.target.value); setCurrentPage(1); }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-gray-50 ${isOrphanedFilter === 'true' ? 'border-red-400 text-red-600 font-medium' : 'border-gray-200'}`}
            >
              <option value="">Trạng thái: Tất cả</option>
              <option value="false">Ảnh đang sử dụng</option>
              <option value="true">Ảnh rác (Orphaned)</option>
            </select>
          </div>
          
          <div className="relative w-full sm:w-44">
            <select
              value={usedInFilter}
              onChange={(e) => { setUsedInFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b5624a] bg-gray-50"
            >
              <option value="">Mục đích: Tất cả</option>
              {availablePurposes.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => fetchMedia(currentPage, bucketFilter, searchTerm, sortOrder, usedInFilter, isOrphanedFilter)}
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors bg-white"
            title="Làm mới"
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </div>

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
                  <div className="aspect-square bg-gray-200 relative overflow-hidden cursor-pointer" onClick={() => setPreviewFile(file)}>
                    <img 
                      src={file.url} 
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 z-20">
                      <input 
                        type="checkbox" 
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleSelectFile(file.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 text-[#b5624a] focus:ring-[#b5624a] cursor-pointer"
                      />
                    </div>
                    {file.isOrphaned && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                        <FiTrash2 size={10}/> Rác
                      </div>
                    )}
                    <div 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 cursor-pointer" 
                      onClick={() => setPreviewFile(file)}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-green-600 shadow-sm transform hover:scale-110 transition-all"
                        title="Xem trước ảnh"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-[#b5624a] shadow-sm transform hover:scale-110 transition-all"
                        title="Copy Link"
                      >
                        <FiCopy size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(file.url, file.fileName); }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm transform hover:scale-110 transition-all"
                        title="Tải xuống"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 shadow-sm transform hover:scale-110 transition-all"
                        title="Xóa File"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-800 truncate mb-2" title={file.fileName}>
                      {file.fileName}
                    </p>
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

      <MediaPreviewModal 
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
        formatFileSize={formatFileSize}
        getBucketLabel={getBucketLabel}
      />
      {/* Upload Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tải ảnh lên ({uploadModal.files.length} file)</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Bucket (Loại ảnh)</label>
              <select
                value={uploadModal.bucket}
                onChange={(e) => setUploadModal({ ...uploadModal, bucket: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b5624a]"
              >
                <option value="ecommerce-products">Sản phẩm</option>
                <option value="ecommerce-blogs">Bài viết</option>
                <option value="ecommerce-banners">Banners</option>
                <option value="ecommerce-general">Thư viện chung</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mục đích sử dụng (Tùy chọn)</label>
              <input
                type="text"
                value={uploadModal.usedIn}
                onChange={(e) => setUploadModal({ ...uploadModal, usedIn: e.target.value })}
                placeholder="VD: Logo, Banner Khuyến mãi, Tùy ý..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-[#b5624a]"
              />
              <div className="flex flex-wrap gap-2">
                {availablePurposes.map(f => (
                  <button
                    key={f}
                    onClick={() => setUploadModal({ ...uploadModal, usedIn: f })}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                disabled={uploading}
                onClick={() => setUploadModal({ isOpen: false, files: [], bucket: 'ecommerce-general', usedIn: '' })}
                className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Huỷ
              </button>
              <button
                disabled={uploading}
                onClick={confirmUpload}
                className={`flex items-center gap-2 px-4 py-2 text-sm bg-[#b5624a] text-white font-medium rounded-lg transition-colors ${uploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#8e4a36]'}`}
              >
                {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FiUpload />}
                {uploading ? 'Đang tải lên...' : 'Xác nhận Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  setConfirmModal({ ...confirmModal, isOpen: false });
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
