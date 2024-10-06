import React, { useState } from 'react';
import RouteSheets from '../../RouteSheets/RouteSheets';
import DeliveryInfo from '../../ui/Hr/DeliveryInfo';

interface IDeliveryTypeProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена';
  points?: number; // Баллы для состояния Завершена
}

const DeliveryType: React.FC<IDeliveryTypeProps> = ({ status, points }) => {
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Обработчик для кнопки открытия RouteSheets
  const handleDeliveryClick = () => {
    setIsRouteSheetsOpen(true);
  };

  return (
    <div className="w-[360px] mh-[227px] p-4 bg-light-gray-white rounded-[16px]">
      {/* Основной блок статуса */}
      <div className="flex items-center justify-between space-x-2">
        {/* Показ текущего статуса */}
        <div
          className={`btn-S-GreenDefault flex items-center justify-center ${
            status === 'Активная' || status === 'Завершена' ? 'mr-[10px]' : ''
          }`}
          style={{ borderRadius: '100px' }}
        >
          {status}
        </div>

        {/* Если статус "Активная", отображается кнопка "Доставка" */}
        {status === 'Активная' && (
          <button
            onClick={handleDeliveryClick}
            className="flex items-center space-x-1 text-light-gray-black focus:outline-none"
          >
            <span className="font-gerbera-sub2 text-light-gray-3">
              Доставка
            </span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Если статус "Завершена", отображается кнопка с баллами и стрелка */}
        {status === 'Завершена' && points && (
          <div className="flex space-x-2 items-center">
            {/* Кнопка с баллами */}
            <div
              className="btn-S-GreenDefault flex items-center justify-center px-4 py-1"
              style={{ borderRadius: '100px' }}
            >
              {`+${points} балла`}
            </div>
            {/* Кнопка со стрелкой */}
            <button
              onClick={handleDeliveryClick}
              className="flex items-center text-light-gray-3 focus:outline-none"
            >
              <span className="font-gerbera-sub2">Доставка</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
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

      {/* Модальное окно для RouteSheets */}
      {isRouteSheetsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-t-[16px] w-[360px] shadow-lg">
            <RouteSheets title="Маршрутный лист" />
            <button
              onClick={() => setIsRouteSheetsOpen(false)}
              className="absolute top-2 right-2 w-6 h-6 text-gray-500 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryType;
