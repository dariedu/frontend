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
  zIndex?: boolean
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
  zIndex
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`${zIndex ? "z-[55] fixed inset-0 bg-black opacity-30" : " z-[5] fixed inset-0 bg-black opacity-30"}`} onClick={e=>e.stopPropagation()} />
        <Dialog.Content className={`${zIndex ? "z-[55] fixed inset-0 flex items-center justify-center backdrop-blur-[2px]" : " z-[5] fixed inset-0 flex items-center justify-center backdrop-blur-[2px]"}` }>
          <div className="bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl p-6 w-[300px] h-fit max-w-sm flex flex-col justify-center items-center text-center">
            <Dialog.Title className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-white">
              {title}
            </Dialog.Title>
            <Dialog.Description className="font-gerbera-h3 text-light-gray-4 dark:text-light-gray-white-4 mt-2">
              {description}
            </Dialog.Description>
            <div className="flex justify-center mt-4 space-x-4">
              {/* Кнопка подтверждения */}
              <button
                onClick={onConfirm}
                className="btn-S-GreenDefault"
              >
                {confirmText}
              </button>

              {/* Отображаем кнопку отмены, только если isSingleButton === false */}
              {!isSingleButton && (
                <Dialog.Close asChild>
                  <button
                    onClick={onCancel}
                    className="btn-S-GreenInactive dark:bg-light-gray-6 dark:text-light-gray-2"
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
