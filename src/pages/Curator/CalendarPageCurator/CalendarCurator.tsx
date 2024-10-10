import React, { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import avatar1 from '../../../assets/avatar.svg';
import { IUser } from '../../../core/types';

// Массив пользователей
const users: IUser[] = [
  { id: 1, name: 'Осипова Юлия', avatar: avatar1 },
  { id: 2, name: 'Иванов Иван', avatar: avatar1 },
  { id: 3, name: 'Сидоров Алексей', avatar: avatar1 },
  { id: 4, name: 'Смирнова Анна', avatar: avatar1 },
  { id: 5, name: 'Петров Петр', avatar: avatar1 },
  { id: 6, name: 'Александрова Мария', avatar: avatar1 },
];

const CalendarCurator: React.FC = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Ближайшая');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  const points = 5;

  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const closeRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  const handleStatusChange = (
    newStatus: 'Активная' | 'Ближайшая' | 'Завершена',
  ) => {
    setDeliveryStatus(newStatus);
  };

  const handleUserClick = (user: IUser) => {
    console.log('Clicked on user:', user);
  };

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      <Search
        showInfoSection={true}
        showSearchInput={true}
        users={users}
        onUserClick={handleUserClick}
      />
      <Calendar />
      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={openRouteSheets}
      />
      {deliveryStatus === 'Ближайшая' && (
        <div>
          <DeliveryInfo />
        </div>
      )}
      {isRouteSheetsOpen && (
        <RouteSheets
          title="Маршрутный лист 1"
          status={deliveryStatus}
          onClose={closeRouteSheets}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default CalendarCurator;
