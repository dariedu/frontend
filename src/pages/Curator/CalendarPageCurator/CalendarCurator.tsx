import React, { useContext, useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import Search from '../../../components/Search/Search';
import { UserContext } from '../../../core/UserContext';
import { DeliveryContext } from '../../../core/DeliveryContext';
import { IDelivery } from '../../../api/apiDeliveries';
import { getRouteSheets, IRouteSheet } from '../../../api/routeSheetApi';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';

const CalendarCurator: React.FC = React.memo(() => {
  const {
    currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useContext(UserContext);

  const {
    deliveries,
    isLoading: deliveriesLoading,
    error: deliveriesError,
    fetchCuratorDeliveries,
    updateDeliveryStatus,
  } = useContext(DeliveryContext);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [points, setPoints] = useState<number>(0);
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState<number | null>(
    null,
  );
  const [routeSheetsMap, setRouteSheetsMap] = useState<{
    [deliveryId: number]: IRouteSheet[];
  }>({});

  useEffect(() => {
    setPoints(currentUser?.point ?? 0);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCuratorDeliveries();
    }
  }, [currentUser, fetchCuratorDeliveries]);

  const handleOpenRouteSheets = async (deliveryId: number) => {
    setIsRouteSheetsOpen(deliveryId); // Устанавливаем ID доставки для открытых маршрутных листов
    if (!routeSheetsMap[deliveryId]) {
      try {
        const userValue = useContext(UserContext);
        const token = userValue.token;
        if (!token) throw new Error('Отсутствует токен доступа');

        const routeSheets = await getRouteSheets(token); // Получаем все маршрутные листы
        const deliveryRouteSheets = routeSheets.filter(
          rs => rs.deliveryId === deliveryId,
        ); // Фильтруем по текущей доставке

        setRouteSheetsMap(prevMap => ({
          ...prevMap,
          [deliveryId]: deliveryRouteSheets,
        }));
      } catch (error) {
        console.error('Ошибка при получении маршрутных листов:', error);
      }
    }
  };

  const handleCloseRouteSheets = () => {
    setIsRouteSheetsOpen(null);
  };

  const handleStatusChange = (deliveryId: number, newStatus: boolean) => {
    updateDeliveryStatus(deliveryId, newStatus);
  };

  const getDeliveryStatus = (delivery: IDelivery) => {
    if (delivery.is_completed) return 'Завершена';
    if (delivery.is_active && delivery.in_execution) return 'Активная';
    if (delivery.is_active && !delivery.in_execution) return 'Ближайшая';
    return 'Нет доставок';
  };

  if (isUserLoading || deliveriesLoading) return <div>Загрузка данных...</div>;
  if (userError)
    return <div>Ошибка загрузки данных пользователя: {userError}</div>;
  if (deliveriesError)
    return <div>Ошибка загрузки доставок: {deliveriesError}</div>;
  if (!currentUser) return <div>Пользователь не найден</div>;

  // Получаем данные о станции и адресе ближайшей доставки
  const station = deliveries[0]?.location?.subway || 'Станция не указана';
  const address = deliveries[0]?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
      <div className="flex-col rounded-[16px] bg-light-gray-white mt-2 mb-2">
        <Search
          showInfoSection={true}
          showSearchInput={true}
          users={[currentUser]}
          onUserClick={() => {}}
          station={station}
          address={address}
        />
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {deliveries.length > 0 ? (
        deliveries.map(delivery => {
          const calculatedStatus = getDeliveryStatus(delivery);
          return (
            <div key={delivery.id}>
              <DeliveryType
                status={calculatedStatus}
                points={delivery.price}
                onDeliveryClick={() => handleOpenRouteSheets(delivery.id)}
              />

              {calculatedStatus === 'Ближайшая' && <DeliveryInfo />}

              {isRouteSheetsOpen === delivery.id && (
                <RouteSheets
                  status={calculatedStatus}
                  routeSheetsData={routeSheetsMap[delivery.id] || []}
                  onClose={handleCloseRouteSheets}
                  completedRouteSheets={
                    routeSheetsMap[delivery.id]?.map(() => false) || []
                  }
                  setCompletedRouteSheets={() => {}}
                  onStatusChange={() =>
                    handleStatusChange(delivery.id, !delivery.is_completed)
                  }
                />
              )}
            </div>
          );
        })
      ) : (
        <div>Нет доступных доставок</div>
      )}
    </div>
  );
});

export default CalendarCurator;
