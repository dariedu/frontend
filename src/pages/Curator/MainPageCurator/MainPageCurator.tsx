import React from 'react';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';

const MainPageCurator: React.FC = () => {
  return (
    <div className="flex-col bg-light-gray-1">
      <SliderStories />
      <DeliveryType status="Активная" />
      <Calendar headerName="Расписание доставок" showHeader={true} />
      <SliderCards showTitle={false} />
      <SliderCards showTitle={true} />
    </div>
  );
};

export default MainPageCurator;
