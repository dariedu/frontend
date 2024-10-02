import React, { useState } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg'; // Default avatar
import avatarNeed from '../../assets/icons/iconNeedPhoto.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import curator from '../../assets/icons/curator.svg'; // Новый аватар для куратора
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from '../RouteSheets/RouteSheetsView';

interface RouteSheetsProps {
  title: string;
  selected?: string;
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
  title = 'Маршрутный лист 1',
}) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState({
    name: 'Не выбран',
    avatar: avatarIcon, // Default avatar
  });

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
    setSelectedVolunteer({ name: 'Куратор', avatar: curator }); // Обновляем аватар и имя на "Куратор"
    setIsListOpen(false);
  };

  // Function to mark the route as completed
  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex flex-col">
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
          {/* Menu Icon or "Завершен" text */}
          {isCompleted ? (
            <span className="font-gerbera-sub2 text-light-gray-white flex items-center justify-center ml-4 bg-light-gray-3 rounded-[16px] w-[112px] h-[28px]">
              Завершен
            </span>
          ) : (
            <img
              src={menuIcon}
              alt="menu"
              className="w-[36px] h-[35px] cursor-pointer"
              onClick={() => {}}
            />
          )}
        </div>
      </div>
      {/* List of Volunteers */}
      {isListOpen && (
        <ListOfVolunteers
          onSelectVolunteer={handleVolunteerSelect}
          onTakeRoute={handleTakeRoute}
        />
      )}
      {/* RouteSheetsView component */}
      {isViewOpen && (
        <RouteSheetsView
          routes={mockRoutes}
          onComplete={handleComplete}
          isCompleted={isCompleted} // Pass isCompleted as a prop
        />
      )}
    </div>
  );
};

export default RouteSheets;
