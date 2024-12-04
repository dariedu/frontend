import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

interface IAddressCardProps {
  address: string;
  additionalInfo: string;
  personName: string;
  personImageUrl: string;
  onCommentClick: () => void;
  onSubmitClick: () => void;
}

export const AddressCard: React.FC<IAddressCardProps> = ({
  address,
  additionalInfo,
  personName,
  personImageUrl,
  onCommentClick,
  onSubmitClick,
}) => {
  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white p-4 rounded-2xl shadow-lg w-full max-w-[500px]">
      {/* Основная информация */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Номер квартиры или дома */}
          <div className="bg-light-brand-green text-white rounded-full w-8 h-8 flex justify-center items-center">
            1
          </div>

          {/* Адрес и информация */}
          <div className="ml-4 text-left space-y-[4px]">
            <h2 className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
              {address}
            </h2>
            <p className="font-gerbera-sub1 text-light-gray-5-text dark:text-dark-gray-4">
              {additionalInfo}
            </p>
            <p className="font-gerbera-sub1 text-light-gray-5-text dark:text-dark-gray-4">
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
      <div className="mt-[16px] space-y-[4px]">
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
