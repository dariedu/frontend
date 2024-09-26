// Требует доработки

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  // endOfMonth,
  startOfWeek,
  // endOfWeek,
  isSameDay,
  isSameMonth,
  addDays,
} from 'date-fns';
import calendar from '../../assets/icons/tap_calendarActive.svg';
import { ru } from 'date-fns/locale';

interface InputDateProps {
  onClose: () => void;
}

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const years = Array.from({ length: 61 }, (_, i) => 2030 - i);

const InputDate: React.FC<InputDateProps> = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevYear = () => {
    setCurrentMonth(subYears(currentMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentMonth(addYears(currentMonth, 1));
  };

  const handleMonthSelect = (month: string) => {
    const monthIndex = months.indexOf(month);
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setIsMonthOpen(false);
  };

  const handleYearSelect = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(Number(year));
    setCurrentMonth(newDate);
    setIsYearOpen(false);
  };

  const handleDayClick = (day: Date) => {
    if (selectedDates.find(selectedDay => isSameDay(selectedDay, day))) {
      setSelectedDates(
        selectedDates.filter(selectedDay => !isSameDay(selectedDay, day)),
      );
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    // const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: ru });
    // const endDate = endOfWeek(monthEnd, { locale: ru });

    const days: JSX.Element[] = [];
    let day = startDate;

    while (days.length < 42) {
      days.push(
        <div
          key={day.toString()}
          className={`w-8 h-8 flex justify-center items-center rounded-full cursor-pointer 
                ${isSameMonth(day, currentMonth) ? 'text-black' : 'text-gray-400'}
                ${
                  selectedDates.find(selectedDay => isSameDay(selectedDay, day))
                    ? 'bg-light-brand-green text-white'
                    : ''
                }`}
          onClick={() => handleDayClick(day)}
        >
          {format(day, 'd')}
        </div>,
      );
      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="relative">
      {/* Header with Input and Calendar Icon */}
      <div className="relative mt-[56px]">
        <input
          type="text"
          value={
            selectedDates.length ? format(selectedDates[0], 'MM/dd/yyyy') : ''
          }
          placeholder="ММ/ДД/ГГГГ"
          className="font-gerbera-h3 text-light-gray-8 bg-light-gray-1 rounded-[16px] pl-4 w-full h-[48px] pr-10"
          readOnly
        />
        {/* Кнопка внутри инпута */}
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <img src={calendar} alt="calendar" className="w-6 h-6" />
        </button>
      </div>
      <span className="block text-left font-gerbera-sub1 text-light-gray-5 pl-[16px] pb-[12px]">
        ММ/ДД/ГГГГ
      </span>

      {/* Month and Year Navigation */}
      <div className="flex justify-between items-center mb-2 relative">
        {/* Month Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon />
          </button>
          <div className="relative">
            <button
              className="flex items-center space-x-1"
              onClick={() => setIsMonthOpen(!isMonthOpen)}
            >
              <span>{format(currentMonth, 'LLLL', { locale: ru })}</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>

            {isMonthOpen && (
              <div className="fixed top-0 left-0 w-[360px] h-[336px] bg-white z-10 overflow-y-auto">
                <div className="p-4">
                  {months.map(month => (
                    <div
                      key={month}
                      onClick={() => handleMonthSelect(month)}
                      className="cursor-pointer p-2 hover:bg-light-gray-2"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-gray-100 rounded-full"
          >
            <ChevronRightIcon />
          </button>
        </div>
        {/* Year Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevYear}
            className="p-2 bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon />
          </button>
          <div className="relative">
            <button
              className="flex items-center space-x-1"
              onClick={() => setIsYearOpen(!isYearOpen)}
            >
              <span>{format(currentMonth, 'yyyy')}</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>

            {isYearOpen && (
              <div className="fixed top-0 left-0 w-[360px] h-[336px] bg-white z-10 overflow-y-auto">
                <div className="p-4">
                  {years.map(year => (
                    <div
                      key={year}
                      onClick={() => handleYearSelect(year.toString())}
                      className="cursor-pointer p-2 hover:bg-light-gray-2"
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleNextYear}
            className="p-2 bg-gray-100 rounded-full"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-2 text-sm text-gray-500">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-y-1">{renderCalendarDays()}</div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button className="text-gray-500" onClick={onClose}>
          Закрыть
        </button>
        <button className="text-light-brand-green" onClick={onClose}>
          Подтвердить
        </button>
      </div>
    </div>
  );
};

export default InputDate;
