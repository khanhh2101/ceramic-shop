import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import mammoth from 'mammoth';
import { marked } from 'marked';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { uploadImageToMinio } from '@/utils/upload';
import { adminBlogApi } from './api/adminBlogApi';
import AdminBlogTable from './components/AdminBlogTable';
import AdminBlogModal from './components/AdminBlogModal';

export default function AdminBlogs() {
    const queryClient = useQueryClient();
    const [categories, setCategories] = useState([]);
    
    const {
        pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
        filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
    } = useSmartFilter({
        status: ''
    });

    const statusFilter = filters.status;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
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
    
    const [gDocUrl, setGDocUrl] = useState('');
    const [isImportingDoc, setIsImportingDoc] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await adminBlogApi.getCategories();
            setCategories(Array.isArray(res) ? res : (res?.data || res?.items || []));
        } catch (error) {
            console.error('Lỗi khi tải danh mục blog', error);
        }
    };

    const invalidateBlogCaches = () => {
        queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
    };

    const { data: blogsData, isLoading: loading } = useQuery({
        queryKey: ['adminBlogs', { searchTerm, pageIndex, pageSize }],
        queryFn: async () => {
            const params = { pageIndex, pageSize, sortBy: 'createdAt', sortDesc: true };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (statusFilter !== '') params.status = parseInt(statusFilter);
            
            const res = await adminBlogApi.getBlogs(params);
            const data = res || res;
            return {
                items: Array.isArray(data) ? data : (data?.data || data?.items || []),
                totalPages: data?.totalPages || 1,
                totalCount: data?.totalCount || 0
            };
        },
        placeholderData: keepPreviousData
    });

    const blogs = blogsData?.items || [];
    const totalPages = blogsData?.totalPages || 1;

    const handleOpenModal = async (blog = null) => {
        if (blog) {
            const toastId = toast.loading('Đang tải chi tiết bài viết...');
            try {
                const res = await adminBlogApi.getBlogDetails(blog.id);
                const fullBlog = res;
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
                await adminBlogApi.updateBlog(editingBlog.id, payload);
                toast.success('Cập nhật bài viết thành công');
            } else {
                await adminBlogApi.createBlog(payload);
                toast.success('Tạo bài viết thành công');
            }
            handleCloseModal();
            invalidateBlogCaches();
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi lưu bài viết');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác.')) {
            try {
                await adminBlogApi.deleteBlog(id);
                toast.success('Xóa bài viết thành công');
                invalidateBlogCaches();
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
            const res = await adminBlogApi.downloadGDoc(gDocUrl);
            await handleDocxBuffer(res, toastId);
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchImmediate();
    };

    return (
        <div className="flex flex-col h-full space-y-4 p-2 relative">
            {/* HEADER */}
            <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Bài viết</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý nội dung bài viết và tin tức</p>
                </div>
                <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
                    Viết bài mới
                </Button>
            </div>

            {/* FILTER & SEARCH */}
            <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FiSearch size={18} />
                    </span>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                        placeholder="Tìm kiếm tiêu đề bài viết..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Specific Filters */}
                <div className="w-full lg:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setFilter('status', e.target.value)}
                        className="w-full lg:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Đã đăng</option>
                        <option value="0">Bản nháp</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button 
                        onClick={handleSearchImmediate}
                        className="flex-1 lg:flex-none bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <FiSearch size={16} />
                        Tìm kiếm
                    </button>
                    <button 
                        onClick={clearFilters}
                        className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        title="Làm mới bộ lọc"
                    >
                        <FiRefreshCw size={16} />
                        Làm mới
                    </button>
                </div>
            </div>

            {/* TABLE & PAGINATION */}
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <AdminBlogTable 
                    blogs={blogs}
                    loading={loading}
                    handleOpenModal={handleOpenModal}
                    handleDelete={handleDelete}
                />

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="flex-none bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
                        <Pagination 
                            currentPage={pageIndex}
                            totalPages={totalPages}
                            onPageChange={(page) => setPageIndex(page)}
                        />
                    </div>
                )}
            </div>

            {/* MODAL */}
            <AdminBlogModal 
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                editingBlog={editingBlog}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                categories={categories}
                gDocUrl={gDocUrl}
                setGDocUrl={setGDocUrl}
                isImportingDoc={isImportingDoc}
                handleImportGDoc={handleImportGDoc}
                fileInputRef={fileInputRef}
                handleImportDocument={handleImportDocument}
                handleThumbnailSelect={handleThumbnailSelect}
            />
        </div>
    );
}
