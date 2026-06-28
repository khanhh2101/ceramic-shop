import { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import { marked } from 'marked';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFileText, FiCheckCircle, FiClock, FiX, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import Button from '@/components/common/Button';
import ActionIconButton from '@/components/common/ActionIconButton';
import ImageUpload from '@/components/common/ImageUpload';
import RichTextEditor from '@/components/common/RichTextEditor';
import { uploadImageToMinio } from '@/utils/upload';
import { categoryService } from '@/services';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 0, // 0: Draft, 1: Published
    metaTitle: '',
    metaDescription: '',
    authorName: '',
    publishedAt: '',
    thumbnailUrl: '',
    isPinned: false,
    categoryId: ''
  });
  
  const [gDocUrl, setGDocUrl] = useState('');
  const [isImportingDoc, setIsImportingDoc] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/master-data/300/generals');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục blog', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/articles', { params: { publishedOnly: false } });
      setBlogs(Array.isArray(res.data.data) ? res.data.data : res.data.data?.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (blog = null) => {
    if (blog) {
      const toastId = toast.loading('Đang tải chi tiết bài viết...');
      try {
        const res = await api.get(`/articles/${blog.id}`);
        const fullBlog = res.data.data;
        setEditingBlog(fullBlog);
        setFormData({
          title: fullBlog.title || '',
          summary: fullBlog.summary || '',
          content: fullBlog.contentHtml || '',
          tags: fullBlog.tags ? fullBlog.tags.join(', ') : '',
          status: fullBlog.isPublished ? 1 : 0,
          metaTitle: fullBlog.metaTitle || '',
          metaDescription: fullBlog.metaDescription || '',
          authorName: fullBlog.authorName || '',
          publishedAt: fullBlog.publishedAt ? new Date(fullBlog.publishedAt).toISOString().split('T')[0] : '',
          thumbnailUrl: fullBlog.thumbnailUrl || '',
          isPinned: fullBlog.isPinned || false,
          categoryId: fullBlog.categoryIds && fullBlog.categoryIds.length > 0 ? fullBlog.categoryIds[0] : ''
        });
        toast.dismiss(toastId);
      } catch (error) {
        console.error(error);
        toast.error('Lỗi tải chi tiết bài viết', { id: toastId });
        return;
      }
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        summary: '',
        content: '',
        tags: '',
        status: 0,
        metaTitle: '',
        metaDescription: '',
        authorName: '',
        publishedAt: '',
        thumbnailUrl: '',
        isPinned: false,
        categoryId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    const payload = {
      title: formData.title,
      summary: formData.summary,
      contentHtml: formData.content,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isPublished: parseInt(formData.status) === 1,
      isPinned: formData.isPinned,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      authorName: formData.authorName,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
      thumbnailUrl: formData.thumbnailUrl
    };

    try {
      if (editingBlog) {
        await api.put(`/articles/${editingBlog.id}`, payload);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await api.post('/articles', payload);
        toast.success('Tạo bài viết thành công');
      }
      handleCloseModal();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu bài viết');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác.')) {
      try {
        await api.delete(`/articles/${id}`);
        toast.success('Xóa bài viết thành công');
        fetchBlogs();
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi xóa bài viết');
      }
    }
  };

  const handleDocxBuffer = async (arrayBuffer, toastId) => {
    try {
      setIsImportingDoc(true);
      const options = {
        convertImage: mammoth.images.imgElement(function(image) {
          return image.read("base64").then(async function(imageBuffer) {
            const byteString = atob(imageBuffer);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: image.contentType });
            const file = new File([blob], `docx-img-${Date.now()}.${image.contentType.split('/')[1] || 'png'}`, { type: image.contentType });
            
            try {
              const minioUrl = await uploadImageToMinio(file);
              return { src: minioUrl };
            } catch (e) {
              console.error(e);
              return { src: "data:" + image.contentType + ";base64," + imageBuffer };
            }
          });
        })
      };

      const result = await mammoth.convertToHtml({ arrayBuffer }, options);
      setFormData(prev => ({ ...prev, content: result.value }));
      toast.success('Nhập file Word thành công', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi phân tích file Word', { id: toastId });
    } finally {
      setIsImportingDoc(false);
    }
  };

  const handleImportDocument = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Đang xử lý file...');
    setIsImportingDoc(true);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        await handleDocxBuffer(arrayBuffer, toastId);
      } else if (file.name.endsWith('.md')) {
        const text = await file.text();
        const html = marked.parse(text);
        setFormData(prev => ({ ...prev, content: html }));
        toast.success('Nhập file Markdown thành công', { id: toastId });
      } else {
        toast.error('Chỉ hỗ trợ file .docx và .md', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi đọc file', { id: toastId });
    } finally {
      setIsImportingDoc(false);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportGDoc = async () => {
    if (!gDocUrl) return;
    const toastId = toast.loading('Đang xử lý Google Docs...');
    setIsImportingDoc(true);
    try {
      const res = await api.get('/media/download-gdoc', {
        params: { url: gDocUrl },
        responseType: 'arraybuffer'
      });
      await handleDocxBuffer(res.data, toastId);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải Google Docs (Kiểm tra quyền Public của link)', { id: toastId });
    } finally {
      setIsImportingDoc(false);
    }
  };

  const handleThumbnailSelect = async (file) => {
    const toastId = toast.loading('Đang tải ảnh lên...');
    try {
      const url = await uploadImageToMinio(file);
      setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      toast.success('Tải ảnh thành công', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải ảnh', { id: toastId });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xuất bản';
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Bài viết</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý nội dung bài viết và tin tức</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
          Viết bài mới
        </Button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
            placeholder="Tìm kiếm tiêu đề bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Tiêu đề</th>
                  <th className="px-6 py-4 font-medium">Danh mục</th>
                  <th className="px-6 py-4 font-medium">Tác giả</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium">Ngày xuất bản</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#b5624a]/10 flex items-center justify-center text-[#b5624a] flex-shrink-0">
                          <FiFileText size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{blog.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {blog.categoryName ? (
                        <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                          {blog.categoryName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {blog.authorName}
                    </td>
                    <td className="px-6 py-4">
                      {blog.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <FiCheckCircle size={12} /> Đã xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                          <FiClock size={12} /> Bản nháp
                        </span>
                      )}
                      {blog.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 mt-1 block w-fit">
                          📌 Đã ghim
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(blog.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                        <ActionIconButton 
                          icon={FiEdit2} 
                          onClick={() => handleOpenModal(blog)} 
                          title="Sửa"
                        />
                        <ActionIconButton 
                          icon={FiTrash2} 
                          variant="delete" 
                          onClick={() => handleDelete(blog.id)} 
                          title="Xóa"
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy bài viết nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        contentClassName="bg-white rounded-3xl shadow-2xl w-[90vw] max-w-7xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
      >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 font-display">
                {editingBlog ? 'Cập nhật bài viết' : 'Viết bài mới'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cột trái (Nội dung chính) */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        placeholder="Vd: 5 Mẹo trang trí nhà cửa với gốm sứ..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tóm tắt (Summary)</label>
                      <textarea
                        value={formData.summary}
                        onChange={(e) => setFormData({...formData, summary: e.target.value})}
                        rows="3"
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none resize-none"
                        placeholder="Đoạn văn ngắn giới thiệu bài viết..."
                      ></textarea>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-semibold text-gray-900">Nội dung <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2">
                          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <input
                              type="text"
                              value={gDocUrl}
                              onChange={(e) => setGDocUrl(e.target.value)}
                              placeholder="Link Google Docs (đã public)..."
                              className="px-3 py-1.5 text-sm w-48 outline-none"
                              disabled={isImportingDoc}
                            />
                            <button
                              type="button"
                              onClick={handleImportGDoc}
                              disabled={isImportingDoc}
                              className="px-3 py-1.5 bg-[#4285F4] text-white text-xs font-bold hover:bg-[#3367D6] transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                              {isImportingDoc ? 'Đang xử lý...' : 'Import'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImportingDoc}
                            className="text-xs font-bold text-[#b5624a] bg-[#b5624a]/10 px-3 py-1.5 rounded-lg hover:bg-[#b5624a]/20 transition-colors disabled:opacity-50"
                          >
                            {isImportingDoc ? 'Đang xử lý...' : '+ Chọn File (.docx, .md)'}
                          </button>
                        </div>
                        <input
                          type="file"
                          accept=".docx,.md"
                          ref={fileInputRef}
                          onChange={handleImportDocument}
                          className="hidden"
                        />
                      </div>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                      />
                    </div>
                  </div>

                  {/* Cột phải (Cài đặt & SEO) */}
                  <div className="space-y-5">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-5">
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">Xuất bản</h4>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        >
                          <option value="">Chọn danh mục...</option>
                          {categories.map((cat) => (
                            <option key={cat.genCd} value={cat.genCd}>{cat.genNameVn}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.isPinned}
                            onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b5624a]"></div>
                        </label>
                        <span className="text-sm font-semibold text-gray-700">Ghim bài nổi bật</span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        >
                          <option value="0">Bản nháp</option>
                          <option value="1">Xuất bản ngay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (cách nhau bởi dấu phẩy)</label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                          placeholder="gốm sứ, trang trí, tips..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tác giả</label>
                        <input
                          type="text"
                          value={formData.authorName}
                          onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                          placeholder="Tên người viết..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày đăng</label>
                        <input
                          type="date"
                          value={formData.publishedAt}
                          onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        />
                      </div>
                      <ImageUpload
                        label="Ảnh bìa (Thumbnail)"
                        previewUrl={formData.thumbnailUrl}
                        onImageSelect={handleThumbnailSelect}
                        onClearImage={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                        height="h-32"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-5">
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">SEO</h4>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                          rows="3"
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                form="blogForm"
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors"
              >
                {editingBlog ? 'Lưu thay đổi' : 'Tạo bài viết'}
              </button>
            </div>
      </Modal>

    </div>
  );
}
