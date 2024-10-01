import React from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';

interface RouteSheetsProps {
  title: string;
  selected?: string;
}

const RouteSheets: React.FC<RouteSheetsProps> = ({
  title = 'Маршрутный лист 1',
  selected = 'Не выбран',
}) => {
  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between w-[320px]">
          <span className="text-sm font-medium text-gray-400">{title}</span>
          <div className="w-[32px]">
            <img src={arrowIcon} alt="arrow" className="w-4 h-4" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center mt-2">
            <img
              src={avatarIcon}
              alt="avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="text-black font-medium text-base">{selected}</span>
          </div>
          {/* Зеленая кнопка */}
          <button
            className="w-[36px] h-[36px] bg-light-brand-green flex items-center justify-center rounded-full"
            aria-label="Options"
          >
            <img src={menuIcon} alt="menu" className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteSheets;
