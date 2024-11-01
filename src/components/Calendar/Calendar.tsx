import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import filterIcon from '../../assets/icons/filter.svg';
import arrowDownIcon from '../../assets/icons/arrow_down.png';
import FilterCurator from '../FilterCurator/FilterCurator';
import InputDate from '../InputDate/InputDate';
import { DeliveryContext } from '../../core/DeliveryContext';
import { getTasksCategories, TTaskCategory } from '../../api/apiTasks';
import { UserContext } from '../../core/UserContext';
import { Modal } from '../ui/Modal/Modal';

interface ICalendarProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  headerName?: string;
  showHeader?: boolean;
  showFilterButton?: boolean;
  showDatePickerButton?: boolean;
}

const Calendar: React.FC<ICalendarProps> = ({
  headerName = 'Календарь',
  showHeader = true,
  showFilterButton = true,
  showDatePickerButton = true,
  selectedDate,
  setSelectedDate,
}) => {
  const { deliveries, setFilteredDeliveriesByDate } =
    useContext(DeliveryContext);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterCategories, setFilterCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<TTaskCategory[]>([]);
  const { token } = useContext(UserContext);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startOfWeekDate = startOfWeek(new Date(), { locale: ru });

  const fetchCategories = async () => {
    try {
      if (token) {
        const result = await getTasksCategories(token);
        setCategories(result);
      } else {
        console.warn('Access token is missing');
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const filteredDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      return isSameDay(deliveryDate, day) && isSameMonth(deliveryDate, day);
    });
    setFilteredDeliveriesByDate(filteredDeliveries);
  };

  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const renderWeekDays = () => {
    const days = Array.from({ length: 14 }).map((_, index) =>
      addDays(startOfWeekDate, index),
    );

    return days.map((day, index) => (
      <div
        key={index}
        className="flex flex-col items-center w-[32px] h-[44px] select-none"
      >
        <span className="text-xs pb-2 text-gray-500">
          {format(day, 'EE', { locale: ru }).slice(0, 2)}
        </span>
        <button
          className={`font-gerbera-sub2 w-6 h-6 flex items-center justify-center rounded-full ${
            isSameDay(selectedDate, day)
              ? 'bg-light-brand-green text-white'
              : 'text-black'
          }`}
          onClick={() => handleDayClick(day)}
          draggable={false}
        >
          {format(day, 'd')}
        </button>
      </div>
    ));
  };

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current =
      e.type === 'mousedown'
        ? (e as React.MouseEvent).pageX - (calendarRef.current?.offsetLeft || 0)
        : (e as React.TouchEvent).touches[0].pageX -
          (calendarRef.current?.offsetLeft || 0);
    scrollLeft.current = calendarRef.current?.scrollLeft || 0;
  }, []);

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x =
        e.type === 'mousemove'
          ? (e as MouseEvent).pageX - (calendarRef.current?.offsetLeft || 0)
          : (e as TouchEvent).touches[0].pageX -
            (calendarRef.current?.offsetLeft || 0);
      const walk = (x - startX.current) * 1.5;
      if (calendarRef.current)
        calendarRef.current.scrollLeft = scrollLeft.current - walk;
    },
    [isDragging],
  );

  const handleEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <>
      <div className="p-4 bg-white w-[360px] rounded-[16px] relative select-none">
        <div className="flex justify-between items-center mb-4">
          {showHeader && (
            <h2 className="font-gerbera-h1 text-lg">{headerName}</h2>
          )}
          {(showFilterButton || showDatePickerButton) && (
            <div className="flex space-x-2">
              {showFilterButton && (
                <button
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  onClick={() => setIsFilterOpen(true)}
                  draggable={false}
                >
                  <img
                    src={filterIcon}
                    alt="filter"
                    className="w-8 h-8"
                    draggable={false}
                  />
                </button>
              )}
              {showDatePickerButton && (
                <button
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  onClick={handleOpenDatePicker}
                  draggable={false}
                >
                  <img
                    src={arrowDownIcon}
                    alt="arrow down"
                    className="w-4 h-4"
                    draggable={false}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="absolute left-0 flex items-center">
          <span className="font-gerbera-sub1 text-light-gray-4 w-[35px] rotate-[-90deg] flex items-center justify-center">
            {format(selectedDate, 'LLLL', { locale: ru })}
          </span>
          <div className="border-r h-[48px] border-gray-300" />
        </div>

        <div
          className={`flex space-x-5 ml-7 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ width: '300px', overflowX: 'hidden' }}
          ref={calendarRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onDragStart={e => e.preventDefault()}
        >
          {renderWeekDays()}
        </div>
      </div>

      {isFilterOpen && (
        <FilterCurator
          categories={categories}
          onOpenChange={setIsFilterOpen}
          setFilter={setFilterCategories}
          filtered={filterCategories}
        />
      )}

      <Modal isOpen={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <InputDate
          onClose={() => setIsDatePickerOpen(false)}
          selectionMode="range"
          setCurrentDate={() => {}}
          categories={categories}
          filterCategories={filterCategories}
          setFilterCategories={setFilterCategories}
        />
      </Modal>
    </>
  );
};

export default Calendar;
