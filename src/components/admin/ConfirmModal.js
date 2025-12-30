'use client';
import BaseModal from './BaseModal';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      showIcon={true}
      size="sm"
      primaryAction={{
        label: confirmText,
        onClick: onConfirm,
        disabled: isLoading
      }}
      secondaryAction={{
        label: cancelText,
        onClick: onClose,
        disabled: isLoading
      }}
      preventClose={isLoading}
    >
      <div className="py-4">
        <p className="text-gray-700">{message}</p>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;