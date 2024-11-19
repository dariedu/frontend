import React, { useState, useEffect } from 'react';
//import ListOfVolunteers from '../../ListOfVolunteers/ListOfVolunteers';

interface IDeliveryInfoProps {}

const DeliveryInfo: React.FC<IDeliveryInfoProps> = () => {
  // Mock data that will eventually come from the backend
  const [startTime, setStartTime] = useState<string>('13:00');
  const [peopleCount, setPeopleCount] = useState<number>(5);
  // const [isVolunteersListOpen, setIsVolunteersListOpen] =
  //   useState<boolean>(false);

  // Simulate fetching data from the backend
  useEffect(() => {
    // Replace with API calls
    setStartTime('13:00');
    setPeopleCount(5);
  }, []);

  // Заглушки для пропсов ListOfVolunteers
  // const handleSelectVolunteer = (
  //   volunteerName: string,
  //   volunteerAvatar: string,
  // ) => {
  //   console.log('Selected volunteer:', volunteerName, volunteerAvatar);
  // };

  // const handleTakeRoute = () => {
  //   console.log('Route taken');
  // };

  return (
    <div className="w-[360px] flex flex-col items-center bg-light-gray-white">
      <div className="flex space-x-2 justify-center w-[360px]">
        {/* Start Time Info */}
        <div className="bg-light-gray-1 p-4 rounded-lg w-[160px] h-[62px] text-left">
          <div className="font-gerbera-sub2 text-light-gray-3 text-sm mb-1">
            Время начала
          </div>
          <div className="font-gerbera-h3 text-light-gray-8">{startTime}</div>
        </div>

        {/* People Count Info */}
        <div className="bg-light-gray-1 p-4 rounded-lg w-[160px] h-[62px] text-left">
          <div className="font-gerbera-sub2 text-light-gray-3 text-sm mb-1">
            Записавшиеся
          </div>
          <div className="font-gerbera-h3 text-light-gray-8">
            {peopleCount} человек
          </div>
        </div>
      </div>
      <button
        className="btn-M-WhiteDefault font-gerbera-h3 w-[328px] h-[48px] text-light-brand-green mt-[20px] mb-[32px]"
        // onClick={() => setIsVolunteersListOpen(prev => !prev)}
      >
        Список записавшихся волонтеров
      </button>

      {/* Показать или скрыть компонент ListOfVolunteers при нажатии на кнопку */}
      {/* { {isVolunteersListOpen && (
        <ListOfVolunteers
          showActions={false}
          onSelectVolunteer={handleSelectVolunteer}
          onTakeRoute={handleTakeRoute}
          onClose={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )} } */}
    </div>
  );
};

export default DeliveryInfo;
