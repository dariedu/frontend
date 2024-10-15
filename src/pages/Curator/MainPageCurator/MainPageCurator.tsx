import React, { useState } from 'react';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import Search from '../../../components/Search/Search';
import { IUser } from '../../../core/types';
import avatar1 from '../../../assets/avatar.svg';

const users: IUser[] = [
  {
    id: 1,
    tg_id: 1,
    name: 'Василий',
    last_name: 'Петров',
    is_adult: true,
    avatar: avatar1,
    is_staff: true,
    rating: {
      id: 0,
      level: '',
      hours_needed: 0,
    },
    point: 0,
    volunteer_hour: 0,
  },
  {
    id: 2,
    tg_id: 2,
    name: 'Анна',
    last_name: 'Иванова',
    is_adult: true,
    avatar: avatar1,
    is_staff: true,
    rating: {
      id: 0,
      level: '',
      hours_needed: 0,
    },
    point: 0,
    volunteer_hour: 0,
  },
];

const MainPageCurator: React.FC = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Завершена'
  >('Активная');

  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const points = 5;

  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const closeRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  const handleStatusChange = (newStatus: 'Активная' | 'Завершена') => {
    setDeliveryStatus(newStatus);
  };

  const handleUserClick = (user: IUser) => {
    console.log('Selected user:', user);
  };

  return (
    <div className="flex-col bg-light-gray-1 min-h-[746px]">
      <SliderStories />
      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={openRouteSheets}
      />

      <Search
        showSearchInput={false}
        showInfoSection={true}
        users={users}
        onUserClick={handleUserClick}
      />

      {deliveryStatus === 'Активная' && (
        <div>
          <DeliveryInfo />
        </div>
      )}

      {!isRouteSheetsOpen && (
        <>
          <Calendar
            headerName="Расписание доставок"
            showHeader={true}
            showFilterButton={false}
            showDatePickerButton={false}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <SliderCards showTitle={false} />
          <SliderCards showTitle={true} />
        </>
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

export default MainPageCurator;
