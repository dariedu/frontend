import React from 'react';
import SliderStories from '../../components/SliderStories/SliderStories';
import NearestDelivery from '../../components/NearestDelivery/NearestDelivery';
import { delivery1 } from '../../components/NearestDelivery/NearestDelivery';
import Calendar from '../../components/Calendar/Calendar';
import SliderCards from '../../components/SliderCards/SliderCards';

const MainPageCurator: React.FC = () => {
  return (
    <>
      <SliderStories />
      <NearestDelivery delivery={delivery1} volunteer={false} />
      <Calendar headerName="Расписание доставок" showHeader={true} />
      <SliderCards showTitle={false} />
      <SliderCards showTitle={true} />
    </>
  );
};

export default MainPageCurator;
