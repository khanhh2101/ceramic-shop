import { FiX } from 'react-icons/fi';
import Modal from '@/components/common/Modal';
import ImageUpload from '@/components/common/ImageUpload';
import RichTextEditor from '@/components/common/RichTextEditor';

export default function AdminBlogModal({
    isModalOpen,
    handleCloseModal,
    editingBlog,
    formData,
    setFormData,
    handleSubmit,
    categories,
    gDocUrl,
    setGDocUrl,
    isImportingDoc,
    handleImportGDoc,
    fileInputRef,
    handleImportDocument,
    handleThumbnailSelect
}) {
    return (
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
    );
}
