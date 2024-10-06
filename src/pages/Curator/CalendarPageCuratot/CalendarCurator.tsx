import React from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';

const CalendarCurator: React.FC = () => {
  return (
    <div className="flex-col h-[746px] bg-light-gray-1">
      <Search />
      <Calendar showHeader={false} />
      <DeliveryType status="Завершена" points={4} />
    </div>
  );
};

export default CalendarCurator;
