import React, { useState } from 'react';
import Calendar from '../Calendar/Calendar';
import SliderCardsPromotions from '../ui/Cards/CardPromotion/SliderCardsPromotions';

const MyPoints: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <>
      <Calendar
        headerName="Потратить баллы"
        showHeader={true}
        showFilterButton={false}
        showDatePickerButton={false}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <SliderCardsPromotions />
    </>
  );
};

export default MyPoints;
