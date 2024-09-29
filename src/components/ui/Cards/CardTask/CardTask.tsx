import React from 'react';
import metroIcon from '../../../../assets/icons/metro_station.svg';

interface CardTaskProps {
  title: string;
  subtitle: string;
  timeOrPeriod: string;
  points: string;
  type: 'time-based' | 'period-based';
}

const CardTask: React.FC<CardTaskProps> = ({
  title,
  subtitle,
  timeOrPeriod,
  points,
  type,
}) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-[16px] shadow w-[300px] space-x-3 mb-4">
      {/* Task Icon */}
      <div className="flex items-center justify-center bg-light-gray-4 w-10 h-10 rounded-full">
        <img src={metroIcon} alt="task-icon" className="w-6 h-6" />
      </div>

      {/* Task Details */}
      <div className="flex-1">
        <p className="text-black font-gerbera-h3">{title}</p>
        <p className="text-light-gray-3 text-xs">{subtitle}</p>
      </div>

      {/* Conditional Rendering for Time-Based or Period-Based */}
      {type === 'time-based' && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center bg-light-gray-4 w-[50px] h-[28px] rounded-full">
            <span className="text-black font-gerbera-sub2 text-xs">
              {timeOrPeriod}
            </span>
          </div>
          <div className="flex items-center justify-center bg-light-brand-green w-[70px] h-[28px] rounded-full">
            <span className="text-white font-gerbera-sub2 text-xs">
              {points}
            </span>
          </div>
        </div>
      )}

      {type === 'period-based' && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center bg-light-gray-4 w-[90px] h-[28px] rounded-full">
            <span className="text-black font-gerbera-sub2 text-xs">
              {timeOrPeriod}
            </span>
          </div>
          <div className="flex items-center justify-center bg-light-brand-green w-[70px] h-[28px] rounded-full">
            <span className="text-white font-gerbera-sub2 text-xs">
              {points}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTask;
