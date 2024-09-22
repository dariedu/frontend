import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import { format, getDay, startOfWeek, addDays } from 'date-fns';
import filter from '../../assets/icons/filter.svg';
import ru from 'date-fns/locale/ru';

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
        <span className="text-xs text-gray-500">
          {format(day, 'EE', { locale: ru }).slice(0, 2)}
        </span>
        <button
          className={`w-6 h-6 flex items-center justify-center rounded-full ${
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
        <h2 className="text-lg font-bold">Другие добрые дела</h2>

        {/* Вертикальный месяц */}
        <div className="absolute left-0 top-8 flex items-center">
          <div className="h-[120px] flex items-center justify-between text-xs">
            <span className="font-gerbera-sub1 text-light-gray-4 transform rotate-[-90deg]">
              {format(selectedDate, 'LLLL', { locale: ru })}
            </span>
            <div className="border-r h-[48px] border-gray-300" />
          </div>
        </div>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <img src={filter} className="w-5 h-5 text-gray-500" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <button className="p-1 bg-gray-100 rounded-full">
                <ChevronLeftIcon />
              </button>
              <span>{format(selectedDate, 'LLLL yyyy', { locale: ru })}</span>
              <button className="p-1 bg-gray-100 rounded-full">
                <ChevronRightIcon />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">{renderWeekDays()}</div>
            <div className="flex justify-between mt-4">
              <button
                className="text-gray-500"
                onClick={() => setIsFullCalendarVisible(false)}
              >
                Закрыть
              </button>
              <button
                className="text-light-brand-green"
                onClick={() => setIsFullCalendarVisible(true)}
              >
                Подтвердить
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>

      {/* Календарь */}
      <div className="flex space-x-4 pl-10">{renderWeekDays()}</div>

      {isFullCalendarVisible && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-lg font-bold mb-4">Полный календарь</h2>
            {/* Полный календарь */}
            <div className="grid grid-cols-7 gap-2">{renderWeekDays()}</div>
            <button
              className="mt-4 text-light-brand-green"
              onClick={() => setIsFullCalendarVisible(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
