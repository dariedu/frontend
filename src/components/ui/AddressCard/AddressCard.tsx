import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

interface AddressCardProps {
  address: string;
  additionalInfo: string;
  personName: string;
  personImageUrl: string;
  onCommentClick: () => void;
  onSubmitClick: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  additionalInfo,
  personName,
  personImageUrl,
  onCommentClick,
  onSubmitClick,
}) => {
  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white p-4 rounded-[16px] shadow-lg max-w-md w-[360px]">
      {/* Основная информация */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Номер квартиры или дома */}
          <div className="bg-light-brand-green text-white rounded-full w-8 h-8 flex justify-center items-center">
            1
          </div>

          {/* Адрес и информация */}
          <div className="ml-4">
            <h2 className="font-gerbera-h2 text-light-gray-8-text dark:text-dark-gray-8-text">
              {address}
            </h2>
            <p className="text-sm text-light-gray-4 dark:text-dark-gray-4">
              {additionalInfo}
            </p>
            <p className="text-sm text-light-gray-8-text dark:text-dark-gray-8-text">
              {personName}
            </p>
          </div>
        </div>

        {/* Аватарка */}
        <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-10 h-10 rounded-full">
          <Avatar.Image
            className="w-full h-full object-cover"
            src={personImageUrl}
            alt={personName}
          />
          <Avatar.Fallback className="bg-gray-400 text-white flex items-center justify-center">
            {personName[0]}
          </Avatar.Fallback>
        </Avatar.Root>
      </div>

      {/* Кнопки */}
      <div className="mt-6 space-y-4">
        <button className="btn-B-GrayDefault" onClick={onCommentClick}>
          Добавить комментарий
        </button>
        <button className="btn-B-GrayDefault" onClick={onSubmitClick}>
          Отправить
        </button>
      </div>
    </div>
  );
};
