import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface IConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string | JSX.Element;
  description: string;
  confirmText: string;
  cancelText?: string;
  isSingleButton?: boolean;
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText = 'Отменить', // Значение по умолчанию
  isSingleButton = false, // Если true, будет только одна кнопка
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-light-gray-white dark:bg-dark-gray-1 rounded-lg shadow-lg p-6 w-[300px] h-[148px] max-w-sm text-center">
            <Dialog.Title className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
              {title}
            </Dialog.Title>
            <Dialog.Description className="font-gerbera-h3 text-light-gray-4 dark:text-dark-gray-4 mt-2">
              {description}
            </Dialog.Description>
            <div className="flex justify-center mt-4 space-x-4">
              {/* Кнопка подтверждения */}
              <button
                onClick={onConfirm}
                className="bg-light-brand-green text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-700 btn-S-GreenDefault"
              >
                {confirmText}
              </button>

              {/* Отображаем кнопку отмены, только если isSingleButton === false */}
              {!isSingleButton && (
                <Dialog.Close asChild>
                  <button
                    onClick={onCancel}
                    className="bg-light-gray-3 text-gray-500 px-4 py-2 rounded-full focus:outline-none hover:bg-gray-400"
                  >
                    {cancelText}
                  </button>
                </Dialog.Close>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmModal;
