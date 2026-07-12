import React from 'react';
import { AlertOctagon, Package, Hash, Tag, FileText, Check } from 'lucide-react';

export default function InventoryAdjustForm({ products, masterColors, adjustForm, setAdjustForm, onSubmit }) {
  return (
    <div className="bg-white p-8">
      <div className="mb-6 flex flex-col gap-1 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertOctagon className="text-[#b5624a]" />
            Ghi nhận biến động kho
          </h3>
          <p className="text-sm text-gray-500">Tạo phiếu nhập xuất kho thủ công hoặc báo hỏng sản phẩm.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <Package size={14} /> Sản phẩm <span className="text-red-500">*</span>
          </label>
          <select 
            value={adjustForm.productId}
            onChange={(e) => setAdjustForm({...adjustForm, productId: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all"
            required
          >
            <option value="">-- Chọn sản phẩm cần điều chỉnh --</option>
            {products.map(p => {
              const totalStock = p.stockQuantity + (p.colors?.reduce((sum, c) => sum + c.stockQuantity, 0) || 0);
              return (
                <option key={p.id} value={p.id}>{p.code ? `[${p.code}] ` : ''}{p.name} (Tồn tổng: {totalStock})</option>
              );
            })}
          </select>
        </div>

        {(() => {
          const selectedProduct = products.find(p => p.id === Number(adjustForm.productId));
          if (selectedProduct) {
            return (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Màu sắc (Tùy chọn nếu muốn nhập theo màu)
                </label>
                <select 
                  value={adjustForm.colorId}
                  onChange={(e) => setAdjustForm({...adjustForm, colorId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all"
                >
                  <option value="">-- Không màu (Tồn chung: {selectedProduct.stockQuantity}) --</option>
                  {masterColors?.map(c => {
                    const stock = selectedProduct.colors?.find(ac => ac.id === c.id)?.stockQuantity || 0;
                    return (
                      <option key={c.id} value={c.id}>{c.name} (Tồn hiện tại: {stock})</option>
                    );
                  })}
                </select>
              </div>
            );
          }
          return null;
        })()}
        
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Tag size={14} /> Loại giao dịch <span className="text-red-500">*</span>
            </label>
            <select 
              value={adjustForm.type}
              onChange={(e) => setAdjustForm({...adjustForm, type: Number(e.target.value)})}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all appearance-none cursor-pointer"
            >
              <option value={1}>Nhập kho (Tăng tồn)</option>
              <option value={2}>Xuất kho (Giảm tồn)</option>
              <option value={3}>Báo hỏng/vỡ (Trừ tồn)</option>
              <option value={4}>Khách hoàn trả (Tăng tồn)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Hash size={14} /> Số lượng <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              min="1"
              value={adjustForm.quantity}
              onChange={(e) => setAdjustForm({...adjustForm, quantity: e.target.value})}
              className="w-full bg-white border border-[#b5624a]/30 text-[#b5624a] font-black text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <FileText size={14} /> Mã tham chiếu (Tùy chọn)
          </label>
          <input 
            type="text" 
            value={adjustForm.referenceId}
            onChange={(e) => setAdjustForm({...adjustForm, referenceId: e.target.value})}
            placeholder="VD: PO-12345, ORD-9876"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1.5 italic">* Sử dụng để đối soát với Mã đơn hàng hoặc Phiếu nhập hàng</p>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ghi chú</label>
          <textarea 
            value={adjustForm.note}
            onChange={(e) => setAdjustForm({...adjustForm, note: e.target.value})}
            rows="3"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium text-sm rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all resize-none"
            placeholder="Lý do điều chỉnh kho..."
          ></textarea>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3 bg-[#b5624a] text-white font-bold rounded-xl shadow-lg shadow-[#b5624a]/30 hover:bg-[#9a513b] transition-all active:scale-95 flex items-center gap-2"
          >
            <Check size={18} />
            Xác nhận lưu
          </button>
        </div>
      </form>
    </div>
  );
}
