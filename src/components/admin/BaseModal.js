import { 
  X, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const BaseModal = ({ 
  // Required props
  isOpen,
  onClose,
  title,
  children,
  
  // Size variants
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  
  // Modal type (for icon)
  type = 'default', // 'default' | 'info' | 'success' | 'warning' | 'danger'
  
  // Header options
  showHeader = true,
  showCloseButton = true,
  showIcon = false,
  
  // Footer options
  showFooter = false,
  footerContent,
  
  // Action buttons
  primaryAction,
  secondaryAction,
  dangerAction,
  
  // Behavior
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventClose = false,
  
  // Styling
  className = '',
  overlayClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  
  // Animation
  animation = 'fade', // 'fade' | 'slide-up' | 'slide-down' | 'scale'
  animationDuration = 300,
  
  // Callbacks
  onAfterOpen,
  onAfterClose,
  
  // Focus management
  initialFocusRef,
  finalFocusRef
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  // Type classes and icons
  const typeConfig = {
    default: {
      icon: null,
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  // Animation classes
  const animationClasses = {
    fade: {
      overlay: isVisible ? 'opacity-100' : 'opacity-0',
      modal: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    },
    'slide-up': {
      overlay: isVisible ? 'opacity-100' : 'opacity-0',
      modal: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    },
    'slide-down': {
      overlay: isVisible ? 'opacity-100' : 'opacity-0',
      modal: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    },
    scale: {
      overlay: isVisible ? 'opacity-100' : 'opacity-0',
      modal: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
    }
  };

  const currentType = typeConfig[type] || typeConfig.default;
  const Icon = showIcon ? currentType.icon : null;
  const currentAnimation = animationClasses[animation] || animationClasses.fade;

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsVisible(true);
      
      // Save previous focus
      previousFocusRef.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus management
      setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
        
        setIsAnimating(false);
        if (onAfterOpen) onAfterOpen();
      }, 10);
    } else {
      setIsAnimating(true);
      setIsVisible(false);
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus
      setTimeout(() => {
        if (finalFocusRef?.current) {
          finalFocusRef.current.focus();
        } else if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
        
        setIsAnimating(false);
        if (onAfterClose) onAfterClose();
      }, animationDuration);
    }
  }, [isOpen, animationDuration, initialFocusRef, finalFocusRef, onAfterOpen, onAfterClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, preventClose, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && closeOnOverlayClick && !preventClose && !isAnimating) {
      onClose();
    }
  };

  // Handle close button
  const handleClose = () => {
    if (!preventClose && !isAnimating) {
      onClose();
    }
  };

  // Render nothing if not open and not animating
  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 transition-opacity duration-${animationDuration} ${
          currentAnimation.overlay
        } ${overlayClassName}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal */}
          <div
            ref={modalRef}
            className={`relative bg-white rounded-2xl shadow-2xl w-full transform transition-all duration-${animationDuration} ${
              currentAnimation.modal
            } ${sizeClasses[size]} ${className}`}
          >
            {/* Header */}
            {showHeader && (
              <div className={`p-6 border-b ${currentType.borderColor} ${headerClassName}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {Icon && showIcon && (
                      <div className={`p-2 rounded-lg ${currentType.bgColor}`}>
                        <Icon className={`w-5 h-5 ${currentType.iconColor}`} />
                      </div>
                    )}
                    <div>
                      <h3
                        id="modal-title"
                        className="text-xl font-bold text-gray-900"
                      >
                        {title}
                      </h3>
                      {type !== 'default' && (
                        <p className="text-sm text-gray-600 mt-1">
                          {type === 'info' && 'Information message'}
                          {type === 'success' && 'Success message'}
                          {type === 'warning' && 'Warning message'}
                          {type === 'danger' && 'Error message'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isAnimating}
                      className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div className={`p-6 max-h-[70vh] overflow-y-auto ${bodyClassName}`}>
              {children}
            </div>

            {/* Footer */}
            {(showFooter || primaryAction || secondaryAction || dangerAction || footerContent) && (
              <div className={`p-6 border-t ${currentType.borderColor} ${footerClassName}`}>
                {footerContent ? (
                  footerContent
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    {secondaryAction && (
                      <button
                        type="button"
                        onClick={secondaryAction.onClick}
                        disabled={secondaryAction.disabled || isAnimating}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {secondaryAction.label}
                      </button>
                    )}
                    
                    {dangerAction && (
                      <button
                        type="button"
                        onClick={dangerAction.onClick}
                        disabled={dangerAction.disabled || isAnimating}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {dangerAction.label}
                      </button>
                    )}
                    
                    {primaryAction && (
                      <button
                        type="button"
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.disabled || isAnimating}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {primaryAction.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Default props for better TypeScript/IntelliSense support
BaseModal.defaultProps = {
  size: 'md',
  type: 'default',
  showHeader: true,
  showCloseButton: true,
  showIcon: false,
  showFooter: false,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  preventClose: false,
  animation: 'fade',
  animationDuration: 300
};

export default BaseModal;