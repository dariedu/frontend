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
} from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarIcon from '../../assets/icons/filter.svg?react';
import Arrow_down from './../../assets/icons/arrow_down.svg?react'
import Arrow_right from './../../assets/icons/arrow_right.svg?react'
import FilterCurator from '../FilterCurator/FilterCurator';
import { TTaskCategory } from '../../api/apiTasks';
import { Modal } from '../ui/Modal/Modal';

interface IInputDateProps {
  onClose: () => void;
  selectionMode?: 'single' | 'range';
  setCurrentDate: (v: Date[]) => void;
  categories: TTaskCategory[]; // Категории для фильтрации
  filterCategories: number[]; // Текущий выбранный фильтр
  setFilterCategories: React.Dispatch<React.SetStateAction<number[]>>; // Функция для установки фильтра
  maxYear?: number;
}


const InputDate: React.FC<IInputDateProps> = ({
  onClose,
  selectionMode = 'single',
  setCurrentDate,
  categories,
  filterCategories,
  setFilterCategories,
  maxYear
}) => {


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

  
  const years = Array.from({ length: 61 }, (_, i) => maxYear ? maxYear - i : 2030 - i);
  
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfDay( maxYear? new Date(maxYear, todayMonth, todayDay) : new Date()),
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    startOfDay(maxYear? new Date(maxYear, todayMonth, todayDay) : new Date()),
  ]);

  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handlePrevMonth = () =>
    setCurrentMonth(startOfMonth(subMonths(currentMonth, 1)));
  const handleNextMonth = () =>
    setCurrentMonth(startOfMonth(addMonths(currentMonth, 1)));
  const handlePrevYear = () =>
    setCurrentMonth(startOfMonth(subYears(currentMonth, 1)));
  const handleNextYear = () =>
    setCurrentMonth(startOfMonth(addYears(currentMonth, 1)));

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

  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: ru });

    // Определяем фактические начальную и конечную даты диапазона
    let displayStart: Date | null = null;
    let displayEnd: Date | null = null;

    if (range.start && range.end) {
      if (isBefore(range.start, range.end)) {
        displayStart = range.start;
        displayEnd = range.end;
      } else {
        displayStart = range.end;
        displayEnd = range.start;
      }
    }

    for (let i = 0; i < 42; i++) {
      const day = startOfDay(addDays(startDate, i));
      const isStart = displayStart && isSameDay(day, displayStart);
      const isEnd = displayEnd && isSameDay(day, displayEnd);
      const isWithinSelectedRange =
        displayStart &&
        displayEnd &&
        isWithinInterval(day, { start: displayStart, end: displayEnd });

      const isSelectedSingle =
        selectionMode === 'single' &&
        selectedDates.find(selectedDay => isSameDay(selectedDay, day));

      let dayClass = '';

      if (isSameMonth(day, currentMonth))
        dayClass += ' text-black dark:text-light-gray-1 w-[48px] h-[49px]';
      else dayClass += ' text-light-gray-5 dark:text-light-gray-3';
      if (selectionMode === 'single' && isSelectedSingle)
        dayClass += ' bg-light-brand-green rounded-full text-white';
      if (selectionMode === 'range') {
        if (range.start && !range.end && isSameDay(day, range.start)) {
          // Только начальная дата выбрана
          dayClass +=
            ' bg-light-gray-white dark:bg-light-gray-6 text-black border border-4 border-light-gray-2 dark:border-light-gray-5 rounded-full';
        } else if (isStart && isEnd) {
          // Начальная и конечная даты совпадают
          dayClass +=
            ' bg-light-gray-white dark:bg-light-gray-6 text-black border border-4 border-light-gray-2 dark:border-light-gray-5 rounded-full';
        } else if (isStart) {
          // Начало диапазона
          dayClass +=
            ' bg-light-gray-white dark:bg-light-gray-6 text-black border border-4 border-light-gray-2 dark:border-light-gray-5 rounded-l-full';
        } else if (isEnd) {
          // Конец диапазона
          dayClass +=
            ' bg-light-gray-white dark:bg-light-gray-6 text-black border border-4 border-light-gray-2 dark:border-light-gray-5 rounded-r-full';
        } else if (isWithinSelectedRange) {
          // Дата внутри выбранного диапазона
          dayClass += ' bg-light-gray-2 dark:bg-light-gray-5';
        }
      }

      //Стили для выделения диапазона дат
      days.push(
        <div
          key={day.toString()}
          className="relative m-0 p-0 h-[48px] w-[48px]"
        >
          {isWithinSelectedRange && (
            <div
              className={`absolute inset-0 bg-light-gray-2 dark:bg-light-gray-5 z-0 ${isStart ? 'rounded-l-full' : isEnd ? 'rounded-r-full' : ''}`}
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
      <div
        className="w-[360px] flex flex-col items-center justify-center bg-light-gray-white dark:bg-light-gray-7-logo rounded-t-2xl h-[570px] "
        onClick={e => e.stopPropagation()}
      >
        {/* Поле ввода с иконкой календаря */}
        <div className="relative w-[328px] mt-[56px] ">
          <input
            type="text"
            value={
              selectionMode === 'single'
                ? selectedDates.length
                  ? format(selectedDates[0], 'MM/dd/yyyy')
                  : format(startOfDay(new Date()), 'MM/dd/yyyy')
                : range.start && range.end
                  ? `${format(range.start!, 'MM/dd/yyyy')} - ${format(range.end!, 'MM/dd/yyyy')}`
                  : range.start
                    ? format(range.start!, 'MM/dd/yyyy')
                    : format(startOfDay(new Date()), 'MM/dd/yyyy')
            }
            placeholder={format(startOfDay(new Date()), 'MM/dd/yyyy')}
            className="outline-none font-gerbera-h3 text-light-gray-8 bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl w-[328px] h-[48px] px-4"
            readOnly
          />
          {selectionMode === 'range' && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsFilterOpen(true)}
            >
              <CalendarIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <span className="w-[328px] text-left font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-3 pb-[12px] pl-[16px]">
          ММ/ДД/ГГГГ
        </span>

        {/* Навигация по месяцу и году */}
        <div
          className={
            isYearOpen || isMonthOpen
              ? 'flex justify-around py-[23px] items-center w-[360px] h-[64px] bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-3 font-gerbera-h3 text-light-gray-5 rounded-t-2xl'
              : 'py-[23px] flex justify-between items-center w-[360px] h-[64px] bg-light-gray-1 font-gerbera-h3 text-light-gray-5 dark:bg-light-gray-6 dark:text-light-gray-3  rounded-t-2xl'
          }
        >
          <div
            className={
              isMonthOpen
                ? 'pl-[25px] w-[164px] text-center'
                : isYearOpen
                  ? 'pl-[25px] w-[164px] text-center'
                  : 'flex items-center space-x-2 pl-[16px]'
            }
          >
            <button onClick={handlePrevMonth} className="">
              {isYearOpen || isMonthOpen ? (
                ''
              ) : (
                <Arrow_right  className="rotate-180 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
              )}
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-1"
                onClick={() => {
                  setIsMonthOpen(!isMonthOpen);
                  setIsYearOpen(false);
                }}
              >
                <span className={isYearOpen ? 'text-light-gray-4' : ''}>
                  {format(currentMonth, 'LLLL', {
                    locale: ru,
                  })[0].toLocaleUpperCase() +
                    format(currentMonth, 'LLLL', { locale: ru }).slice(1)}
                </span>
                {isYearOpen ? (
                  ''
                ) : (
                  <Arrow_down  className="stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
                )}
              </button>
              {isMonthOpen && (
                <Modal
                  isOpen={isMonthOpen}
                  onOpenChange={setIsMonthOpen}
                  noColor={true}
                >
                  <div className="fixed w-[360px] bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-t-2xl mb-[20px]">
                    <div className="mx-4 pt-[12px] bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 h-[386px] overflow-y-auto">
                      {months.map(month => (
                        <div
                          key={month}
                          onClick={() => handleMonthSelect(month)}
                          className={
                            String(month).toLocaleLowerCase() ==
                            format(currentMonth, 'LLLL', { locale: ru })
                              ? 'bgImageInputDate cursor-pointer p-2 pl-[35px]'
                              : 'cursor-pointer p-2 pl-[35px]'
                          }
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              )}
            </div>
            <button onClick={handleNextMonth}>
              {isYearOpen || isMonthOpen ? (
                ''
              ) : (
                <Arrow_right  className="stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
              )}
            </button>
          </div>
          <div
            className={
              isYearOpen
                ? 'text-center mr-[9px]'
                : isMonthOpen
                  ? 'text-center mr-[40px]'
                  : 'flex items-center space-x-2'
            }
          >
            <button onClick={handlePrevYear} className="">
              {isYearOpen || isMonthOpen ? (
                ''
              ) : (
                <Arrow_right  className=" rotate-180 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
              )}
            </button>
            <div>
              <button
                className="flex items-center space-x-1"
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  setIsMonthOpen(false);
                }}
              >
                <span className={isMonthOpen ? 'text-light-gray-4' : ''}>
                  {format(currentMonth, 'yyyy')}
                </span>
                {isMonthOpen ? (
                  ''
                ) : (
                  <Arrow_down  className="stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
                  // <img src={arrowDownIcon} alt="стрелка вниз" />
                )}
              </button>

              {isYearOpen && (
                <Modal
                  isOpen={isYearOpen}
                  onOpenChange={setIsYearOpen}
                  noColor={true}
                >
                  <div className="fixed w-[360px]  bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-t-2xl mb-[20px]">
                    <div className="mx-4 pt-[12px] bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 h-[386px] overflow-y-auto">
                      {years.map(year => (
                        <div
                          key={year}
                          onClick={() => handleYearSelect(year.toString())}
                          className={
                            String(year) == format(currentMonth, 'yyyy')
                              ? 'bgImageInputDate cursor-pointer p-2 pl-[35px]'
                              : 'cursor-pointer p-2 pl-[35px]'
                          }
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              )}
            </div>
            <button onClick={handleNextYear} className="">
              {isYearOpen || isMonthOpen ? (
                ''
              ) : (
                <Arrow_right  className="stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"/>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center bg-light-gray-1 dark:bg-light-gray-6 w-[360px]">
          <div className="grid grid-cols-7 text-center mt-2 mb-2 text-sm text-light-gray-8-text dark:text-light-gray-1 w-[328px]">
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
            <button className="text-light-gray-3 dark:text-light-gray-4 mr-[32px]" onClick={onClose}>
              Закрыть
            </button>
            <button
              className="text-light-brand-green"
              onClick={() => {
                onClose();
                setCurrentDate(selectedDates);
              }}
            >
              Подтвердить
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-t-[16px] w-[360px] shadow-lg">
            <FilterCurator
              categories={categories}
              onOpenChange={setIsFilterOpen}
              setFilter={setFilterCategories}
              filtered={filterCategories}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default InputDate;
