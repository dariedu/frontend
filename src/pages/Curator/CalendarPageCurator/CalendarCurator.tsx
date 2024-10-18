import React, { useContext, useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import { UserContext } from '../../../core/UserContext';
import { IUser } from '../../../core/types';

interface RouteSheet {
  id: number;
  title: string;
  // Дополнительные поля, если необходимо
}

const CalendarCurator: React.FC = () => {
  const { currentUser, loading } = useContext(UserContext);
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Активная');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [points] = useState<number>(currentUser?.point ?? 0);

  // Данные маршрутных листов
  const routeSheetsData: RouteSheet[] = [
    { id: 1, title: 'Маршрутный лист 1' },
    { id: 2, title: 'Маршрутный лист 2' },
    { id: 3, title: 'Маршрутный лист 3' },
    { id: 4, title: 'Маршрутный лист 4' },
  ];

  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Состояние завершения маршрутных листов
  const [completedRouteSheets, setCompletedRouteSheets] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );

  // Следим за изменениями в completedRouteSheets и обновляем deliveryStatus
  useEffect(() => {
    if (completedRouteSheets.every(completed => completed)) {
      setDeliveryStatus('Завершена');
    } else {
      setDeliveryStatus('Активная');
    }
  }, [completedRouteSheets]);

  const handleUserClick = (user: IUser) => {
    console.log('Clicked on user:', user);
  };

  const handleOpenRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const handleCloseRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div className="flex-col min-h-[672px] bg-light-gray-1">
      <div className="flex-col rounded-[16px] bg-light-gray-white mt-2 mb-2">
        <Search
          showInfoSection={true}
          showSearchInput={true}
          users={[currentUser]}
          onUserClick={handleUserClick}
        />
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={handleOpenRouteSheets}
      />

      {deliveryStatus === 'Ближайшая' && (
        <div>
          <DeliveryInfo />
        </div>
      )}

      {/* Отображение RouteSheets при открытии */}
      {isRouteSheetsOpen && (
        <RouteSheets
          status={deliveryStatus}
          routeSheetsData={routeSheetsData}
          onClose={handleCloseRouteSheets}
          completedRouteSheets={completedRouteSheets}
          setCompletedRouteSheets={setCompletedRouteSheets}
        />
      )}
    </div>
  );
};

export default CalendarCurator;
