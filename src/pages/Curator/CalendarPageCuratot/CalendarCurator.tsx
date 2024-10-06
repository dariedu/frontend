import React, { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';

const CalendarCurator: React.FC = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершенная'
  >('Активная');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Обработчик для открытия компонента RouteSheets
  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  // Обработчик для закрытия компонента RouteSheets
  const closeRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  return (
    <div className="flex-col h-[746px] bg-light-gray-1">
      <Search />
      <Calendar showHeader={false} />
      {/* Передаем статус доставки и функцию для открытия RouteSheets */}
      <DeliveryType status={deliveryStatus} onDeliveryClick={openRouteSheets} />

      {/* Условный рендеринг RouteSheets */}
      {isRouteSheetsOpen && (
        <RouteSheets
          title="Маршpутный лист 1"
          status={deliveryStatus} // Передаем статус из состояния
          onClose={closeRouteSheets}
        />
      )}
    </div>
  );
};

export default CalendarCurator;
