import React from 'react';
import DeliveryInfo from '../../ui/Hr/DeliveryInfo';
import arrowRightIcon from '../../../assets/icons/arrow_right.png';

interface IDeliveryTypeProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена';
  points?: number; // Баллы для состояния Завершена
  onDeliveryClick: () => void; // Функция для открытия RouteSheets
}

const DeliveryType: React.FC<IDeliveryTypeProps> = ({
  status,
  points,
  onDeliveryClick,
}) => {
  return (
    <div className="w-[360px] mh-[227px] p-4 bg-light-gray-white rounded-[16px]">
      {/* Основной блок статуса */}
      <div className="flex items-center justify-between space-x-2">
        {/* Показ текущего статуса */}
        <div
          className={`flex items-center justify-center ${
            status === 'Завершена'
              ? 'btn-S-GreenInactive'
              : 'btn-S-GreenDefault'
          } ${status === 'Активная' || status === 'Завершена' ? 'mr-[10px]' : ''}`}
          style={{ borderRadius: '100px' }}
        >
          {status}
        </div>

        {/* Если статус "Активная", отображается кнопка "Доставка" */}
        {status === 'Активная' && (
          <button
            onClick={onDeliveryClick}
            className="flex items-center space-x-1 text-light-gray-black focus:outline-none"
          >
            <span className="font-gerbera-sub2 text-light-gray-3">
              Доставка
            </span>
            <img
              src={arrowRightIcon}
              alt="arrowRightIcon"
              className="w-4 h-4"
            />
          </button>
        )}

        {/* Если статус "Завершена", отображается кнопка с баллами и стрелка */}
        {status === 'Завершена' && points && (
          <div className="flex space-x-2 items-center">
            {/* Кнопка с баллами */}
            <div
              className="bg-light-brand-green font-gerbera-sub2 text-light-gray-white flex items-center justify-center px-4 py-1"
              style={{ borderRadius: '100px' }}
            >
              {`+${points} балла`}
            </div>
            {/* Кнопка со стрелкой */}
            <button
              onClick={onDeliveryClick}
              className="flex items-center text-light-gray-black focus:outline-none"
            >
              <span className="font-gerbera-sub2 text-light-gray-3">
                Доставка
              </span>
              <img
                src={arrowRightIcon}
                alt="arrowRightIcon"
                className="w-4 h-4"
              />
            </button>
          </div>
        )}
      </div>

      {/* Если статус "Ближайшая", добавляется компонент DeliveryInfo */}
      {status === 'Ближайшая' && (
        <div className="mt-4">
          <DeliveryInfo />
        </div>
      )}
    </div>
  );
};

export default DeliveryType;
