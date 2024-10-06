import React, { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';

const CalendarCurator: React.FC = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Активная');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Фиксированное количество баллов для проверки
  const points = 5;

  // Обработчик для открытия компонента RouteSheets
  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  // Обработчик для закрытия компонента RouteSheets
  const closeRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  // Функция для обновления статуса доставки
  const handleStatusChange = (
    newStatus: 'Активная' | 'Ближайшая' | 'Завершена',
  ) => {
    setDeliveryStatus(newStatus);
  };

  return (
    <div className="flex-col h-[746px] bg-light-gray-1">
      <Search />
      <Calendar showHeader={false} />
      {/* Передаем статус доставки, функцию для открытия RouteSheets и функцию для обновления статуса */}
      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={openRouteSheets}
      />

      {/* Условный рендеринг RouteSheets */}
      {isRouteSheetsOpen && (
        <RouteSheets
          title="Маршрутный лист 1"
          status={deliveryStatus} // Передаем статус из состояния
          onClose={closeRouteSheets}
          onStatusChange={handleStatusChange} // Передаем функцию для обновления статуса
        />
      )}
    </div>
  );
};

export default CalendarCurator;
