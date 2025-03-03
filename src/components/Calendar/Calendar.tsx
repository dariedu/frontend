import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  format,
  addDays,  isSameDay,  isSameMonth
} from 'date-fns';
import { ru } from 'date-fns/locale';

import { IDelivery } from '../../api/apiDeliveries';


interface ICalendarProps {
  startOfWeekDate:Date
  selectedDate: Date|null
  setSelectedDate: React.Dispatch<React.SetStateAction<Date|null>>
  deliveries: IDelivery[]
  setFilteredDeliveries: React.Dispatch<React.SetStateAction<IDelivery[]>>
}

const Calendar: React.FC<ICalendarProps> = ({
  startOfWeekDate,
  selectedDate,
  setSelectedDate,
  deliveries,
  setFilteredDeliveries,
}) => {

  const [datesFromActiveDeliveries, setDatesFromActiveDeliveries] = useState<string[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // const startOfWeekDate = new Date()

  function createListOfDates() {
    const datesArr:string[] = [];
    deliveries.forEach(delivery => {
      datesArr.push(delivery.date)
    })
    setDatesFromActiveDeliveries(datesArr)
  }

  useEffect(() => {
    createListOfDates()
  }, [deliveries])

 const handleDayClick = (day: Date) => {
  
    if (selectedDate && isSameDay(day, selectedDate)) {
      setSelectedDate(null);
      setFilteredDeliveries(deliveries)
    } else {
      setSelectedDate(day);
      // Фильтруем доставки по выбранной дате
    const filteredDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      return isSameDay(deliveryDate, day) && isSameMonth(deliveryDate, day);
    });
    setFilteredDeliveries(filteredDeliveries)
      }
  
  };



  useEffect(() => {
    setWindowSize({ width: window.innerWidth,
      height: window.innerHeight
    })
    
}, [])
  console.log(windowSize, 'windowsize')
  
  const renderWeekDays = () => {
    const days = Array.from({ length: 14 }).map((_, index) =>
      addDays(startOfWeekDate, index),
    );
    const included: boolean[] = [];
    days.forEach(d => {
      const bool = datesFromActiveDeliveries.find(i => { return isSameDay(new Date(i), new Date(d)) })
      if (bool) {
        included.push(true)
      } else {
        included.push(false)
        }
    })


    return days.map((day, index) => (
      <div
        key={index}
        className="flex flex-col w-[32px] h-[46px] select-none justify-between "
      >
        <div className="text-light-gray-4 dark:text-light-gray-4 relative font-gerbera-sub2" >
          {format(day, 'cccccc', { locale: ru }).slice(0, 1).toUpperCase() + format(day, 'cccccc', { locale: ru }).slice(1, 2)}
        </div>
        <div
          className={`w-6 h-6 min-w-6 min-h-6 flex items-center justify-center rounded-full relative
             ${
            selectedDate && isSameDay(selectedDate, day)
              ? ' text-light-gray-black bg-light-brand-green '
              : 'text-light-gray-black dark:text-light-gray-white'
            }
            ${
              isSameDay(startOfWeekDate, day)
                ? ' text-light-gray-black border-light-brand-green border-2'
                : 'text-light-gray-black dark:text-light-gray-white'
            }
            `}
          onClick={() => handleDayClick(day)}
        >
          <p className={`font-gerbera-sub2 block   ${ windowSize.width < 550 ? ' pt-1 ': ' p-1 '}`}>{format(day, 'd')}</p>
          {included[index] === true && <div className='bg-light-brand-green w-1 h-1 rounded-full mt-[18px] ml-[26px] absolute '></div>}
        </div>
      </div>
    ));
  };

 

  return (
    <>
      <div className="px-4 bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px] rounded-2xl relative select-none h-[88px] flex items-center">
             <div className="absolute flex items-center h-[56px] w-[22px]">
          <span className="font-gerbera-sub1 text-light-gray-4 w-[20px] rotate-[-90deg] flex justify-center">
            {
              selectedDate ? format(selectedDate, 'LLLL', { locale: ru }).slice(0, 1).toUpperCase() + format(selectedDate, 'LLLL', { locale: ru }).slice(1) :
              format(startOfWeekDate, 'LLLL', { locale: ru }).slice(0,1).toUpperCase()+format(startOfWeekDate, 'LLLL', { locale: ru }).slice(1)
          }
          </span>
          <div className="h-[48px] w-[2px] bg-light-gray-2" />
        </div>

        <div
          className='flex space-x-[14px] ml-[26px] overflow-x-auto mt-2'
          style={{ width:'full', minWidth: '300px', maxWidth:'500px' }}
          ref={calendarRef}
        >
          {renderWeekDays()}
        </div>
      </div>
    </>
  );
};

export default Calendar;
