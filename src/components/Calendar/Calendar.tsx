import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import InputDate from '../InputDate/InputDate';
import { format, getDay, startOfWeek, addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';
import filter from '../../assets/icons/filter.svg';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFullCalendarVisible, setIsFullCalendarVisible] = useState(false);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const renderWeekDays = () => {
    const startOfWeekDate = startOfWeek(selectedDate, { locale: ru });
    const days = Array.from({ length: 7 }).map((_, index) =>
      addDays(startOfWeekDate, index),
    );

    return days.map((day, index) => (
      <div key={index} className="flex flex-col items-center">
        <span className="text-xs pb-2 text-gray-500">
          {format(day, 'EE', { locale: ru }).slice(0, 2)}
        </span>
        <button
          className={`font-gerbera-sub2 w-6 h-6 flex items-center justify-center rounded-full ${
            getDay(selectedDate) === getDay(day)
              ? 'bg-light-brand-green text-white'
              : 'text-black'
          }`}
          onClick={() => handleDayClick(day)}
        >
          {format(day, 'd')}
        </button>
      </div>
    ));
  };

  return (
    <div className="p-4 bg-white w-[360px] rounded-lg shadow relative">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-gerbera-h1 text-lg">Другие добрые дела</h2>

        {/* Вертикальный месяц */}
        <div className="absolute left-0 top-14 flex items-center">
          <div className="h-[48px] flex items-center justify-between text-xs">
            <span className="font-gerbera-sub1 text-light-gray-4 transform rotate-[-90deg]">
              {format(selectedDate, 'LLLL', { locale: ru })}
            </span>
            <div className="border-r h-[48px] border-gray-300" />
          </div>
        </div>

        {/* Иконка фильтра */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <img src={filter} className="w-5 h-5 text-gray-500" />
            </button>
          </Popover.Trigger>

          {/* Выпадающий календарь */}
          <Popover.Content className="p-4 bg-white rounded-lg shadow-lg">
            <InputDate
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              onClose={() => setIsFullCalendarVisible(false)}
              onConfirm={() => setIsFullCalendarVisible(false)}
            />
          </Popover.Content>
        </Popover.Root>
      </div>

      {/* Основной календарь: отображение всех дней недели */}
      <div className="flex space-x-5 pl-10">{renderWeekDays()}</div>

      {/* Полный календарь (открывается при клике на фильтр) */}
      {isFullCalendarVisible && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <InputDate
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
            onClose={() => setIsFullCalendarVisible(false)}
            onConfirm={() => setIsFullCalendarVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
