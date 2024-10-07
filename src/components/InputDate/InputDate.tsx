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
  isBefore,
  isAfter,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import calendarIcon from '../../assets/icons/filter.svg';
import arrowLeftIcon from '../../assets/icons/arrow_left.png';
import arrowRightIcon from '../../assets/icons/arrow_right.png';
import arrowDownIcon from '../../assets/icons/arrow_down_s.png';
import { ru } from 'date-fns/locale';

interface IInputDateProps {
  onClose: () => void;
  selectionMode?: 'single' | 'range'; // New prop for selection mode
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

  // Handle click on a day in the calendar based on the selectionMode
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

  // Check if a day is within the selected range (including start and end)
  const isInRange = (day: Date) => {
    const normalizedDay = startOfDay(day);
    if (range.start && range.end) {
      const { start, end } =
        range.start <= range.end
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

      const isStart = range.start && isSameDay(day, range.start);
      const isEnd = range.end && isSameDay(day, range.end);
      const isWithinSelectedRange = isInRange(day);

      const isSelectedSingle =
        selectionMode === 'single' &&
        selectedDates.find(selectedDay => isSameDay(selectedDay, day));

      days.push(
        <div
          key={day.toString()}
          className={`w-8 h-8 flex justify-center items-center rounded-full cursor-pointer
            ${isSameMonth(day, currentMonth) ? 'text-black' : 'text-gray-400'}
            ${
              selectionMode === 'single' && isSelectedSingle
                ? 'bg-light-brand-green text-white'
                : ''
            }
            ${
              selectionMode === 'range' && isStart
                ? 'bg-white text-black border border-gray-300'
                : ''
            }
            ${
              selectionMode === 'range' && isEnd && !isStart
                ? 'bg-white text-black border border-gray-300'
                : ''
            }
            ${
              selectionMode === 'range' &&
              isWithinSelectedRange &&
              !isStart &&
              !isEnd
                ? 'bg-gray-200'
                : ''
            }
            `}
          onClick={() => handleDayClick(day)}
        >
          {format(day, 'd')}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="relative w-[360px] flex flex-col items-center justify-center">
      {/* Header with Input and Calendar Icon */}
      <div className="relative w-[328px] mt-[56px]">
        <input
          type="text"
          value={
            selectionMode === 'single'
              ? selectedDates.length
                ? format(selectedDates[0], 'MM/dd/yyyy')
                : format(startOfDay(new Date()), 'MM/dd/yyyy')
              : range.start && range.end
                ? `${format(range.start, 'MM/dd/yyyy')} - ${format(range.end, 'MM/dd/yyyy')}`
                : range.start
                  ? format(range.start, 'MM/dd/yyyy')
                  : format(startOfDay(new Date()), 'MM/dd/yyyy')
          }
          placeholder={format(startOfDay(new Date()), 'MM/dd/yyyy')}
          className="font-gerbera-h3 text-light-gray-8 bg-light-gray-1 rounded-[16px] w-[328px] h-[48px] px-4"
          readOnly
        />
        {/* Кнопка внутри инпута */}
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
        </button>
      </div>

      <span className="w-[328px] text-left font-gerbera-sub1 text-light-gray-5 pb-[12px]">
        ММ/ДД/ГГГГ
      </span>

      {/* Month and Year Navigation */}
      <div className="flex justify-between items-center mb-2 relative w-[360px] bg-light-gray-1">
        {/* Month Navigation */}
        <div className="flex items-center space-x-2">
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
        {/* Year Navigation */}
        <div className="flex items-center space-x-2">
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

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-2 text-sm text-gray-500 w-[328px]">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-y-1 w-[328px]">
        {renderCalendarDays()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4 w-[328px] font-gerbera-h3">
        <button className="text-light-gray-3 mr-[32px]" onClick={onClose}>
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
