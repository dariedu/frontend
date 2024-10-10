import React, { useState } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import curator from '../../assets/icons/curator.svg';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from '../RouteSheets/RouteSheetsView';

interface RouteSheetsProps {
  title: string;
  selected?: string;
  status: 'Активная' | 'Ближайшая' | 'Завершена';
  onClose: () => void;
  onStatusChange: (newStatus: 'Активная' | 'Завершена') => void;
}

const mockRoutes = [
  {
    address: 'ул. Бобруйская 66',
    additionalInfo: '3 подъезд 10 этаж кв 143 код домофона #3214',
    personName: 'Петрова Галина Сергеевна',
    avatar: avatarIcon,
  },
  {
    address: 'ул. Бобруйская 66',
    additionalInfo: '3 подъезд 10 этаж кв 143 код домофона #3214',
    personName: 'Петрова Галина Сергеевна',
    needsPhoto: true,
  },
  {
    address: 'ул. Бобруйская 66',
    additionalInfo: '3 подъезд 10 этаж кв 143 код домофона #3214',
    personName: 'Петрова Галина Сергеевна',
    needsPhoto: true,
  },
];

const RouteSheets: React.FC<RouteSheetsProps> = ({
  title = 'Маршрутный лист 1 ',
  status,
  onClose,
  onStatusChange,
}) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedVolunteer, setSelectedVolunteer] = useState({
    name: 'Не выбран',
    avatar: avatarIcon, // Default avatar
  });

  // Проверка, выбран ли волонтёр
  const isVolunteerSelected =
    selectedVolunteer.name !== 'Не выбран' &&
    selectedVolunteer.avatar !== avatarIcon;

  // Function to select a volunteer
  const handleVolunteerSelect = (
    volunteerName: string,
    volunteerAvatar: string,
  ) => {
    setSelectedVolunteer({ name: volunteerName, avatar: volunteerAvatar });
    setIsListOpen(false);
  };

  // Function to take the route
  const handleTakeRoute = () => {
    setSelectedVolunteer({ name: 'Куратор', avatar: curator });
    setIsListOpen(false);
  };

  // Function to mark the route as completed
  const handleComplete = () => {
    onStatusChange('Завершена');
  };

  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex flex-col">
      {/* Название доставки и стрелка назад */}
      <div className="flex items-center mb-4">
        <button onClick={onClose} className="mr-2">
          <img src={leftArrowIcon} alt="back" className="w-6 h-6" />
        </button>
        <h2 className="font-gerbera-h1 text-lg">{status} доставка</h2>
      </div>

      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="font-gerbera-h3 text-light-gray-5">{title}</span>
          <div className="flex items-center">
            {/* Arrow Icon */}
            <div
              className="w-6 h-6 ml-2 cursor-pointer"
              onClick={() => setIsViewOpen(prev => !prev)}
            >
              <img src={arrowIcon} alt="arrow" className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsListOpen(true)}
          >
            <div className="flex items-center"></div>
            <img
              src={selectedVolunteer.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-gerbera-h3 text-light-gray-8">
              {selectedVolunteer.name}
            </span>
          </div>
          {/* Menu Icon or "Завершена" text */}
          {isVolunteerSelected ? (
            status === 'Завершена' ? (
              <span className="font-gerbera-sub2 text-light-gray-white flex items-center justify-center ml-4 bg-light-gray-3 rounded-[16px] w-[112px] h-[28px]">
                Завершена
              </span>
            ) : (
              <img
                src={menuIcon}
                alt="menu"
                className="w-[36px] h-[35px] cursor-pointer"
                onClick={() => {}}
              />
            )
          ) : null}
        </div>
      </div>
      {/* List of Volunteers */}
      {isListOpen && (
        <ListOfVolunteers
          onSelectVolunteer={handleVolunteerSelect}
          onTakeRoute={handleTakeRoute}
          showActions={true}
        />
      )}
      {/* RouteSheetsView component */}
      {isViewOpen && (
        <RouteSheetsView
          routes={mockRoutes}
          onComplete={handleComplete}
          isCompleted={status === 'Завершена'}
        />
      )}
    </div>
  );
};

export default RouteSheets;
