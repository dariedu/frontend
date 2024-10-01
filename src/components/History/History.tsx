import React from 'react';

interface IHistoryProps {
  points: number;
  eventName: string;
  eventDate: string;
  eventTime: string;
  description: string;
}

const History: React.FC<IHistoryProps> = ({
  points,
  eventName,
  eventDate,
  eventTime,
  description,
}) => {
  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white rounded-[16px] shadow-lg p-6 w-[360px] max-w-md">
      {/* Заголовок карточки */}
      <div className="flex justify-between items-center">
        <h2 className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
          Списание баллов
        </h2>
        <span className="text-light-gray-5 dark:text-dark-gray-4 font-gerbera-h3">
          - {points} балла
        </span>
      </div>
      {/* Детали события */}
      <div className="mt-4 text-light-gray-6 dark:text-dark-gray-4 text-sm text-left">
        <p className="font-gerbera-sub1 mb-[4px]">{eventName}</p>
        <p className="font-gerbera-sub1 mb-[4px]">{eventDate}</p>
        <p className="font-gerbera-sub1 mb-[4px]">{eventTime}</p>
        <p className="font-gerbera-sub1 mb-[4px]">{description}</p>
      </div>
    </div>
  );
};

export default History;
