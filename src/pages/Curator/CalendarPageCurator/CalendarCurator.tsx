import React, { useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import { IUser, getUsers } from '../../../api/userApi';

const CalendarCurator: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Ближайшая');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [points, setPoints] = useState<number>(0); // Для хранения баллов

  // Получение пользователей из API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);

        // Рассчитываем общее количество points (баллов) пользователей
        const totalPoints = fetchedUsers.reduce(
          (sum, user) => sum + (user.point ?? 0),
          0,
        );
        setPoints(totalPoints);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  if (loading) {
    return <div>Загрузка пользователей...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      <Search
        showInfoSection={true}
        showSearchInput={true}
        users={users}
        onUserClick={handleUserClick}
      />
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <DeliveryType
        status={deliveryStatus}
        points={points} // Передаем полученные points
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
