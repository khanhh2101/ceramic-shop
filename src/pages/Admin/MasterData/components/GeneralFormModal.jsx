import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import { masterDataApi } from '../api/masterDataApi';
import { getErrorMessage } from '@/utils';

const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all";

export default function GeneralFormModal({ isOpen, onClose, editingItem, selectedMaster, onSuccess }) {
  const [form, setForm] = useState({
    genCd: '', genNameEn: '', genNameVn: '', isActive: true,
    number1: '', number2: '', number3: '',
    decimal1: '', decimal2: '', decimal3: '',
    string1: '', string2: '', string3: '',
    color: '',
    parent: '', seq: 0
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setForm({
        genCd: editingItem.genCd, genNameEn: editingItem.genNameEn, genNameVn: editingItem.genNameVn, isActive: editingItem.isActive,
        number1: editingItem.number1 ?? '', number2: editingItem.number2 ?? '', number3: editingItem.number3 ?? '',
        decimal1: editingItem.decimal1 ?? '', decimal2: editingItem.decimal2 ?? '', decimal3: editingItem.decimal3 ?? '',
        string1: editingItem.string1 ?? '', string2: editingItem.string2 ?? '', string3: editingItem.string3 ?? '',
        color: editingItem.color ?? '',
        parent: editingItem.parent ?? '', seq: editingItem.seq
      });
    } else {
      if (selectedMaster) {
        // Fetch next gen code
        masterDataApi.getNextGenCd(selectedMaster.code)
          .then(res => {
            setForm({
              genCd: res, genNameEn: '', genNameVn: '', isActive: true,
              number1: '', number2: '', number3: '',
              decimal1: '', decimal2: '', decimal3: '',
              string1: '', string2: '', string3: '',
              color: '', parent: '', seq: 0
            });
          })
          .catch(() => {
            setForm({
              genCd: '', genNameEn: '', genNameVn: '', isActive: true,
              number1: '', number2: '', number3: '',
              decimal1: '', decimal2: '', decimal3: '',
              string1: '', string2: '', string3: '',
              color: '', parent: '', seq: 0
            });
          });
      }
    }
  }, [isOpen, editingItem, selectedMaster]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      genCd: parseInt(form.genCd),
      genNameEn: form.genNameEn,
      genNameVn: form.genNameVn,
      isActive: form.isActive,
      number1: form.number1 !== '' ? parseInt(form.number1) : null,
      number2: form.number2 !== '' ? parseInt(form.number2) : null,
      number3: form.number3 !== '' ? parseInt(form.number3) : null,
      decimal1: form.decimal1 !== '' ? parseFloat(form.decimal1) : null,
      decimal2: form.decimal2 !== '' ? parseFloat(form.decimal2) : null,
      decimal3: form.decimal3 !== '' ? parseFloat(form.decimal3) : null,
      string1: form.string1 || null,
      string2: form.string2 || null,
      string3: form.string3 || null,
      color: form.color || null,
      parent: form.parent !== '' ? parseInt(form.parent) : null,
      seq: parseInt(form.seq) || 0
    };

    try {
      if (editingItem) {
        await masterDataApi.updateGeneral(editingItem.genCd, payload);
        toast.success('Cập nhật General Code thành công');
      } else {
        await masterDataApi.createGeneral(selectedMaster.code, payload);
        toast.success('Tạo General Code thành công');
      }
      onSuccess();
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
          {editingItem ? 'Cập nhật Mã Chi Tiết (General)' : `Thêm Mã Chi Tiết cho ${selectedMaster?.name}`}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>

      <div className="overflow-y-auto flex-1 bg-gray-50/30">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Thông tin cơ bản</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mã chi tiết (GenCd) *</label>
                <input type="number" value={form.genCd} onChange={(e) => setForm({ ...form, genCd: e.target.value })}
                  className={inputClass} required disabled={!!editingItem} />
              </div>
              <div className="flex flex-col justify-center">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'left-[22px]' : 'left-0.5'}`}></span>
                  </button>
                  <span className={`text-xs font-medium ${form.isActive ? 'text-green-600' : 'text-gray-500'}`}>{form.isActive ? 'ON' : 'OFF'}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Tiếng Việt *</label>
                <input type="text" value={form.genNameVn} onChange={(e) => setForm({ ...form, genNameVn: e.target.value })}
                  className={inputClass} placeholder="VD: Trắng" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Tiếng Anh *</label>
                <input type="text" value={form.genNameEn} onChange={(e) => setForm({ ...form, genNameEn: e.target.value })}
                  className={inputClass} placeholder="VD: White" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mã Cha (Parent GenCd)</label>
                <input type="number" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}
                  className={inputClass} placeholder="VD: 3000001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Thứ tự hiển thị (Seq)</label>
                <input type="number" value={form.seq} onChange={(e) => setForm({ ...form, seq: e.target.value })}
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Color dedicated block */}
          <div className="bg-white p-4 rounded-xl border border-[#b5624a]/20 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: form.color || '#e5e7eb' }} />
              Màu sắc (Tùy chọn)
            </h4>
            <div className="flex items-center gap-3">
              <label
                className="relative w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer overflow-hidden shadow-md shrink-0 transition-transform hover:scale-105"
                style={{ backgroundColor: form.color || '#ffffff' }}
                title="Nhấn để chọn màu"
              >
                <input
                  type="color"
                  value={form.color || '#ffffff'}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mã Hex</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="#FFFFFF hoặc để trống"
                  className={`${inputClass} font-mono`}
                />
              </div>
              {form.color && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, color: '' })}
                  className="shrink-0 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >Xóa màu</button>
              )}
            </div>
          </div>

          {/* Extended Attributes */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4">Trường mở rộng (Tùy chọn)</h4>
            <div className="grid grid-cols-3 gap-4">
              {/* Strings */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chuỗi (String)</h5>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">String 1</label>
                  <input type="text" value={form.string1} onChange={(e) => setForm({ ...form, string1: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">String 2</label>
                  <input type="text" value={form.string2} onChange={(e) => setForm({ ...form, string2: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">String 3</label>
                  <input type="text" value={form.string3} onChange={(e) => setForm({ ...form, string3: e.target.value })} className={inputClass} />
                </div>
              </div>
              {/* Numbers */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số nguyên (Number)</h5>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Number 1</label>
                  <input type="number" value={form.number1} onChange={(e) => setForm({ ...form, number1: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Number 2</label>
                  <input type="number" value={form.number2} onChange={(e) => setForm({ ...form, number2: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Number 3</label>
                  <input type="number" value={form.number3} onChange={(e) => setForm({ ...form, number3: e.target.value })} className={inputClass} />
                </div>
              </div>
              {/* Decimals */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số thập phân (Decimal)</h5>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Decimal 1</label>
                  <input type="number" step="0.0001" value={form.decimal1} onChange={(e) => setForm({ ...form, decimal1: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Decimal 2</label>
                  <input type="number" step="0.0001" value={form.decimal2} onChange={(e) => setForm({ ...form, decimal2: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Decimal 3</label>
                  <input type="number" step="0.0001" value={form.decimal3} onChange={(e) => setForm({ ...form, decimal3: e.target.value })} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Hủy bỏ</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors">
              {editingItem ? 'Lưu thay đổi' : 'Thêm General Code'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
