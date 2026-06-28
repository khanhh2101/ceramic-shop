import { FiAlertCircle, FiX } from 'react-icons/fi';
import Modal from './Modal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger', // 'danger' or 'success' or 'warning'
  isLoading = false,
  zIndex = 10005
}) {
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          btnBg: 'bg-red-600 hover:bg-red-700',
        };
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          btnBg: 'bg-green-600 hover:bg-green-700',
        };
      case 'warning':
      default:
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          btnBg: 'bg-orange-600 hover:bg-orange-700',
        };
    }
  };

  const colors = getColors();

  return (
    <Modal isOpen={isOpen} onClose={!isLoading ? onClose : () => {}} maxWidth="max-w-md" zIndex={zIndex}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}>
              <FiAlertCircle className={`w-5 h-5 ${colors.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button 
            onClick={!isLoading ? onClose : undefined}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="mt-4 mb-8 pl-13">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${colors.btnBg}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
