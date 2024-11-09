import React, { useState, useContext } from 'react';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import Search from '../../../components/Search/Search';
import { IUser } from '../../../core/types';
import avatar1 from '../../../assets/avatar.svg';
import { DeliveryContext } from '../../../core/DeliveryContext';

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
  const { nearestDelivery, isLoading, error } = useContext(DeliveryContext);
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const points = 5;
  const deliveryStatus = nearestDelivery
    ? nearestDelivery.is_completed
      ? 'Завершена'
      : nearestDelivery.is_active
        ? 'Активная'
        : 'Ближайшая'
    : 'Нет доставок';

  const station = nearestDelivery?.location?.subway || 'Станция не указана';
  const address = nearestDelivery?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col bg-light-gray-1 min-h-[80vh]">
      <SliderStories />
      <div className="flex-col bg-light-gray-white rounded-[16px]">
        {isLoading ? (
          <div>Загрузка доставок...</div>
        ) : error || !nearestDelivery ? (
          <div>Доставок пока нет</div>
        ) : (
          <DeliveryType
            status={deliveryStatus}
            points={points}
            onDeliveryClick={() => setIsRouteSheetsOpen(true)}
          />
        )}

        <Search
          showSearchInput={false}
          showInfoSection={true}
          users={users}
          onUserClick={() => {}}
          station={station}
          address={address}
        />

        {deliveryStatus === 'Ближайшая' && <DeliveryInfo />}

        {!isRouteSheetsOpen && (
          <Calendar
            headerName="Расписание доставок"
            showHeader={true}
            showFilterButton={false}
            showDatePickerButton={false}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>
      {!isRouteSheetsOpen && (
        <>
          <SliderCards showTitle={false} switchTab={() => {}} />
          <SliderCards showTitle={true} switchTab={() => {}} />
        </>
      )}
    </div>
  );
};

export default MainPageCurator;
