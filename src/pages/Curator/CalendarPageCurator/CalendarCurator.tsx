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
import { Modal } from '../../../components/ui/Modal/Modal';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';

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
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState<number | null>(
    null,
  );
  const [routeSheetsMap, setRouteSheetsMap] = useState<{
    [deliveryId: number]: IRouteSheet[];
  }>({});

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchCuratorDeliveries();
    }
  }, [currentUser, fetchCuratorDeliveries]);

  const handleOpenRouteSheets = async (deliveryId: number) => {
    setIsRouteSheetsOpen(deliveryId);
    if (!routeSheetsMap[deliveryId]) {
      try {
        const userValue = useContext(UserContext);
        const token = userValue.token;
        if (!token) throw new Error('Отсутствует токен доступа');

        const routeSheets = await getRouteSheets(token);
        const deliveryRouteSheets = routeSheets.filter(
          rs => rs.deliveryId === deliveryId,
        );

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

  const handleUserClick = () => {
    if (currentUser) {
      setSelectedUserId(currentUser.id);
      setProfileModalOpen(true);
    }
  };

  const closeProfile = () => {
    setSelectedUserId(null);
    setProfileModalOpen(false);
  };

  if (isUserLoading || deliveriesLoading) return <div>Загрузка данных...</div>;
  if (userError)
    return <div>Ошибка загрузки данных пользователя: {userError}</div>;
  if (deliveriesError)
    return <div>Ошибка загрузки доставок: {deliveriesError}</div>;
  if (!currentUser) return <div>Пользователь не найден</div>;

  const station = deliveries[0]?.location?.subway || 'Станция не указана';
  const address = deliveries[0]?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
      <div className="flex-col rounded-[16px] bg-light-gray-white mt-2 mb-2">
        <Search
          showInfoSection={true}
          showSearchInput={true}
          users={[currentUser]}
          onUserClick={handleUserClick}
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
        <div className="mt-4 text-center text-gray-500">Доставок пока нет</div>
      )}

      <Modal isOpen={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
        {selectedUserId && (
          <ProfileUser
            currentUserId={selectedUserId}
            onClose={closeProfile}
            IsVolunteer={false}
          />
        )}
      </Modal>
    </div>
  );
});

export default CalendarCurator;
