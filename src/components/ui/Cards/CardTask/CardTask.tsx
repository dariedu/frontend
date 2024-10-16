import React from 'react';
import metroIcon from '../../../../assets/icons/metro_station.svg';
import onlineIcon from '../../../../assets/icons/onlineIcon.svg';

interface ICardTaskProps {
  title: string;
  subtitle: string;
  timeOrPeriod: string;
  additionalTime?: string;
  points: string;
  typeTask: 'time-based' | 'period-based';
}

const CardTask: React.FC<ICardTaskProps> = ({
  title,
  subtitle,
  timeOrPeriod,
  additionalTime,
  points,
  typeTask,
}) => {
  const icon = subtitle === 'Онлайн' ? onlineIcon : metroIcon;

  return (
    <div className="p-4 bg-light-gray-1 rounded-[16px] shadow w-[240px] h-[118px] mb-4">
      <div className="flex items-center mb-[24px]">
        {/* Task Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full pr-[1px]">
          <img src={icon} alt="task-icon" className="w-10 h-10" />
        </div>

        {/* Task Details */}
        <div className="flex flex-col text-left">
          <p className="text-light-gray-black font-gerbera-sub2">{title}</p>
          <p className="text-light-gray-black font-gerbera-sub1">{subtitle}</p>
        </div>
      </div>

      {/* Conditional Rendering for Time-Based or Period-Based */}
      {typeTask === 'time-based' && (
        <div className="flex items-center gap-[4px]">
          {/* Дополнительное время (если оно есть) */}
          {additionalTime && (
            <div className="flex items-center justify-center bg-light-gray-white w-[54px] h-[28px] rounded-full">
              <span className="text-black font-gerbera-sub2">
                {additionalTime}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center bg-light-gray-white w-[54px] h-[28px] rounded-full">
            <span className="text-black font-gerbera-sub2">{timeOrPeriod}</span>
          </div>
          <div className="flex items-center justify-center bg-light-brand-green min-w-[75px] h-[28px] rounded-full">
            <span className="text-light-gray-white font-gerbera-sub2">
              {points}
            </span>
          </div>
        </div>
      )}

      {typeTask === 'period-based' && (
        <div className="flex items-center gap-[4px]">
          <div className="flex items-center justify-center bg-light-gray-white min-w-[75px] h-[28px] rounded-full">
            <span className="text-black font-gerbera-sub2">{timeOrPeriod}</span>
          </div>
          <div className="flex items-center justify-center bg-light-brand-green min-w-[75px] h-[28px] rounded-full">
            <span className="text-light-gray-white font-gerbera-sub2">
              {points}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTask;
