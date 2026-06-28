import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-2xl', 
  zIndex = 9999, // Sử dụng số để set style inline, tránh lỗi Tailwind không compile
  backdropClassName = 'bg-black/60 backdrop-blur-sm',
  contentClassName = '' 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" 
      style={{ zIndex: typeof zIndex === 'string' ? parseInt(zIndex.replace(/\D/g, '') || '9999', 10) : zIndex }}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity ${backdropClassName}`}
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={contentClassName || `bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up`}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
