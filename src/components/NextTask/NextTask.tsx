import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import pencil from '../../assets/icons/small_pencile.svg';

interface NextTaskProps {
  taskName: string;
  taskType: string;
  taskDate: string;
  taskPoints: number;
}

const NextTask: React.FC<NextTaskProps> = ({
  taskName,
  taskType,
  taskDate,
  taskPoints,
}) => {
  return (
    <div className="flex items-center justify-between bg-light-brand-green p-3.5 rounded-[16px] w-full max-w-[360px]">
      {/* Левая часть с иконкой и названием задачи */}
      <div className="flex items-center">
        {/* Аватарка/Иконка */}
        <Avatar.Root className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full mr-3">
          <Avatar.Image
            src="/path/to/icon.svg"
            alt="Task Icon"
            className="w-6 h-6"
          />
          <img src={pencil} alt="pencil" />
        </Avatar.Root>

        {/* Название и тип задачи */}
        <div className="text-left">
          <h3 className="font-gerbera-sub2 text-light-gray-white">
            {taskName}
          </h3>
          <p className="font-gerbera-sub1 text-light-gray-1">{taskType}</p>
        </div>
      </div>

      {/* Правая часть с датой и баллами */}
      <div className="flex space-x-3">
        {/* Дата */}
        <div className="bg-white font-gerbera-sub2 text-black px-3 py-1 rounded-full flex items-center justify-center">
          {taskDate}
        </div>

        {/* Баллы */}
        <div className="bg-white font-gerbera-sub2 text-light-brand-green px-3 py-1 rounded-full flex items-center justify-center">
          +{taskPoints} баллов
        </div>
      </div>
    </div>
  );
};

export default NextTask;
