import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiPlus, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { mediaService } from '@/services/index';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { adminCategoryApi } from './api/adminCategoryApi';
import AdminCategoryTable from './components/AdminCategoryTable';
import AdminCategoryModal from './components/AdminCategoryModal';
import ImageCropperModal from '@/components/common/ImageCropperModal';
import { getErrorMessage } from '@/utils';
import { useAdminCategories } from '@/pages/Admin/Categories/hooks/useAdminCategories';

export default function AdminCategories() {
    const queryClient = useQueryClient();
    const {
        pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
        setPageIndex, clearFilters, handleSearchImmediate
    } = useSmartFilter({});
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', parentId: '', imageUrl: '' });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);

    const invalidateCategoryCaches = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    };

    const { data: categoriesData, isLoading: loading } = useAdminCategories({
        pageIndex,
        pageSize,
        search: searchTerm.trim() || undefined
    });

    const categories = categoriesData?.items || [];
    const totalPages = categoriesData?.totalPages || 1;

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, parentId: category.parentId || '', imageUrl: category.imageUrl || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', parentId: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', parentId: '', imageUrl: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            const payload = {
                name: formData.name,
                parentId: formData.parentId ? parseInt(formData.parentId) : null,
                imageUrl: formData.imageUrl
            };

            if (editingCategory) {
                await adminCategoryApi.updateCategory(editingCategory.id, payload);
                toast.success('Cập nhật thành công');
            } else {
                await adminCategoryApi.createCategory(payload);
                toast.success('Thêm danh mục thành công');
            }
            handleCloseModal();
            invalidateCategoryCaches();
        } catch (err) {
            /* toast handled by api */
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục sẽ không có danh mục.')) {
            try {
                await adminCategoryApi.deleteCategory(id);
                toast.success('Xóa danh mục thành công');
                invalidateCategoryCaches();
            } catch (err) {
                /* toast handled by api */
            }
        }
    };

    const handleFileSelectForCrop = (e) => {
        const file = e.target.files ? e.target.files[0] : e;
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = () => {
            setCropImageSrc(reader.result);
            setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropDone = async (croppedBlob) => {
        setIsCropperOpen(false);
        const file = new File([croppedBlob], `category_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        try {
            setUploadingImage(true);
            const res = await mediaService.upload(file, 'categories', 'Category');
            const url = res.data?.url || res.url;
            
            if (url) {
                setFormData({ ...formData, imageUrl: url });
                toast.success('Tải ảnh lên thành công');
            } else {
                toast.error('Lỗi: Không lấy được URL ảnh');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setUploadingImage(false);
            setCropImageSrc(null);
        }
    };

    const handleCropCancel = () => {
        setIsCropperOpen(false);
        setCropImageSrc(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchImmediate();
    };

    return (
        <div className="flex flex-col h-full space-y-4 p-2 relative">
            {/* HEADER */}
            <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Danh mục</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý danh mục sản phẩm</p>
                </div>
                <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
                    Thêm danh mục mới
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
                        placeholder="Tìm kiếm theo tên..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
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
                <AdminCategoryTable 
                    categories={categories}
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
            <AdminCategoryModal 
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                editingCategory={editingCategory}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                categories={categories}
                loading={uploadingImage}
                handleImageUpload={handleFileSelectForCrop}
            />

            {/* CROPPER MODAL */}
            {isCropperOpen && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
