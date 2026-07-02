import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiCheck, FiRefreshCw, FiEye, FiEyeOff, FiUploadCloud, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import { mediaService } from '@/services/index';
import ImageCropperModal from '@/components/common/ImageCropperModal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import StatusBadge from '@/components/common/StatusBadge';
import ActionIconButton from '@/components/common/ActionIconButton';
import ImageUpload from '@/components/common/ImageUpload';
import RichTextEditor from '@/components/common/RichTextEditor';



export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterColors, setMasterColors] = useState([]);
  const [masterTags, setMasterTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');

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
    material: '',
    colors: [],
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [resColor, resTag] = await Promise.all([
        api.get('/master-data/100/generals'),
        api.get('/master-data/200/generals')
      ]);
      const mapMasterData = (items) => items.map(item => ({
        id: item.genCd,
        name: item.genNameVn,
        hexColor: item.color
      }));
      setMasterColors(resColor.data.data ? mapMasterData(resColor.data.data) : []);
      setMasterTags(resTag.data.data ? mapMasterData(resTag.data.data) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', { params: { pageSize: 50, sortBy: 'newest', includeHidden: true } });
      const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.items || []);
      setProducts(items);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const renderCategoryOptions = (cats, level = 0) => {
    return cats.flatMap(c => {
      const prefix = level > 0 ? '\u00A0\u00A0\u00A0\u00A0'.repeat(level) + '↳ ' : '';
      const option = <option key={c.id} value={c.id}>{prefix}{c.name}</option>;
      if (c.children && c.children.length > 0) {
        return [option, ...renderCategoryOptions(c.children, level + 1)];
      }
      return [option];
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Sản phẩm sẽ bị xóa khỏi cửa hàng và ảnh sẽ bị xóa khỏi hệ thống.')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } catch (err) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const res = await api.patch(`/products/${id}/toggle-visibility`);
      toast.success(res.data.message || 'Chuyển trạng thái thành công');
      fetchProducts();
    } catch (err) {
      toast.error('Lỗi khi chuyển trạng thái');
    }
  };

  const handleOpenModal = async (product = null) => {
    if (product) {
      try {
        const res = await api.get(`/products/${product.id}`);
        const p = res.data.data;
        setEditingProduct(p);

        let initialColors = [];
        if (p.colors && Array.isArray(p.colors)) {
          initialColors = p.colors.map(c => c.id);
        }
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
          material: p.material || '',
          colors: initialColors,
          tags: initialTags,
          isVisible: p.isVisible !== undefined ? p.isVisible : true
        });

        // Caculate initial discount if oldPrice exists
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
        shortDescription: '', description: '', specifications: '', material: '', colors: [], tags: [], isVisible: true
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
      await api.put(`/media/product/${editingProduct.id}/images/${imageId}/set-primary`);
      toast.success('Đã đặt làm ảnh chính');
      // Update local state
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
        await api.delete(`/media/product/${editingProduct.id}/images/${imageId}`);
        toast.success('Xóa ảnh thành công');
        // Update local state
        setExistingImages(prev => {
          const newImages = prev.filter(img => img.id !== imageId);
          // If the deleted image was primary, and there are images left, backend auto-assigns primary.
          // For simplicity, we can fetch the product details again to sync.
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

  // Logic: Calculate Price based on Discount Percent
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

  // Logic: Color Picker
  const toggleColor = (colorId) => {
    setFormData(prev => {
      const isSelected = prev.colors.includes(colorId);
      if (isSelected) {
        return { ...prev, colors: prev.colors.filter(c => c !== colorId) };
      } else {
        return { ...prev, colors: [...prev.colors, colorId] };
      }
    });
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

  // Submit
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
      stockQuantity: isOutOfStock ? 0 : (parseInt(formData.stockQuantity) || 0),
      categoryId: parseInt(formData.categoryId),
      shortDescription: formData.shortDescription,
      description: formData.description,
      specifications: formData.specifications,
      material: formData.material,
      colors: formData.colors,
      tags: formData.tags,
      isVisible: formData.isVisible
    };

    try {
      let productId = null;
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        productId = editingProduct.id;
        toast.success('Cập nhật thành công');
      } else {
        const res = await api.post('/products', payload);
        productId = res.data?.data?.id || res.data?.data?.Id || res.data?.id || res.data?.Id;
        toast.success('Thêm sản phẩm thành công');
      }

      if (uploadFiles.length > 0 && productId) {
        await mediaService.uploadProductImages(productId, uploadFiles);
        toast.success('Tải ảnh mới lên thành công');
      }

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory === '' || p.categoryId === Number(selectedFilterCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục sản phẩm của cửa hàng</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex w-full sm:max-w-md gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Tìm kiếm
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
          >
            <option value="">Tất cả danh mục</option>
            {renderCategoryOptions(categories)}
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
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
                  <th className="px-6 py-4 font-medium">Sản Phẩm</th>
                  <th className="px-6 py-4 font-medium">Mã SP</th>
                  <th className="px-6 py-4 font-medium">Danh Mục</th>
                  <th className="px-6 py-4 font-medium">Số Lượng</th>
                  <th className="px-6 py-4 font-medium">Giá Bán</th>
                  <th className="px-6 py-4 font-medium max-w-[200px]">Tags</th>
                  <th className="px-6 py-4 font-medium text-center">Trạng Thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors group ${!product.isVisible ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={product.primaryImageUrl || '/assets/image/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {product.name}
                            {!product.isVisible && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-2">Đang ẩn</span>}
                          </p>
                          <div className="flex gap-2 items-center mt-1">
                            {product.oldPrice > product.price && (
                              <span className="text-[11px] text-red-500 bg-red-50 px-2 py-0.5 rounded font-medium inline-block">
                                Đang giảm giá
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {product.code || '---'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {product.categoryName || 'Không có'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {product.stockQuantity || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                        {product.oldPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {product.tags && product.tags.length > 0 ? (
                          product.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 text-[10px] rounded text-white whitespace-nowrap"
                              style={{ backgroundColor: tag.hexColor || '#9ca3af' }}
                            >
                              {tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">---</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${!product.inStock ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                        <ActionIconButton
                          icon={product.isVisible ? FiEye : FiEyeOff}
                          variant={product.isVisible ? 'toggle-on' : 'toggle-off'}
                          onClick={() => handleToggleVisibility(product.id)}
                          title={product.isVisible ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                        />
                        <ActionIconButton
                          icon={FiEdit2}
                          onClick={() => handleOpenModal(product)}
                          title="Sửa"
                        />
                        <ActionIconButton
                          icon={FiTrash2}
                          variant="delete"
                          onClick={() => handleDelete(product.id)}
                          title="Xóa"
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        contentClassName="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
      >
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900 font-display">
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                {/* Ẩn / Hiện Toggle */}
                <label className="flex items-center cursor-pointer ml-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isVisible ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-xs font-semibold text-gray-700">
                    {formData.isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                  </div>
                </label>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* CỘT TRÁI (Thông tin & Thuộc tính) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Block: Thông tin cơ bản */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Thông tin cơ bản</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã sản phẩm (SKU)</label>
                          <input
                            type="text"
                            value={formData.id ? (formData.code || 'Chưa có mã') : 'Tạo tự động'}
                            className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl py-2.5 px-4 outline-none cursor-not-allowed"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả ngắn gọn</label>
                        <textarea
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                          rows="2"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all resize-none"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả chi tiết</label>
                        <RichTextEditor
                          value={formData.description}
                          onChange={(content) => setFormData({ ...formData, description: content })}
                        />
                      </div>
                    </div>

                    {/* Block: Thuộc tính sản phẩm */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Thuộc tính biến thể</h4>

                      {/* BẢNG MÀU SẮC */}
                      <div>
                        <label className="block  text-sm font-semibold text-gray-700 mb-2">Màu sắc (Color Picker)</label>
                        <div className="flex flex-wrap gap-3">
                          {masterColors.map((color) => {
                            const isSelected = formData.colors.includes(color.id);
                            const hex = color.hexColor || '#FFFFFF';
                            const isLight = hex.toUpperCase() === '#FFFFFF' || hex.toUpperCase() === '#F5F5DC';
                            return (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => toggleColor(color.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${isSelected ? 'border-[#b5624a] bg-[#b5624a]/5 text-[#b5624a]' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                              >
                                <span className={`w-4 h-4 rounded-full border border-gray-200 shadow-sm flex items-center justify-center`} style={{ backgroundColor: hex }}>
                                  {isSelected && <FiCheck size={10} color={isLight ? "black" : "white"} />}
                                </span>
                                {color.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags nổi bật</label>
                          <div className="flex flex-wrap gap-2">
                            {masterTags.map((tag) => {
                              const isSelected = formData.tags.includes(tag.id);
                              return (
                                <button
                                  key={tag.id}
                                  type="button"
                                  onClick={() => toggleTag(tag.id)}
                                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${isSelected ? 'border-[#b5624a] bg-[#b5624a] text-white' : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
                                >
                                  {tag.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chất liệu</label>
                          <input
                            type="text"
                            value={formData.material}
                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                            placeholder="Gốm sứ tráng men..."
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kích thước / Trọng lượng</label>
                        <input
                          type="text"
                          value={formData.specifications}
                          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                          placeholder="10x15cm, 200g"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (Giá, Danh mục, Hình ảnh) */}
                  <div className="space-y-6">
                    {/* Block: Giá & Kho */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                        <h4 className="font-bold text-gray-900">Giá & Tồn kho</h4>
                        {/* Hết hàng Toggle */}
                        <label className="flex items-center cursor-pointer text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                          <input
                            type="checkbox"
                            className="mr-1.5 accent-red-500"
                            checked={isOutOfStock}
                            onChange={(e) => setIsOutOfStock(e.target.checked)}
                          />
                          Hết hàng
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá gốc (VNĐ)</label>
                        <input
                          type="number"
                          value={formData.oldPrice}
                          onChange={handleOldPriceChange}
                          placeholder="VD: 500000"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">% Giảm giá</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={discountPercent}
                              onChange={handleDiscountChange}
                              placeholder="10"
                              min="0"
                              max="100"
                              className="w-full bg-orange-50 border border-orange-200 text-orange-900 font-semibold text-sm rounded-xl py-2.5 pl-4 pr-8 focus:ring-2 focus:bg-white focus:ring-orange-400 outline-none transition-all"
                            />
                            <span className="absolute right-3 top-2.5 text-orange-500 font-bold">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá Bán <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all font-bold"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số lượng tồn kho</label>
                        <input
                          type="number"
                          value={isOutOfStock ? 0 : formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          disabled={isOutOfStock}
                          className={`w-full text-sm rounded-xl py-2.5 px-4 outline-none transition-all border ${isOutOfStock ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:bg-white focus:ring-[#b5624a]'}`}
                        />
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục <span className="text-red-500">*</span></label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:bg-white focus:ring-[#b5624a] outline-none transition-all"
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {renderCategoryOptions(categories)}
                        </select>
                      </div>
                    </div>

                    {/* Block: Hình ảnh */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Hình ảnh sản phẩm</h4>

                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img, i) => (
                          <div key={i} className={`aspect-square rounded-lg border-2 overflow-hidden relative group ${img.isPrimary ? 'border-yellow-400' : 'border-gray-200'}`}>
                            <img
                              src={img.url}
                              alt="existing"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setViewingImage(img.url)}
                            />
                            {img.isPrimary && (
                              <div className="absolute top-1 left-1 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                Ảnh chính
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingImage(img.url)}
                                className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full transition-colors"
                                title="Xem lớn"
                              >
                                <FiEye size={14} />
                              </button>
                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(img.id)}
                                  className="p-1.5 bg-white/20 hover:bg-yellow-400 text-white rounded-full transition-colors"
                                  title="Đặt làm ảnh chính"
                                >
                                  <FiStar size={14} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors"
                                title="Xóa ảnh"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {previewUrls.map((url, i) => (
                          <div key={`new-${i}`} className="aspect-square rounded-lg border-2 border-[#b5624a]/30 overflow-hidden relative group">
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadFile(i)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                            >
                              <FiX size={12} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-[#b5624a] text-white text-[10px] text-center py-0.5">Mới</div>
                          </div>
                        ))}

                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#b5624a] hover:bg-[#b5624a]/5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                          <FiPlus className="text-gray-400 group-hover:text-[#b5624a] mb-1" size={24} />
                          <span className="text-[10px] text-gray-500 group-hover:text-[#b5624a] font-medium">Thêm ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                            onClick={(e) => { e.target.value = null; }}
                          />
                        </label>
                      </div>

                      <p className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-lg mt-2">
                        <FiImage className="inline mr-1" />
                        Nên sử dụng ảnh vuông (1:1). Bạn sẽ được cắt ảnh chuẩn ngay sau khi chọn file.
                      </p>
                    </div>

                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white z-10 shadow-sm">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="productForm"
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors shadow-lg shadow-[#b5624a]/30"
              >
                {editingProduct ? 'Lưu cập nhật' : 'Đăng sản phẩm'}
              </button>
            </div>

      </Modal>

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
