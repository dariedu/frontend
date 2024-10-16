import React, { useContext, useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import { UserContext } from '../../../core/UserContext';
import { IUser } from '../../../core/types';

const CalendarCurator: React.FC = () => {
  const { currentUser, loading } = useContext(UserContext);
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Ближайшая');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [points] = useState<number>(currentUser?.point ?? 0);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

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
        users={[currentUser]}
        onUserClick={handleUserClick}
      />
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
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
