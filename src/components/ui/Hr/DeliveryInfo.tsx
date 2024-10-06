import React, { useState, useEffect } from 'react';

interface IDeliveryInfoProps {}

const DeliveryInfo: React.FC<IDeliveryInfoProps> = () => {
  // Mock data that will eventually come from the backend
  const [startTime, setStartTime] = useState<string>('13:00');
  const [peopleCount, setPeopleCount] = useState<number>(5);

  // Simulate fetching data from the backend
  useEffect(() => {
    // Replace with API calls
    setStartTime('13:00');
    setPeopleCount(5);
  }, []);

  return (
    <div className="w-[360px] flex flex-col">
      <div className="flex space-x-2 w-[360px]">
        {/* Start Time Info */}
        <div className="bg-gray-100 p-4 rounded-lg w-[160px] h-[62px] text-left">
          <div className="font-gerbera-sub2 text-light-gray-3 text-sm mb-1">
            Время начала
          </div>
          <div className="font-gerbera-h3 text-light-gray-8">{startTime}</div>
        </div>

        {/* People Count Info */}
        <div className="bg-gray-100 p-4 rounded-lg w-[160px] h-[62px] text-left">
          <div className="font-gerbera-sub2 text-light-gray-3 text-sm mb-1">
            Записавшиеся
          </div>
          <div className="font-gerbera-h3 text-light-gray-8">
            {peopleCount} человек
          </div>
        </div>
      </div>
      <button className="btn-M-WhiteDefault w-[328px] h-[48px] text-light-brand-green mt-[20px]">
        Список записавшихся волонтеров
      </button>
    </div>
  );
};

export default DeliveryInfo;
