import React from 'react';
import pencilIcon from '../../../assets/icons/small_pencile.svg';
import arrow_right from '../../../assets/icons/arrow_right.png';

interface FunctionItem {
  label: string;
  hasIcon?: boolean;
}

const functionsList: FunctionItem[] = [
  { label: 'Система начисления бонусов' },
  { label: 'Правила поведения волонтера' },
  { label: 'Инструкции для волонтера' },
  { label: 'Внести предложение', hasIcon: true },
];

const Functions: React.FC = () => {
  return (
    <div className="space-y-4 w-[360px] h-[66px]">
      {functionsList.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-[16px] shadow"
        >
          <span className="font-gerbera-h3 text-light-gray-black">
            {item.label}
          </span>
          {/* Если у функции есть иконка, отображаем её, иначе стрелочку */}
          {item.hasIcon ? (
            <img src={pencilIcon} alt="Edit" className="w-[42px] h-[42px]" />
          ) : (
            <img src={arrow_right} alt="arrow_right" className="w-8 h-8" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Functions;
