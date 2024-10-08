import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  startOfWeek,
  isSameDay,
  isSameMonth,
  addDays,
  isWithinInterval,
  startOfDay,
  isBefore,
  isAfter,
} from 'date-fns';
import { ru } from 'date-fns/locale';

import calendarIcon from '../../assets/icons/filter.svg';
import arrowLeftIcon from '../../assets/icons/arrow_left.png';
import arrowRightIcon from '../../assets/icons/arrow_right.png';
import arrowDownIcon from '../../assets/icons/arrow_down_s.png';
import FilterCurator from '../FilterCurator/FilterCurator';

interface IInputDateProps {
  onClose: () => void;
  selectionMode?: 'single' | 'range';
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

const InputDate: React.FC<IInputDateProps> = ({
  onClose,
  selectionMode = 'single',
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfDay(new Date()));
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    startOfDay(new Date()),
  ]);
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handlePrevMonth = () => {
    setCurrentMonth(startOfMonth(subMonths(currentMonth, 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(startOfMonth(addMonths(currentMonth, 1)));
  };

  const handlePrevYear = () => {
    setCurrentMonth(startOfMonth(subYears(currentMonth, 1)));
  };

  const handleNextYear = () => {
    setCurrentMonth(startOfMonth(addYears(currentMonth, 1)));
  };

  const handleMonthSelect = (month: string) => {
    const monthIndex = months.indexOf(month);
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(startOfMonth(newDate));
    setIsMonthOpen(false);
  };

  const handleYearSelect = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(Number(year));
    setCurrentMonth(startOfMonth(newDate));
    setIsYearOpen(false);
  };

  const handleDayClick = (day: Date) => {
    const normalizedDay = startOfDay(day);
    if (selectionMode === 'single') {
      setSelectedDates([normalizedDay]);
    } else if (selectionMode === 'range') {
      if (!range.start || (range.start && range.end)) {
        setRange({ start: normalizedDay, end: null });
      } else {
        setRange({ ...range, end: normalizedDay });
      }
    }
  };

  const isInRange = (day: Date) => {
    const normalizedDay = startOfDay(day);
    if (range.start && range.end) {
      const { start, end } = isBefore(range.start, range.end)
        ? { start: range.start, end: range.end }
        : { start: range.end, end: range.start };
      return isWithinInterval(normalizedDay, { start, end });
    }
    return false;
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: ru });

    const days: JSX.Element[] = [];

    for (let i = 0; i < 42; i++) {
      const day = startOfDay(addDays(startDate, i));

      const isStart =
        range.start &&
        range.end &&
        (isSameDay(day, range.start) || isSameDay(day, range.end)) &&
        isBefore(range.start, range.end)
          ? isSameDay(day, range.start)
          : isSameDay(day, range.end);

      const isEnd =
        range.start &&
        range.end &&
        (isSameDay(day, range.start) || isSameDay(day, range.end)) &&
        isAfter(range.end, range.start)
          ? isSameDay(day, range.end)
          : isSameDay(day, range.start);

      const isWithinSelectedRange = isInRange(day);

      const isSelectedSingle =
        selectionMode === 'single' &&
        selectedDates.find(selectedDay => isSameDay(selectedDay, day));

      let dayClass = '';

      if (isSameMonth(day, currentMonth)) {
        dayClass += ' text-black w-[48px] h-[49px]';
      } else {
        dayClass += ' text-light-gray-5';
      }

      if (selectionMode === 'single' && isSelectedSingle) {
        dayClass += ' bg-light-brand-green rounded-full text-white';
      }

      if (selectionMode === 'range') {
        if (isStart && (!range.end || isSameDay(range.start, range.end))) {
          dayClass +=
            ' bg-white text-black border border-gray-300 rounded-full';
        } else if (isStart) {
          dayClass +=
            ' bg-white text-black border border-gray-300 rounded-l-full';
        } else if (isEnd) {
          dayClass +=
            ' bg-white text-black border border-gray-300 rounded-r-full';
        }
      }

      days.push(
        <div
          key={day.toString()}
          className="relative m-0 p-0 h-[48px] w-[48px]"
        >
          {isWithinSelectedRange && (
            <div
              className={`absolute inset-0 bg-light-gray-2 z-0 ${
                isStart ? 'rounded-l-full' : isEnd ? 'rounded-r-full' : ''
              }`}
            ></div>
          )}
          <div
            className={`relative z-10 w-full h-full flex justify-center items-center rounded-full cursor-pointer ${dayClass}`}
            onClick={() => handleDayClick(day)}
          >
            {format(day, 'd')}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <>
      <div className="relative w-[360px] flex flex-col items-center justify-center">
        {/* Поле ввода с иконкой календаря */}
        <div className="relative w-[328px] mt-[56px]">
          <input
            type="text"
            value={
              selectionMode === 'single'
                ? selectedDates.length
                  ? format(selectedDates[0], 'MM/dd/yyyy')
                  : format(startOfDay(new Date()), 'MM/dd/yyyy')
                : range.start && range.end
                  ? `${format(range.start, 'MM/dd/yyyy')} - ${format(
                      range.end,
                      'MM/dd/yyyy',
                    )}`
                  : range.start
                    ? format(range.start, 'MM/dd/yyyy')
                    : format(startOfDay(new Date()), 'MM/dd/yyyy')
            }
            placeholder={format(startOfDay(new Date()), 'MM/dd/yyyy')}
            className="font-gerbera-h3 text-light-gray-8 bg-light-gray-1 rounded-[16px] w-[328px] h-[48px] px-4"
            readOnly
          />
          {selectionMode === 'range' && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsFilterOpen(true)} // Открыть FilterCurator
            >
              <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
            </button>
          )}
        </div>

        <span className="w-[328px] text-left font-gerbera-sub1 text-light-gray-5 pb-[12px] pl-[16px]">
          ММ/ДД/ГГГГ
        </span>

        {/* Навигация по месяцу и году */}
        <div className="flex justify-between items-center relative w-[360px] h-[64px] bg-light-gray-1 font-gerbera-h3 text-light-gray-5">
          <div className="flex items-center space-x-2 pl-[16px]">
            <button onClick={handlePrevMonth} className="">
              <img src={arrowLeftIcon} alt="стрелка влево" />
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-1"
                onClick={() => {
                  setIsMonthOpen(!isMonthOpen);
                  setIsYearOpen(false);
                }}
              >
                <span>{format(currentMonth, 'LLLL', { locale: ru })}</span>
                <img src={arrowDownIcon} alt="стрелка вниз" />
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
            <button onClick={handleNextMonth} className="">
              <img src={arrowRightIcon} alt="стрелка вправо" />
            </button>
          </div>
          <div className="flex items-center space-x-2 pr-[16px]">
            <button onClick={handlePrevYear} className="">
              <img src={arrowLeftIcon} alt="стрелка влево" />
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-1"
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  setIsMonthOpen(false);
                }}
              >
                <span>{format(currentMonth, 'yyyy')}</span>
                <img src={arrowDownIcon} alt="стрелка вниз" />
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
            <button onClick={handleNextYear} className="">
              <img src={arrowRightIcon} alt="стрелка вправо" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center bg-light-gray-1 w-[360px]">
          <div className="grid grid-cols-7 text-center mt-2 mb-2 text-sm text-gray-500 w-[328px]">
            <span>Пн</span>
            <span>Вт</span>
            <span>Ср</span>
            <span>Чт</span>
            <span>Пт</span>
            <span>Сб</span>
            <span>Вс</span>
          </div>

          <div className="grid grid-cols-7 gap-0 w-[328px]">
            {renderCalendarDays()}
          </div>

          <div className="flex justify-end mt-5 mb-12 w-[328px] font-gerbera-h3">
            <button className="text-light-gray-3 mr-[32px]" onClick={onClose}>
              Закрыть
            </button>
            <button className="text-light-brand-green" onClick={onClose}>
              Подтвердить
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-t-[16px] w-[360px] shadow-lg">
            <FilterCurator onClose={() => setIsFilterOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default InputDate;
