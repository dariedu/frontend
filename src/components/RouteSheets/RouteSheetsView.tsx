import React from 'react';
import avatar from '../../assets/avatar.svg';
import avatarNeed from '../../assets/icons/iconNeedPhoto.svg';

interface IRoute {
  address: string; // Адрес
  additionalInfo: string; // Дополнительная информация (link)
  personName: string; // Имя получателя (beneficiary)
  avatar?: string; // Иконка или изображение, если доступно
  needsPhoto?: boolean; // Логическое значение для фото, по умолчанию false
}

interface IRouteSheetsViewProps {
  routes: IRoute[];
  onComplete: () => void;
  isCompleted: boolean;
  isVolunteerSelected: boolean; // Добавили этот проп
}

const RouteSheetsView: React.FC<IRouteSheetsViewProps> = ({
  routes = [],
  onComplete,
  isCompleted,
  isVolunteerSelected,
}) => {
  return (
    <div>
      {/* Route Details */}
      {routes.map((route, index) => (
        <div
          key={index}
          className="w-full bg-light-gray-1 p-4 rounded-lg flex justify-between items-center mb-4 mt-[12px] "
        >
          <div className="flex flex-col items-start h-[44px]">
            <p className="font-gerbera-h3 text-light-gray-8 mb-[4px]">
              {route.address}
            </p>
            <p className="font-gerbera-sub1 text-light-gray-5 mb-[4px]">
              {route.additionalInfo}
            </p>
            <p className="font-gerbera-sub1 text-light-gray-5">
              {route.personName}
            </p>
          </div>
          {/* If avatar or placeholder */}
          <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <img
              src={route.needsPhoto ? avatarNeed : avatar}
              alt="icon"
              className="w-[32px] h-[32px]"
            />
          </div>
        </div>
      ))}

      {/* Complete Button - Render only if not completed */}
      {!isCompleted && (
        <button
          className={`btn-M-GreenDefault w-full mt-4 ${
            !isVolunteerSelected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onComplete}
          disabled={!isVolunteerSelected}
        >
          Завершить
        </button>
      )}
    </div>
  );
};

export default RouteSheetsView;
