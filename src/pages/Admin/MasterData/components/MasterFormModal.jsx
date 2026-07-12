import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import { masterDataApi } from '../api/masterDataApi';
import { getErrorMessage } from '@/utils';

const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all";

export default function MasterFormModal({ isOpen, onClose, editingItem, onSuccess }) {
  const [form, setForm] = useState({ code: '', name: '', seq: 0, isActive: true });

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setForm({
          code: editingItem.code,
          name: editingItem.name,
          seq: editingItem.seq || 0,
          isActive: editingItem.isActive
        });
      } else {
        setForm({ code: '', name: '', seq: 0, isActive: true });
      }
    }
  }, [isOpen, editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await masterDataApi.updateMaster(editingItem.code, {
          name: form.name,
          seq: parseInt(form.seq) || 0,
          isActive: form.isActive
        });
        toast.success('Cập nhật Master Code thành công');
        onSuccess(editingItem); // Keep selection
      } else {
        const res = await masterDataApi.createMaster({
          code: parseInt(form.code),
          name: form.name,
          seq: parseInt(form.seq) || 0,
          isActive: form.isActive
        });
        toast.success('Tạo Master Code thành công');
        onSuccess(res); // Select the newly created master
      }
      onClose();
    } catch (err) {
      /* toast handled by api */
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      contentClassName="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-gray-900 font-display">
          {editingItem ? 'Cập nhật Nhóm (Master)' : 'Thêm Nhóm mới (Master)'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>

      <div className="overflow-y-auto flex-1 bg-gray-50/30">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã Nhóm (Code) *</label>
              <input type="number" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={inputClass} placeholder="VD: 100, 200..." required
                disabled={!!editingItem} />
              <p className="text-[11px] text-gray-500 mt-1.5">Mã không thay đổi được sau khi tạo.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên nhóm *</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass} placeholder="VD: Màu sắc, Địa chỉ..." required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thứ tự hiển thị (Seq)</label>
              <input type="number" value={form.seq}
                onChange={(e) => setForm({ ...form, seq: e.target.value })}
                className={inputClass} />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'left-[26px]' : 'left-0.5'}`}></span>
                </button>
                <span className={`text-sm font-medium ${form.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {form.isActive ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </label>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Hủy bỏ</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors">
              {editingItem ? 'Lưu thay đổi' : 'Thêm Master Code'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
