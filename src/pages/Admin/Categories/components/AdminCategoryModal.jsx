import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import ImageUpload from '@/components/common/ImageUpload';

export default function AdminCategoryModal({
    isModalOpen,
    handleCloseModal,
    editingCategory,
    formData,
    setFormData,
    handleSubmit,
    categories,
    loading,
    handleImageUpload
}) {
    return (
        <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            contentClassName="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
        >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 font-display">
                    {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label="Tên danh mục"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Vd: Lọ hoa, Chén đĩa..."
                    required
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                    <select
                        value={formData.parentId}
                        onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
                    >
                        <option value="">-- Không có --</option>
                        {categories.map(c => (
                            c.id !== editingCategory?.id && (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            )
                        ))}
                    </select>
                </div>
                <div>
                    <ImageUpload 
                        label="Ảnh đại diện"
                        previewUrl={formData.imageUrl}
                        onImageSelect={(file) => {
                            const e = { target: { files: [file] } };
                            handleImageUpload(e);
                        }}
                        onClearImage={() => setFormData({...formData, imageUrl: ''})}
                        height="h-32"
                    />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary" isLoading={loading}>
                        {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
