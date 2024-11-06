import React, { useContext, useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import Search from '../../../components/Search/Search';
import { UserContext } from '../../../core/UserContext';
import { DeliveryContext } from '../../../core/DeliveryContext';
import { IDelivery } from '../../../api/apiDeliveries';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';

const CalendarCurator: React.FC = React.memo(() => {
  const {
    currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useContext(UserContext);

  const {
    deliveries,
    nearestDelivery,
    isLoading: deliveriesLoading,
    error: deliveriesError,
    fetchCuratorDeliveries,
    updateDeliveryStatus,
  } = useContext(DeliveryContext);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [points, setPoints] = useState<number>(0);
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  useEffect(() => {
    setPoints(currentUser?.point ?? 0);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCuratorDeliveries();
    }
  }, [currentUser, fetchCuratorDeliveries]);

  const handleOpenRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const handleCloseRouteSheets = () => {
    setIsRouteSheetsOpen(false);
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
  const station = nearestDelivery?.location?.subway || 'Станция не указана';
  const address = nearestDelivery?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
      <div className="flex-col rounded-[16px] bg-light-gray-white mt-2 mb-2">
        <Search
          showInfoSection={true}
          showSearchInput={true}
          users={[currentUser]}
          onUserClick={() => {}}
          station={station} // Передача станции метро в Search
          address={address} // Передача адреса в Search
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
                onDeliveryClick={handleOpenRouteSheets}
              />

              {calculatedStatus === 'Ближайшая' && (
                <div>
                  <DeliveryInfo />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div>Нет доступных доставок</div>
      )}

      {isRouteSheetsOpen && (
        <RouteSheets
          status="Активная"
          routeSheetsData={[{ id: 1, title: 'Маршрутный лист 1' }]}
          onClose={handleCloseRouteSheets}
          completedRouteSheets={[false, false]}
          setCompletedRouteSheets={() => {}}
          onStatusChange={() => {}}
        />
      )}
    </div>
  );
});

export default CalendarCurator;
