import React, { useState, useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import filterIcon from '../../assets/icons/filter.svg';
import FilterCurator from '../FilterCurator/FilterCurator';
import InputDate from '../InputDate/InputDate';

interface ICalendarProps {
  headerName?: string; // Сделаем headerName опциональным
  showHeader?: boolean; // Пропс для управления отображением заголовка и фильтра
}

const Calendar: React.FC<ICalendarProps> = ({ headerName, showHeader }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Начало недели всегда фиксировано на текущем выбранном дне
  const startOfWeekDate = startOfWeek(new Date(), { locale: ru });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Обработчик для открытия окна выбора даты
  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const renderWeekDays = () => {
    // Массив из 14 дней (2 недели)
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
          draggable={false} // Prevent default dragging on button
        >
          {format(day, 'd')}
        </button>
      </div>
    ));
  };

  // Обработчики для перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (calendarRef.current?.offsetLeft || 0));
    setScrollLeft(calendarRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (calendarRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Adjust scroll speed as needed
    if (calendarRef.current) {
      calendarRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Add global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUpOrLeave);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    };
  }, [isDragging]);

  return (
    <>
      <div className="p-4 bg-white w-[360px] rounded-[16px] relative select-none">
        {/* Заголовок */}
        {showHeader && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-gerbera-h1 text-lg">{headerName}</h2>

            {/* Иконка фильтра */}
            <button
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setIsFilterOpen(true)}
              draggable={false} // Prevent default dragging on button
            >
              <img
                src={filterIcon}
                alt="filter"
                className="w-8 h-8"
                draggable={false}
              />
            </button>
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
          onMouseDown={handleMouseDown}
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
          <div className="relative bg-white p-4 rounded-t-[16px] w-[360px] shadow-lg">
            <InputDate onClose={() => setIsDatePickerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
