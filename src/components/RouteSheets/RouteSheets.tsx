import React, { useState } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';

interface RouteSheetsProps {
  title: string;
  selected?: string;
}

const RouteSheets: React.FC<RouteSheetsProps> = ({
  title = 'Маршрутный лист 1',
}) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState({
    name: 'Не выбран',
    avatar: avatarIcon,
  });

  // Функция выбора волонтера
  const handleVolunteerSelect = (
    volunteerName: string,
    volunteerAvatar: string,
  ) => {
    setSelectedVolunteer({ name: volunteerName, avatar: volunteerAvatar });
    setIsListOpen(false); // Закрываем список после выбора волонтера
  };

  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between w-[320px]">
          <span className="font-gerbera-h3 text-light-gray-5">{title}</span>
          <div className="w-[32px]">
            <img src={arrowIcon} alt="arrow" className="w-[24px] h-[24px]" />
          </div>
        </div>
        <div className="flex justify-between">
          <div
            className="flex items-center mt-2 cursor-pointer"
            onClick={() => setIsListOpen(true)}
          >
            <img
              src={selectedVolunteer.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-gerbera-h3 text-light-gray-8">
              {selectedVolunteer.name}
            </span>
          </div>
          {/* Зеленая кнопка */}
          <button className="w-[36px] h-[35px]" aria-label="Options">
            <img src={menuIcon} alt="menu" className="text-white" />
          </button>
        </div>
      </div>

      {/* Список волонтеров */}
      {isListOpen && (
        <ListOfVolunteers onSelectVolunteer={handleVolunteerSelect} />
      )}
    </div>
  );
};

export default RouteSheets;
