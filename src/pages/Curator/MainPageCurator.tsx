import React from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SliderStories from '../../components/SliderStories/SliderStories';
import NearestDelivery from '../../components/NearestDelivery/NearestDelivery';
import { delivery1 } from '../../components/NearestDelivery/NearestDelivery';
import Calendar from '../../components/Calendar/Calendar';
import SliderCards from '../../components/SliderCards/SliderCards';

const MainPageCurator: React.FC = () => {
  return (
    <>
      <NavigationBar variant="mainScreen" />
      <SliderStories />
      <NearestDelivery delivery={delivery1} volunteer={false} />
      <Calendar headerName="Расписание доставок" />
      <SliderCards showTitle={false} />
      <SliderCards showTitle={true} />
    </>
  );
};

export default MainPageCurator;
