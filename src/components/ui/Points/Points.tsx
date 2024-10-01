import React from 'react';

interface IPointsProps {
  points: number;
}

const Points: React.FC<IPointsProps> = ({ points }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-[16px] shadow w-[360px] h-[60px]">
      {/* Текст */}
      <span className="font-gerbera-h1 text-light-gray-black">Ваши баллы</span>

      {/* Индикатор баллов */}
      <div className="flex items-center justify-center w-6 h-6 bg-light-brand-green text-light-gray-white font-gerbera-h3 rounded-full">
        {points}
      </div>
    </div>
  );
};

export default Points;
