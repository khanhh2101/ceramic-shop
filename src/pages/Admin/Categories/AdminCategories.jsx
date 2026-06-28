import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import StatusBadge from '@/components/common/StatusBadge';
import ActionIconButton from '@/components/common/ActionIconButton';
import ImageUpload from '@/components/common/ImageUpload';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', parentId: '', imageUrl: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

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
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name: formData.name,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
          imageUrl: formData.imageUrl
        });
        toast.success('Cập nhật thành công');
      } else {
        await api.post('/categories', {
          name: formData.name,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
          imageUrl: formData.imageUrl
        });
        toast.success('Thêm danh mục thành công');
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục sẽ không có danh mục.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      setUploadingImage(true);
      const res = await api.post('/media/upload?bucket=categories', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: res.data.data.url });
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Danh mục</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục sản phẩm</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => handleOpenModal()}>
          Thêm danh mục mới
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
            placeholder="Tìm kiếm theo tên..."
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
                  <th className="px-6 py-4 font-medium">Tên Danh Mục</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Số Sản Phẩm</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <FiTag size={18} />
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {cat.products?.length || 0} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                        <ActionIconButton 
                          icon={FiEdit2} 
                          onClick={() => handleOpenModal(cat)} 
                          title="Sửa"
                        />
                        <ActionIconButton 
                          icon={FiTrash2} 
                          variant="delete" 
                          onClick={() => handleDelete(cat.id)} 
                          title="Xóa"
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy danh mục nào
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

    </div>
  );
}
