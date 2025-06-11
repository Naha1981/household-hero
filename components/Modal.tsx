
import React, { Fragment } from 'react';
// No external library for Modal, using basic divs.
// For production, consider a library like Headless UI Dialog.

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} transform transition-all`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-neutral hover:text-error transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
    