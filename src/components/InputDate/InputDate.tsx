import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { format, getDay, startOfWeek, addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';

interface InputDateProps {
  selectedDate: Date;
  onDayClick: (day: Date) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const InputDate: React.FC<InputDateProps> = ({
  selectedDate,
  onDayClick,
  onClose,
  onConfirm,
}) => {
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
          onClick={() => onDayClick(day)}
        >
          {format(day, 'd')}
        </button>
      </div>
    ));
  };

  return (
    <div className="p-4 bg-white w-[360px] rounded-lg shadow-lg">
      {/* Навигация по месяцу */}
      <div className="flex justify-between items-center mb-2">
        <button className="p-1 bg-gray-100 rounded-full">
          <ChevronLeftIcon />
        </button>
        <span>{format(selectedDate, 'LLLL yyyy', { locale: ru })}</span>
        <button className="p-1 bg-gray-100 rounded-full">
          <ChevronRightIcon />
        </button>
      </div>

      {/* Дни недели и даты */}
      <div className="grid grid-cols-7 gap-2">{renderWeekDays()}</div>

      {/* Кнопки */}
      <div className="flex justify-between mt-4">
        <button className="text-gray-500" onClick={onClose}>
          Закрыть
        </button>
        <button className="text-light-brand-green" onClick={onConfirm}>
          Подтвердить
        </button>
      </div>
    </div>
  );
};

export default InputDate;
