import React from 'react';
import Calendar from '../Calendar/Calendar';
import SliderCardsPromotions from '../ui/Cards/CardPromotion/SliderCardsPromotions';

const MyPoints: React.FC = () => {
  return (
    <>
      <Calendar headerName="Потратить баллы" />
      <SliderCardsPromotions />
    </>
  );
};

export default MyPoints;
