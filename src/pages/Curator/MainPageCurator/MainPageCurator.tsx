import React, { useState } from 'react';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import Search from '../../../components/Search/Search';

const MainPageCurator: React.FC = () => {
  // Состояние для статуса доставки
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
    <div className="flex-col bg-light-gray-1  min-h-[746px]">
      <SliderStories />
      {/* Передаем статус, баллы и функцию открытия RouteSheets */}
      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={openRouteSheets}
      />
      <Search showSearchInput={false} showInfoSection={true} />
      {/* Если статус "Ближайшая", добавляется компонент DeliveryInfo */}
      {deliveryStatus === 'Ближайшая' && (
        <div className="">
          <DeliveryInfo />
        </div>
      )}
      {/* Условно отображаем компоненты Calendar и SliderCards */}
      {!isRouteSheetsOpen && (
        <>
          <Calendar
            headerName="Расписание доставок"
            showHeader={true}
            showFilterButton={false}
            showDatePickerButton={false}
          />
          <SliderCards showTitle={false} />
          <SliderCards showTitle={true} />
        </>
      )}

      {/* Условный рендеринг RouteSheets */}
      {isRouteSheetsOpen && (
        <RouteSheets
          title="Маршрутный лист 1"
          status={deliveryStatus} // Передаем статус из состояния
          onClose={closeRouteSheets}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default MainPageCurator;
