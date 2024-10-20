import React, { useState } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import curator from '../../assets/icons/curator.svg';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from './RouteSheetsView';

interface RouteSheet {
  id: number;
  title: string;
  // Добавьте другие поля, необходимые для маршрутного листа
}

interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена' | 'Нет доставок';
  routeSheetsData: RouteSheet[];
  onClose: () => void;
  onStatusChange: () => void;
  completedRouteSheets: boolean[]; // Передаём состояние завершения маршрутных листов
  setCompletedRouteSheets: React.Dispatch<React.SetStateAction<boolean[]>>; // Функция для обновления состояния
}

const mockRoutes = [
  {
    address: 'ул. Бобруйская 66',
    additionalInfo: '3 подъезд 10 этаж кв 143 код домофона #3214',
    personName: 'Петрова Галина Сергеевна',
    avatar: avatarIcon,
  },
  // Добавьте другие маршруты при необходимости
];

const RouteSheets: React.FC<RouteSheetsProps> = ({
  status,
  routeSheetsData,
  onClose,
  onStatusChange,
  completedRouteSheets,
  setCompletedRouteSheets,
}) => {
  // Ограничиваем количество маршрутных листов до 4
  const limitedRouteSheetsData = routeSheetsData.slice(0, 4);

  // Состояние для каждого маршрутного листа
  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(
    Array(limitedRouteSheetsData.length).fill(false),
  );

  // Состояние для выбранного волонтёра в каждом маршрутном листе
  const [selectedVolunteers, setSelectedVolunteers] = useState<
    { name: string; avatar: string }[]
  >(
    Array(limitedRouteSheetsData.length).fill({
      name: 'Не выбран',
      avatar: avatarIcon,
    }),
  );

  // Состояние для отображения списка волонтёров для каждого маршрутного листа
  const [openVolunteerLists, setOpenVolunteerLists] = useState<boolean[]>(
    Array(limitedRouteSheetsData.length).fill(false),
  );

  // Функция для переключения отображения маршрутного листа
  const toggleRouteSheet = (index: number) => {
    setOpenRouteSheets(prev =>
      prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
    );
  };

  // Функция для открытия списка волонтёров
  const openVolunteerList = (index: number) => {
    setOpenVolunteerLists(prev =>
      prev.map((isOpen, idx) => (idx === index ? true : isOpen)),
    );
  };

  // Функция для закрытия списка волонтёров
  const closeVolunteerList = (index: number) => {
    setOpenVolunteerLists(prev =>
      prev.map((isOpen, idx) => (idx === index ? false : isOpen)),
    );
  };

  // Функция для выбора волонтёра
  const handleVolunteerSelect = (
    index: number,
    volunteerName: string,
    volunteerAvatar: string,
  ) => {
    setSelectedVolunteers(prev =>
      prev.map((volunteer, idx) =>
        idx === index
          ? { name: volunteerName, avatar: volunteerAvatar }
          : volunteer,
      ),
    );
    closeVolunteerList(index);
  };

  // Функция для взятия маршрута куратором
  const handleTakeRoute = (index: number) => {
    setSelectedVolunteers(prev =>
      prev.map((volunteer, idx) =>
        idx === index ? { name: 'Куратор', avatar: curator } : volunteer,
      ),
    );
    closeVolunteerList(index);
  };

  // Функция для завершения маршрутного листа
  const handleComplete = (index: number) => {
    setCompletedRouteSheets(prev =>
      prev.map((completed, idx) => (idx === index ? true : completed)),
    );

    onStatusChange();
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

      {/* Список маршрутных листов */}
      <div className="flex flex-col">
        {limitedRouteSheetsData.map((routeSheet, index) => {
          const isVolunteerSelected =
            selectedVolunteers[index].name !== 'Не выбран';

          return (
            <div key={routeSheet.id} className="mb-4 p-2 border rounded-lg">
              {/* Заголовок маршрутного листа */}
              <div className="flex items-center justify-between w-full mb-2">
                {/* Название "Маршрутный лист X" */}
                <span className="font-gerbera-h3 text-light-gray-5">
                  {`Маршрутный лист ${index + 1}`}
                </span>
                {/* Иконка стрелки для открытия/закрытия */}
                <div
                  className="w-6 h-6 ml-2 cursor-pointer"
                  onClick={() => toggleRouteSheet(index)}
                >
                  <img
                    src={arrowIcon}
                    alt="arrow"
                    className={`w-6 h-6 transform ${
                      openRouteSheets[index] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Информация о волонтёре и статус */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => openVolunteerList(index)}
                >
                  <img
                    src={selectedVolunteers[index].avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="font-gerbera-h3 text-light-gray-8">
                    {selectedVolunteers[index].name}
                  </span>
                </div>
                {completedRouteSheets[index] ? (
                  <span className="font-gerbera-sub2 text-light-gray-white flex items-center justify-center ml-4 bg-light-gray-3 rounded-[16px] w-[112px] h-[28px]">
                    Завершена
                  </span>
                ) : isVolunteerSelected ? (
                  <img
                    src={menuIcon}
                    alt="menu"
                    className="w-[36px] h-[35px] cursor-pointer"
                  />
                ) : null}
              </div>

              {/* Список волонтёров для выбора */}
              {openVolunteerLists[index] && (
                <ListOfVolunteers
                  onSelectVolunteer={(name, avatar) =>
                    handleVolunteerSelect(index, name, avatar)
                  }
                  onTakeRoute={() => handleTakeRoute(index)}
                  onClose={() => closeVolunteerList(index)}
                />
              )}

              {/* Детали маршрутного листа */}
              {openRouteSheets[index] && (
                <div>
                  <RouteSheetsView
                    routes={mockRoutes}
                    onComplete={() => handleComplete(index)}
                    isCompleted={completedRouteSheets[index]}
                    isVolunteerSelected={isVolunteerSelected}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSheets;
