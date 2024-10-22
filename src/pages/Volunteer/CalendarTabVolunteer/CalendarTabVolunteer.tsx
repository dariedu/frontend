import { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import NearestDelivery from '../../../components/NearestDelivery/NearestDelivery';
import NearestTask from '../../../components/NearestTask/NearestTask';
//import Logo from "./../../../assets/icons/Logo.svg"
//C:\Users\gonch\Desktop\IT shit\telegram_app\frontend\src\assets\icons\Logo.svg

const CalendarTabVolunteer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  let hasTasks: boolean = true;

  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-center min-h-[80vh]">
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        {hasTasks ? (
          <>
            <NearestDelivery />
            <NearestTask />
          </>
        ) : (
          <div className="w-full h-vh flex flex-col items-center py-[20px] mt-2 rounded-2xl">
            <img src="./../../src/assets/icons/LogoNoTaskYet.svg" />
            <p className="font-gerbera-h2 text-light-gray-black w-[300px] mt-[28px]">
              Пока нет запланированных добрых дел
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarTabVolunteer;
