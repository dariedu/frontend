import React from 'react';
import { getBallCorrectEndingName } from '../../helperFunctions/helperFunctions';

interface IPointsProps {
  points: number;
}

const Points: React.FC<IPointsProps> = ({ points }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-light-gray-white rounded-2xl w-full max-w-[500px] h-[60px] dark:bg-light-gray-7-logo">
      {/* Текст */}
      <span className="font-gerbera-h1 text-light-gray-black dark:text-light-gray-white">В вашей копилке</span>

      {/* Индикатор баллов */}
      <div className="flex items-center justify-center w-fit px-3 h-6 bg-light-brand-green text-light-gray-white font-gerbera-h3 rounded-2xl">
        {points}{" "}{getBallCorrectEndingName(points)}
      </div>
    </div>
  );
};

export default Points;
