import { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import Modal from '@/components/common/Modal';

export default function ColorAllocationModal({
    isOpen,
    onClose,
    color,
    maxStock,
    onConfirm
}) {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setQuantity(maxStock); // Mặc định gán toàn bộ số dư cho tiện
        }
    }, [isOpen, maxStock]);

    if (!color) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative z-[99999] animate-fade-in-up"
            zIndex={99999}
        >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                    Phân bổ tồn kho cũ
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                    <FiX size={20} />
                </button>
            </div>
            <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Bạn đang thêm màu <strong className="text-gray-900">{color.name}</strong>. 
                    Sản phẩm hiện còn <strong className="text-red-500">{maxStock}</strong> tồn kho chưa phân loại. 
                    Bạn muốn chuyển bao nhiêu sản phẩm vào màu này?
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Số lượng (Tối đa: {maxStock})
                    </label>
                    <input
                        type="number"
                        min="0"
                        max={maxStock}
                        value={quantity}
                        onChange={(e) => {
                            let val = parseInt(e.target.value) || 0;
                            if (val > maxStock) val = maxStock;
                            if (val < 0) val = 0;
                            setQuantity(val);
                        }}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold text-lg rounded-xl py-3 px-4 focus:ring-4 focus:bg-white focus:ring-[#b5624a]/10 focus:border-[#b5624a] outline-none transition-all text-center"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onConfirm(quantity)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#b5624a] hover:bg-[#9a513d] transition-colors flex items-center gap-2"
                    >
                        <FiCheck size={16} /> Xác nhận
                    </button>
                </div>
            </div>
        </Modal>
    );
}
