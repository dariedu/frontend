import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  deliveryDate: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  deliveryDate,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-light-gray-white dark:bg-dark-gray-1 rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <Dialog.Title className="font-gerbera-h1 text-light-gray-8-text dark:text-dark-gray-8-text">
              Подтверждение доставки
            </Dialog.Title>
            <Dialog.Description className="text-md text-light-gray-4 dark:text-dark-gray-4 mt-2">
              {deliveryDate}?
            </Dialog.Description>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={onConfirm}
                className="bg-light-brand-green text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-700"
              >
                Подтвердить
              </button>
              <Dialog.Close asChild>
                <button className="bg-light-gray-3 text-gray-500 px-4 py-2 rounded-full focus:outline-none hover:bg-gray-400">
                  Отменить
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmModal;
