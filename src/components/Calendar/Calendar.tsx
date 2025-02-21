import React, {
  useState,
  useRef,
  useEffect,
  // useEffect,
  // useContext,
  // useCallback,
} from 'react';
import {
  format,
  // startOfWeek,
  addDays, isSameDay, isSameMonth
} from 'date-fns';
import { ru } from 'date-fns/locale';
// import Filter from "./../../assets/icons/filter.svg?react"
// import FilterCurator from '../FilterCurator/FilterCurator';
// import InputDate from '../InputDate/InputDate';
// import { DeliveryContext } from '../../core/DeliveryContext';
// import { getTasksCategories, TTaskCategory } from '../../api/apiTasks';
// import { Modal } from '../ui/Modal/Modal';
// import { TokenContext } from '../../core/TokenContext';
// import Arrow_down from './../../assets/icons/arrow_down.svg?react'
import { IDelivery } from '../../api/apiDeliveries';


interface ICalendarProps {
  selectedDate: Date|null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date|null>>;
  headerName?: string;
  showHeader?: boolean;
  showFilterButton?: boolean;
  showDatePickerButton?: boolean;
  deliveries: IDelivery[]
  setFilteredDeliveries:React.Dispatch<React.SetStateAction<IDelivery[]>>;
}

const Calendar: React.FC<ICalendarProps> = ({
  // headerName='Календарь',
  // showHeader=true,
  // showFilterButton,
  // showDatePickerButton=true,
  selectedDate,
  setSelectedDate,
  deliveries,
  setFilteredDeliveries
}) => {
  // const { deliveries } = useContext(DeliveryContext);
  const [datesFromActiveDeliveries, setDatesFromActiveDeliveries] = useState<string[]>([]);
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // const [filterCategories, setFilterCategories] = useState<number[]>([]);
  // const [categories, setCategories] = useState<TTaskCategory[]>([]);
  // const { token } = useContext(TokenContext);
  const calendarRef = useRef<HTMLDivElement>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const startX = useRef(0);
  // const scrollLeft = useRef(0);
  const startOfWeekDate = new Date()


  // const fetchCategories = async () => {
  //   try {
  //     if (token) {
  //       const result = await getTasksCategories(token);
  //       setCategories(result);
  //     } else {
  //       console.warn('Access token is missing');
  //     }
  //   } catch (err) {
  //     console.error('Ошибка загрузки категорий:', err);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

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

  // const handleOpenDatePicker = () => {
  //   setIsDatePickerOpen(true);
  // };

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
        className="flex flex-col items-center w-[32px] h-[47px] select-none"
      >
        <span className="text-xs pb-2 text-gray-500 dark:text-light-gray-4 relative" >
          {format(day, 'EE', { locale: ru }).slice(0, 1).toUpperCase() + format(day, 'EE', { locale: ru }).slice(1, 2)}
        </span>
       
        <button
          className={`font-gerbera-sub2 w-6 h-6 flex items-center justify-center rounded-full relative ${
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
          // draggable={false}
        >
          {format(day, 'd')}
          {included[index] === true && <div className='bg-light-brand-green w-1 h-1 rounded-full mt-3 ml-6 absolute '></div>}
        </button>
      </div>
    ));
  };

  // const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
  //   setIsDragging(true);
  //   startX.current =
  //     e.type === 'mousedown'
  //       ? (e as React.MouseEvent).pageX - (calendarRef.current?.offsetLeft || 0)
  //       : (e as React.TouchEvent).touches[0].pageX -
  //         (calendarRef.current?.offsetLeft || 0);
  //   scrollLeft.current = calendarRef.current?.scrollLeft || 0;
  // }, []);

  // const handleMove = useCallback(
  //   (e: MouseEvent | TouchEvent) => {
  //     if (!isDragging) return;
  //     e.preventDefault();
  //     const x =
  //       e.type === 'mousemove'
  //         ? (e as MouseEvent).pageX - (calendarRef.current?.offsetLeft || 0)
  //         : (e as TouchEvent).touches[0].pageX -
  //           (calendarRef.current?.offsetLeft || 0);
  //     const walk = (x - startX.current) * 1.5;
  //     if (calendarRef.current)
  //       calendarRef.current.scrollLeft = scrollLeft.current - walk;
  //   },
  //   [isDragging],
  // );

  // const handleEnd = useCallback(() => setIsDragging(false), []);

  // useEffect(() => {
  //   if (isDragging) {
  //     window.addEventListener('mousemove', handleMove);
  //     window.addEventListener('touchmove', handleMove);
  //     window.addEventListener('mouseup', handleEnd);
  //     window.addEventListener('touchend', handleEnd);
  //     window.addEventListener('touchcancel', handleEnd);
  //   } else {
  //     window.removeEventListener('mousemove', handleMove);
  //     window.removeEventListener('touchmove', handleMove);
  //     window.removeEventListener('mouseup', handleEnd);
  //     window.removeEventListener('touchend', handleEnd);
  //     window.removeEventListener('touchcancel', handleEnd);
  //   }
  //   return () => {
  //     window.removeEventListener('mousemove', handleMove);
  //     window.removeEventListener('touchmove', handleMove);
  //     window.removeEventListener('mouseup', handleEnd);
  //     window.removeEventListener('touchend', handleEnd);
  //     window.removeEventListener('touchcancel', handleEnd);
  //   };
  // }, [isDragging, handleMove, handleEnd]);

  return (
    <>
      <div className="p-4 bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px] rounded-2xl relative select-none">
        <div className="flex justify-between items-center mb-4">
          {/* {showHeader && (
            <h2 className="font-gerbera-h1 text-lg  dark:text-light-gray-white">{headerName}</h2>
          )} */}
        {/*   {(showFilterButton || showDatePickerButton) && (
            <div className="flex space-x-2">
              {showFilterButton && (
                  <Filter onClick={() => setIsFilterOpen(true)} className='cursor-pointer rounded-full bg-light-gray-1 fill-[#0A0A0A] dark:bg-light-gray-6 dark:fill-[#F8F8F8]'/>
              )}
              {showDatePickerButton && (
                <button
                  className="w-8 h-8 bg-light-gray-white dark:bg-light-gray-7-logo rounded-full flex items-center justify-center"
                  onClick={handleOpenDatePicker}
                  draggable={false}
                >
                  <Arrow_down  className={`stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer`}
                  />

                </button>
              )}
            </div>
          )} */}
        </div>

        <div className="absolute left-4 flex items-center">
          <span className="font-gerbera-sub1 text-light-gray-4 w-[20px] rotate-[-90deg] flex items-center justify-center">
            {
              selectedDate ? format(selectedDate, 'LLLL', { locale: ru }).slice(0, 1).toUpperCase() + format(selectedDate, 'LLLL', { locale: ru }).slice(1) :
              format(startOfWeekDate, 'LLLL', { locale: ru }).slice(0,1).toUpperCase()+format(startOfWeekDate, 'LLLL', { locale: ru }).slice(1)
          }
          </span>
          <div className="border-r h-[48px] border-light-gray-2" />
        </div>

        <div
          className='flex space-x-5 ml-7 cursor-grab overflow-x-auto'
          style={{ width:'full', minWidth: '300px', maxWidth:'500px' }}
          ref={calendarRef}
          // onMouseDown={handleStart}
          // onTouchStart={handleStart}
          // onDragStart={e => e.preventDefault()}
        >
          {renderWeekDays()}
        </div>
      </div>

      {/* {isFilterOpen && (
        <FilterCurator
          categories={categories}
          onOpenChange={setIsFilterOpen}
          setFilter={setFilterCategories}
          filtered={filterCategories}
        />
      )} */}
{/* 
      <Modal isOpen={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <InputDate
          onClose={() => setIsDatePickerOpen(false)}
          selectionMode="range"
          setCurrentDate={() => {}}
          categories={categories}
          filterCategories={filterCategories}
          setFilterCategories={setFilterCategories}
        />
      </Modal> */}
    </>
  );
};

export default Calendar;
