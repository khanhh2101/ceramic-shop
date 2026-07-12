import { FiX, FiCheck, FiImage, FiPlus, FiEye, FiStar, FiTrash2, FiSearch, FiPackage, FiInfo, FiTag, FiDollarSign } from 'react-icons/fi';
import Modal from '@/components/common/Modal';
import RichTextEditor from '@/components/common/RichTextEditor';
import ColorAllocationModal from './ColorAllocationModal';

export default function AdminProductModal({
    isModalOpen,
    handleCloseModal,
    editingProduct,
    formData,
    setFormData,
    handleSubmit,
    masterTags,
    categories,
    discountPercent,
    handleDiscountChange,
    handleOldPriceChange,
    isOutOfStock,
    setIsOutOfStock,
    toggleTag,
    toggleColor,
    masterColors,
    renderCategoryOptions,
    existingImages,
    previewUrls,
    handleFileSelect,
    removeUploadFile,
    setViewingImage,
    handleSetPrimaryImage,
    handleDeleteImage,
    isColorAllocationModalOpen,
    setIsColorAllocationModalOpen,
    colorToAllocate,
    unallocatedStockForModal,
    handleConfirmColorAllocation
}) {
    return (
        <>
        <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            contentClassName="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
        >
            <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 font-display">
                            {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {editingProduct ? 'Chỉnh sửa thông tin chi tiết của sản phẩm' : 'Nhập thông tin cho sản phẩm mới lên kệ'}
                        </p>
                    </div>
                    
                    <label className="flex items-center cursor-pointer ml-6 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 transition-colors hover:bg-gray-100">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isVisible ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-bold text-gray-700">
                            {formData.isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                        </div>
                    </label>
                </div>
                <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                    <FiX size={24} />
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 custom-scrollbar">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* CỘT TRÁI (Thông tin & Thuộc tính) - Rộng hơn */}
                        <div className="xl:col-span-2 space-y-6">
                            
                            {/* Block: Thông tin cơ bản */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <FiInfo className="text-[#b5624a]" /> Thông Tin Cơ Bản
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mã sản phẩm (SKU)</label>
                                        <input
                                            type="text"
                                            value={formData.id ? (formData.code || 'Chưa có mã') : 'Tạo tự động'}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl py-3 px-4 outline-none cursor-not-allowed"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all"
                                            placeholder="Bình hoa gốm sứ..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả ngắn gọn</label>
                                    <textarea
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        rows="2"
                                        placeholder="Một câu giới thiệu nổi bật về sản phẩm..."
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả chi tiết</label>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#b5624a]/10 focus-within:border-[#b5624a] transition-all">
                                        <RichTextEditor
                                            value={formData.description}
                                            onChange={(content) => setFormData({ ...formData, description: content })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Block: Hình ảnh (Chuyển sang cột trái cho rộng rãi) */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <FiImage className="text-[#b5624a]" /> Hình Ảnh Sản Phẩm
                                </h4>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className={`aspect-square rounded-xl border-2 overflow-hidden relative group ${img.isPrimary ? 'border-yellow-400 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <img
                                                src={img.url}
                                                alt="existing"
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setViewingImage(img.url)}
                                            />
                                            {img.isPrimary && (
                                                <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    Ảnh chính
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewingImage(img.url)}
                                                    className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full transition-colors backdrop-blur-sm"
                                                    title="Xem lớn"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                {!img.isPrimary && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetPrimaryImage(img.id)}
                                                        className="p-1.5 bg-white/20 hover:bg-yellow-400 text-white hover:text-yellow-900 rounded-full transition-colors backdrop-blur-sm"
                                                        title="Đặt làm ảnh chính"
                                                    >
                                                        <FiStar size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(img.id)}
                                                    className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                                                    title="Xóa ảnh"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {previewUrls.map((url, i) => (
                                        <div key={`new-${i}`} className="aspect-square rounded-xl border-2 border-[#b5624a] overflow-hidden relative group">
                                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeUploadFile(i)}
                                                className="absolute top-1.5 right-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm shadow-sm"
                                            >
                                                <FiX size={14} />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-[#b5624a]/90 backdrop-blur-sm text-white font-medium text-[10px] text-center py-1">Mới thêm</div>
                                        </div>
                                    ))}

                                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#b5624a] hover:bg-[#b5624a]/5 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-gray-50">
                                        <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            <FiPlus className="text-gray-400 group-hover:text-[#b5624a]" size={20} />
                                        </div>
                                        <span className="text-[11px] text-gray-500 group-hover:text-[#b5624a] font-bold">Thêm ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                            onClick={(e) => { e.target.value = null; }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI (Giá, Danh mục, Biến thể) */}
                        <div className="space-y-6">
                            
                            {/* Block: Bán hàng & Tồn kho */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <FiDollarSign className="text-[#b5624a]" /> Bán Hàng & Tồn Kho
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giá gốc (VNĐ)</label>
                                        <input
                                            type="number"
                                            value={formData.oldPrice}
                                            onChange={handleOldPriceChange}
                                            placeholder="VD: 500000"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all font-semibold"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">% Giảm giá</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={discountPercent}
                                                    onChange={handleDiscountChange}
                                                    placeholder="10"
                                                    min="0"
                                                    max="100"
                                                    className="w-full bg-orange-50 border border-orange-200 text-orange-900 font-bold text-sm rounded-xl py-3 pl-4 pr-8 focus:ring-4 focus:bg-white focus:ring-orange-400/20 focus:border-orange-400 outline-none transition-all"
                                                />
                                                <span className="absolute right-3 top-3 text-orange-500 font-bold">%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giá Bán <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-gray-50 border border-[#b5624a]/30 text-[#b5624a] text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all font-black"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng tồn kho</label>
                                        </div>
                                        <input
                                            type="number"
                                            value={formData.stockQuantity || 0}
                                            disabled
                                            title="Tồn kho được điều chỉnh thông qua hệ thống Phiếu Nhập Hàng"
                                            className="w-full bg-gray-100 border border-gray-200 text-gray-500 font-bold text-sm rounded-xl py-3 px-4 outline-none cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1.5">
                                            * Tồn kho chỉ được thay đổi tự động thông qua <b>Hóa đơn bán</b> hoặc <b>Phiếu nhập kho</b>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Block: Phân loại & Biến thể */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <FiTag className="text-[#b5624a]" /> Phân Loại & Biến Thể
                                </h4>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Danh mục <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {renderCategoryOptions(categories)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Màu sắc (Chọn các màu áp dụng)</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 min-h-[48px] flex flex-wrap gap-2 items-center">
                                        {masterColors.map((color) => {
                                            const colorsArray = formData.colors || [];
                                            const isSelected = colorsArray.some(c => c.id === color.id);
                                            const existingStock = isSelected ? colorsArray.find(c => c.id === color.id)?.stockQuantity || 0 : 0;
                                            return (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() => toggleColor(color)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all text-xs font-bold ${
                                                        isSelected 
                                                            ? 'bg-white border-[#b5624a] text-[#b5624a] ring-1 ring-[#b5624a]/20' 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.hexColor || '#ccc' }}></span>
                                                    <span>{color.name}</span>
                                                    {isSelected && existingStock > 0 && (
                                                        <span className="text-[10px] font-black text-white bg-[#b5624a] px-1.5 py-0.5 rounded-md ml-1">
                                                            {existingStock}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {masterColors.length === 0 && (
                                            <span className="text-sm text-gray-400 italic">Chưa có dữ liệu màu sắc từ hệ thống</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        * Chọn các màu có sẵn cho sản phẩm này. Số lượng tồn kho cụ thể của từng màu sẽ được cập nhật thông qua Phiếu Nhập Kho.
                                    </p>
                                </div>                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags nổi bật</label>
                                    <div className="flex flex-wrap gap-2">
                                        {masterTags.map((tag) => {
                                            const isSelected = formData.tags.includes(tag.id);
                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => toggleTag(tag.id)}
                                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${isSelected ? 'border-[#b5624a] bg-[#b5624a] text-white shadow-md shadow-[#b5624a]/20' : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-200'}`}
                                                >
                                                    {tag.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Chất liệu</label>
                                        <input
                                            type="text"
                                            value={formData.material}
                                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                            placeholder="Gốm sứ..."
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kích thước</label>
                                        <input
                                            type="text"
                                            value={formData.specifications}
                                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                            placeholder="10x15cm..."
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="px-8 py-5 border-t border-gray-200 flex justify-end gap-4 bg-white z-10 shrink-0">
                <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-8 py-3 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    form="productForm"
                    className="px-10 py-3 text-sm font-bold text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-all shadow-lg shadow-[#b5624a]/30 active:scale-95 flex items-center gap-2"
                >
                    <FiCheck size={18} />
                    {editingProduct ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
                </button>
            </div>
            </Modal>

            <ColorAllocationModal
                isOpen={isColorAllocationModalOpen}
                onClose={() => setIsColorAllocationModalOpen(false)}
                color={colorToAllocate}
                maxStock={unallocatedStockForModal}
                onConfirm={handleConfirmColorAllocation}
            />
        </>
    );
}
