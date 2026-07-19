import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiSearch, FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import { mediaService } from '@/services/index';
import ImageCropperModal from '@/components/common/ImageCropperModal';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { adminProductApi } from './api/adminProductApi';
import AdminProductTable from './components/AdminProductTable';
import { formatCurrency } from '@/utils';
import AdminProductModal from './components/AdminProductModal';
import { getErrorMessage } from '@/utils';
import { useAdminProducts } from '@/pages/Admin/Products/hooks/useAdminProducts';
import { useCategories, useColors, useTags } from '@/hooks/queries/useMasterData';

export default function AdminProducts() {
    const queryClient = useQueryClient();
    
    const {
        pageIndex, pageSize, searchTerm, searchInput, setSearchInput,
        filters, setFilter, setPageIndex, clearFilters, handleSearchImmediate
    } = useSmartFilter({
        categoryId: '',
        status: ''
    });

    const selectedFilterCategory = filters.categoryId;
    const statusFilter = filters.status;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        stockQuantity: '',
        categoryId: '',
        shortDescription: '',
        description: '',
        specifications: '',
        usageGuide: '',
        material: '',
        tags: [],
        isVisible: true
    });

    const [discountPercent, setDiscountPercent] = useState('');
    const [isOutOfStock, setIsOutOfStock] = useState(false);

    // Media State
    const [existingImages, setExistingImages] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // Cropper State
    const [croppingFile, setCroppingFile] = useState(null);
    const [croppingFileUrl, setCroppingFileUrl] = useState('');

    // Fullscreen Image Viewer
    const [viewingImage, setViewingImage] = useState(null);

    // Color Allocation Modal State
    const [isColorAllocationModalOpen, setIsColorAllocationModalOpen] = useState(false);
    const [colorToAllocate, setColorToAllocate] = useState(null);
    const [unallocatedStockForModal, setUnallocatedStockForModal] = useState(0);

    const { data: categories = [] } = useCategories();
    const { data: masterColors = [] } = useColors();
    const { data: masterTags = [] } = useTags();

    const invalidateProductCaches = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product'] });
    };

    // React Query for Products
    const { data: productsData, isLoading: loading } = useAdminProducts({
        pageIndex,
        pageSize,
        sortBy: 'newest',
        includeHidden: true,
        search: searchTerm.trim() || undefined,
        categoryId: selectedFilterCategory || undefined,
        isVisible: statusFilter !== '' ? statusFilter === 'true' : undefined
    });

    const products = productsData?.items || [];
    const totalPages = productsData?.totalPages || 1;

    const renderCategoryOptions = (cats, level = 0) => {
        if (!Array.isArray(cats)) return [];
        return cats.flatMap(c => {
            const prefix = level > 0 ? '\u00A0\u00A0\u00A0\u00A0'.repeat(level) + '↳ ' : '';
            const option = <option key={c.id} value={c.id}>{prefix}{c.name}</option>;
            if (c.children && c.children.length > 0) {
                return [option, ...renderCategoryOptions(c.children, level + 1)];
            }
            return [option];
        });
    };



    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Sản phẩm sẽ bị xóa khỏi cửa hàng và ảnh sẽ bị xóa khỏi hệ thống.')) {
            try {
                await adminProductApi.deleteProduct(id);
                toast.success('Xóa sản phẩm thành công');
                invalidateProductCaches();
            } catch (err) {
                toast.error('Lỗi khi xóa sản phẩm');
            }
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            const res = await adminProductApi.toggleVisibility(id);
            toast.success(res.message || 'Chuyển trạng thái thành công');
            invalidateProductCaches();
        } catch (err) {
            toast.error('Lỗi khi chuyển trạng thái');
        }
    };

    const handleOpenModal = async (product = null) => {
        if (product) {
            try {
                const res = await adminProductApi.getProductDetails(product.id);
                const p = res.data || res;
                setEditingProduct(p);
                let initialTags = [];
                if (p.tags && Array.isArray(p.tags)) {
                    initialTags = p.tags.map(t => t.id);
                }

                setFormData({
                    id: p.id,
                    code: p.code,
                    name: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice || '',
                    stockQuantity: p.stockQuantity,
                    categoryId: p.categoryId,
                    shortDescription: p.shortDescription || '',
                    description: p.description || '',
                    specifications: p.specifications || '',
                    usageGuide: p.usageGuide || '',
                    material: p.material || '',
                    tags: initialTags,
                    colors: p.colors ? p.colors.filter(c => c.id !== 0) : [],
                    isVisible: p.isVisible !== undefined ? p.isVisible : true
                });
                if (p.oldPrice && p.oldPrice > p.price) {
                    const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
                    setDiscountPercent(discount);
                } else {
                    setDiscountPercent('');
                }

                setIsOutOfStock(p.stockQuantity <= 0);
                setExistingImages(p.images || []);
            } catch (err) {
                toast.error('Không tải được thông tin sản phẩm');
                return;
            }
        } else {
            setEditingProduct(null);
            setFormData({
                shortDescription: '', description: '', specifications: '', usageGuide: '', material: '', tags: [], colors: [], isVisible: true
            });
            setDiscountPercent('');
            setIsOutOfStock(false);
            setExistingImages([]);
        }
        setUploadFiles([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // Image Cropping Logic
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setCroppingFile(file);
            setCroppingFileUrl(url);
            e.target.value = null;
        }
    };

    const handleCropDone = (croppedBlob) => {
        const file = new File([croppedBlob], croppingFile.name, { type: 'image/jpeg' });
        const url = URL.createObjectURL(file);
        setUploadFiles(prev => [...prev, file]);
        setPreviewUrls(prev => [...prev, url]);
        setCroppingFile(null);
        setCroppingFileUrl('');
    };

    const handleCropCancel = () => {
        setCroppingFile(null);
        setCroppingFileUrl('');
    };

    const removeUploadFile = (index) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetPrimaryImage = async (imageId) => {
        if (!editingProduct) return;
        try {
            await adminProductApi.setPrimaryImage(editingProduct.id, imageId);
            toast.success('Đã đặt làm ảnh chính');
            setExistingImages(prev => prev.map(img => ({
                ...img,
                isPrimary: img.id === imageId
            })));
        } catch (err) {
            toast.error('Lỗi khi đặt ảnh chính');
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!editingProduct) return;
        if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi sản phẩm?')) {
            try {
                await adminProductApi.deleteImage(editingProduct.id, imageId);
                toast.success('Xóa ảnh thành công');
                setExistingImages(prev => {
                    const newImages = prev.filter(img => img.id !== imageId);
                    if (prev.find(i => i.id === imageId)?.isPrimary && newImages.length > 0) {
                        handleOpenModal(editingProduct);
                    }
                    return newImages;
                });
            } catch (err) {
                toast.error('Lỗi khi xóa ảnh');
            }
        }
    };

    const handleDiscountChange = (e) => {
        const val = e.target.value;
        setDiscountPercent(val);

        if (val && formData.oldPrice) {
            const percent = parseFloat(val);
            const oldPrice = parseFloat(formData.oldPrice);
            if (!isNaN(percent) && !isNaN(oldPrice)) {
                const newPrice = oldPrice - (oldPrice * percent / 100);
                setFormData(prev => ({ ...prev, price: Math.round(newPrice) }));
            }
        }
    };

    const handleOldPriceChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, oldPrice: val }));

        if (discountPercent && val) {
            const percent = parseFloat(discountPercent);
            const oldPrice = parseFloat(val);
            if (!isNaN(percent) && !isNaN(oldPrice)) {
                const newPrice = oldPrice - (oldPrice * percent / 100);
                setFormData(prev => ({ ...prev, oldPrice: val, price: Math.round(newPrice) }));
            }
        }
    };



    const toggleTag = (tagId) => {
        setFormData(prev => {
            const isSelected = prev.tags.includes(tagId);
            if (isSelected) {
                return { ...prev, tags: prev.tags.filter(t => t !== tagId) };
            } else {
                return { ...prev, tags: [...prev.tags, tagId] };
            }
        });
    };

    const toggleColor = (colorItem) => {
        setFormData(prev => {
            const colors = prev.colors || [];
            const isSelected = colors.some(c => c.id === colorItem.id);
            
            if (isSelected) {
                return { ...prev, colors: colors.filter(c => c.id !== colorItem.id) };
            } else {
                // Tính toán số lượng tồn kho chưa phân bổ
                const totalAllocated = colors.reduce((sum, c) => sum + (c.stockQuantity || 0), 0);
                const unallocated = (prev.stockQuantity || 0) - totalAllocated;
                
                // Nếu có tồn kho chưa phân bổ, mở Modal
                if (unallocated > 0) {
                    setColorToAllocate(colorItem);
                    setUnallocatedStockForModal(unallocated);
                    setIsColorAllocationModalOpen(true);
                    return prev; // Không update state ngay
                }
                
                // Nếu không có tồn kho chưa phân bổ, thêm bình thường với số lượng 0
                return { ...prev, colors: [...colors, { ...colorItem, stockQuantity: 0 }] };
            }
        });
    };

    const handleConfirmColorAllocation = (quantity) => {
        if (colorToAllocate) {
            setFormData(prev => {
                const colors = prev.colors || [];
                return { ...prev, colors: [...colors, { ...colorToAllocate, stockQuantity: quantity }] };
            });
        }
        setIsColorAllocationModalOpen(false);
        setColorToAllocate(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.categoryId) {
            toast.error('Vui lòng điền các trường bắt buộc');
            return;
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
            stockQuantity: parseInt(formData.stockQuantity) || 0,
            categoryId: parseInt(formData.categoryId),
            shortDescription: formData.shortDescription,
            description: formData.description,
            specifications: formData.specifications,
            usageGuide: formData.usageGuide,
            material: formData.material,
            colors: formData.colors,
            tags: formData.tags,
            isVisible: formData.isVisible
        };

        try {
            let productId = null;
            if (editingProduct) {
                await adminProductApi.updateProduct(editingProduct.id, payload);
                productId = editingProduct.id;
                toast.success('Cập nhật thành công');
            } else {
                const res = await adminProductApi.createProduct(payload);
                productId = res?.data?.id || res?.data?.Id || res?.id || res?.Id;
                toast.success('Thêm sản phẩm thành công');
            }

            if (uploadFiles.length > 0 && productId) {
                await mediaService.uploadProductImages(productId, uploadFiles);
                toast.success('Tải ảnh mới lên thành công');
            }

            handleCloseModal();
            invalidateProductCaches();
        } catch (err) {
            console.error('Lỗi khi lưu sản phẩm:', err);
            /* toast handled by api */
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
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Sản phẩm</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý danh mục sản phẩm của cửa hàng</p>
                </div>
                <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
                    Thêm sản phẩm mới
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
                
                {/* Specific Filters */}
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <select
                        value={selectedFilterCategory}
                        onChange={(e) => setFilter('categoryId', e.target.value)}
                        className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
                    >
                        <option value="">Tất cả danh mục</option>
                        {renderCategoryOptions(categories)}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setFilter('status', e.target.value)}
                        className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã ẩn</option>
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

            {/* PRODUCTS TABLE & PAGINATION */}
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <AdminProductTable 
                    products={products}
                    loading={loading}
                    handleToggleVisibility={handleToggleVisibility}
                    handleOpenModal={handleOpenModal}
                    handleDelete={handleDelete}
                    formatCurrency={formatCurrency}
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

            {/* CROPPER MODAL */}
            {croppingFile && (
                <ImageCropperModal
                    imageSrc={croppingFileUrl}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}

            {/* MAIN FORM MODAL */}
            <AdminProductModal 
                state={{
                    isModalOpen,
                    editingProduct,
                    formData,
                    discountPercent,
                    isOutOfStock,
                    existingImages,
                    previewUrls,
                    isColorAllocationModalOpen,
                    colorToAllocate,
                    unallocatedStockForModal
                }}
                config={{
                    masterTags,
                    categories,
                    masterColors,
                    renderCategoryOptions
                }}
                methods={{
                    handleCloseModal,
                    setFormData,
                    handleSubmit,
                    handleDiscountChange,
                    handleOldPriceChange,
                    setIsOutOfStock,
                    toggleTag,
                    toggleColor,
                    handleFileSelect,
                    removeUploadFile,
                    setViewingImage,
                    handleSetPrimaryImage,
                    handleDeleteImage,
                    setIsColorAllocationModalOpen,
                    handleConfirmColorAllocation
                }}
            />

            {/* FULLSCREEN IMAGE VIEWER */}
            <Modal 
                isOpen={!!viewingImage} 
                onClose={() => setViewingImage(null)}
                backdropClassName="bg-black/90 backdrop-blur-sm"
                contentClassName="relative w-auto flex items-center justify-center"
                zIndex={10010}
            >
                <button
                    className="absolute -top-12 right-0 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
                    onClick={() => setViewingImage(null)}
                >
                    <FiX size={24} />
                </button>
                <img
                    src={viewingImage}
                    alt="Fullscreen"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in-up"
                    onClick={(e) => e.stopPropagation()}
                />
            </Modal>
        </div>
    );
}
