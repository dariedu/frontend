import React, { useState, useRef, useEffect, useContext } from 'react';
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import filterIcon from '../../assets/icons/filter.svg';
import arrowDownIcon from '../../assets/icons/arrow_down.png';
import FilterCurator from '../FilterCurator/FilterCurator';
import InputDate from '../InputDate/InputDate';
import { DeliveryContext } from '../../core/DeliveryContext'; // Импортируем контекст доставок

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
    useContext(DeliveryContext); // Получаем доставки из контекста и функцию для фильтрации по дате

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startOfWeekDate = startOfWeek(new Date(), { locale: ru });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    // Фильтрация доставок по выбранной дате и сохранение их в контексте
    const filteredDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      return isSameDay(deliveryDate, day) && isSameMonth(deliveryDate, day);
    });
    setFilteredDeliveriesByDate(filteredDeliveries); // Сохраняем отфильтрованные доставки для дальнейшего использования
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

  // Обработчики событий для мыши и касания
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if (e.type === 'mousedown') {
      const mouseEvent = e as React.MouseEvent;
      setStartX(mouseEvent.pageX - (calendarRef.current?.offsetLeft || 0));
    } else {
      const touchEvent = e as React.TouchEvent;
      setStartX(
        touchEvent.touches[0].pageX - (calendarRef.current?.offsetLeft || 0),
      );
    }
    setScrollLeft(calendarRef.current?.scrollLeft || 0);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    let x: number;
    if (e.type === 'mousemove') {
      const mouseEvent = e as MouseEvent;
      x = mouseEvent.pageX - (calendarRef.current?.offsetLeft || 0);
    } else {
      const touchEvent = e as TouchEvent;
      x = touchEvent.touches[0].pageX - (calendarRef.current?.offsetLeft || 0);
    }
    const walk = (x - startX) * 1.5;
    if (calendarRef.current) {
      calendarRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

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
  }, [isDragging]);

  return (
    <>
      <div className="p-4 bg-white w-[360px] rounded-[16px] relative select-none">
        {/* Заголовок */}
        {(showHeader || showFilterButton || showDatePickerButton) && (
          <div className="flex justify-between items-center mb-4">
            {showHeader && (
              <h2 className="font-gerbera-h1 text-lg">{headerName}</h2>
            )}
            {(showFilterButton || showDatePickerButton) && (
              <div className="flex space-x-2">
                {/* Иконка фильтра */}
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

                {/* Иконка со стрелкой вниз */}
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
        )}

        {/* Вертикальный месяц */}
        <div className="absolute left-0 flex items-center">
          <div className="flex items-center justify-between">
            <span className="font-gerbera-sub1 text-light-gray-4 w-[35px] transform rotate-[-90deg] flex items-center justify-center">
              {format(selectedDate, 'LLLL', { locale: ru })}
            </span>
            <div className="border-r h-[48px] border-gray-300" />
          </div>
        </div>

        {/* Календарь */}
        <div
          className={`flex space-x-5 ml-7 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ width: '300px', overflowX: 'hidden' }}
          ref={calendarRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onDragStart={e => e.preventDefault()}
        >
          {renderWeekDays()}
        </div>
      </div>

      {/* Отображение компонента FilterCurator */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-t-[16px] w-[360px] shadow-lg">
            <FilterCurator
              onClose={() => setIsFilterOpen(false)}
              onOpenDatePicker={handleOpenDatePicker}
            />
          </div>
        </div>
      )}

      {/* Отображение компонента InputDate */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-t-[16px] w-[360px] shadow-lg">
            <InputDate
              onClose={() => setIsDatePickerOpen(false)}
              selectionMode="range"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
