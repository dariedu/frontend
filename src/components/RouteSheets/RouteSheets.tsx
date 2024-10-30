import React, { useEffect, useState } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import curator from '../../assets/icons/curator.svg';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from './RouteSheetsView';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

interface RouteSheet {
  id: number;
  title: string;
}

interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена' | 'Нет доставок';
  routeSheetsData: RouteSheet[];
  onClose: () => void;
  onStatusChange: () => void;
  completedRouteSheets: boolean[];
  setCompletedRouteSheets: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const mockRoutes = [
  {
    address: 'ул. Бобруйская 66',
    additionalInfo: '3 подъезд 10 этаж кв 143 код домофона #3214',
    personName: 'Петрова Галина Сергеевна',
    avatar: avatarIcon,
  },
];

const RouteSheets: React.FC<RouteSheetsProps> = ({
  status,
  routeSheetsData,
  onClose,
  onStatusChange,
  completedRouteSheets,
  setCompletedRouteSheets,
}) => {
  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );
  const [selectedVolunteers, setSelectedVolunteers] = useState<
    { name: string; avatar: string }[]
  >(
    Array(routeSheetsData.length).fill({
      name: 'Не выбран',
      avatar: avatarIcon,
    }),
  );
  const [openVolunteerLists, setOpenVolunteerLists] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );
  const [isAllRoutesCompleted, setIsAllRoutesCompleted] = useState(false);
  const [isDeliveryCompletedModalOpen, setIsDeliveryCompletedModalOpen] =
    useState(false);
  const [deliveryCompletedOnce, setDeliveryCompletedOnce] = useState(false); // Для отслеживания завершения доставки

  useEffect(() => {
    // Проверяем завершены ли все маршрутные листы
    if (
      completedRouteSheets.every(completed => completed) &&
      !deliveryCompletedOnce
    ) {
      setIsAllRoutesCompleted(true);
      setIsDeliveryCompletedModalOpen(true); // Показываем модальное окно
    }
  }, [completedRouteSheets, deliveryCompletedOnce]);

  const handleComplete = (index: number) => {
    setCompletedRouteSheets(prev =>
      prev.map((completed, idx) => (idx === index ? true : completed)),
    );
  };

  const handleConfirmDeliveryCompletion = () => {
    setIsDeliveryCompletedModalOpen(false); // Закрываем модалку
    setDeliveryCompletedOnce(true); // Устанавливаем флаг завершения, чтобы не показывать снова
    onStatusChange(); // Меняем статус доставки на "Завершена"
  };

  // Функция для выбора волонтёра и закрытия списка волонтеров
  const handleVolunteerSelect = (
    index: number,
    volunteerName: string,
    volunteerAvatar: string,
  ) => {
    setSelectedVolunteers(prev =>
      prev.map((volunteer, idx) =>
        idx === index
          ? { name: volunteerName, avatar: volunteerAvatar }
          : volunteer,
      ),
    );
    setOpenVolunteerLists(prev =>
      prev.map((isOpen, idx) => (idx === index ? false : isOpen)),
    );
  };

  // Функция для "Забрать себе" и закрытия списка волонтеров
  const handleTakeRoute = (index: number) => {
    setSelectedVolunteers(prev =>
      prev.map((volunteer, idx) =>
        idx === index ? { name: 'Куратор', avatar: curator } : volunteer,
      ),
    );
    setOpenVolunteerLists(prev =>
      prev.map((isOpen, idx) => (idx === index ? false : isOpen)),
    );
  };

  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center mb-4">
        <button onClick={onClose} className="mr-2">
          <img src={leftArrowIcon} alt="back" className="w-6 h-6" />
        </button>
        <h2 className="font-gerbera-h1 text-lg">{status} доставка</h2>
      </div>

      <div className="flex flex-col">
        {routeSheetsData.map((routeSheet, index) => {
          const isVolunteerSelected =
            selectedVolunteers[index].name !== 'Не выбран';

          return (
            <div key={routeSheet.id} className="mb-4 p-2 border rounded-lg">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-gerbera-h3 text-light-gray-5">
                  {`Маршрутный лист ${index + 1}`}
                </span>
                <div
                  className="w-6 h-6 ml-2 cursor-pointer"
                  onClick={() =>
                    setOpenRouteSheets(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? !isOpen : isOpen,
                      ),
                    )
                  }
                >
                  <img
                    src={arrowIcon}
                    alt="arrow"
                    className={`w-6 h-6 transform ${
                      openRouteSheets[index] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    setOpenVolunteerLists(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? true : isOpen,
                      ),
                    )
                  }
                >
                  <img
                    src={selectedVolunteers[index].avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="font-gerbera-h3 text-light-gray-8">
                    {selectedVolunteers[index].name}
                  </span>
                </div>
                {completedRouteSheets[index] ? (
                  <span className="font-gerbera-sub2 text-light-gray-white flex items-center justify-center ml-4 bg-light-gray-3 rounded-[16px] w-[112px] h-[28px]">
                    Завершена
                  </span>
                ) : isVolunteerSelected ? (
                  <img
                    src={menuIcon}
                    alt="menu"
                    className="w-[36px] h-[35px] cursor-pointer"
                  />
                ) : null}
              </div>

              {openVolunteerLists[index] && (
                <ListOfVolunteers
                  onSelectVolunteer={(name, avatar) =>
                    handleVolunteerSelect(index, name, avatar)
                  }
                  onTakeRoute={() => handleTakeRoute(index)}
                  onClose={() =>
                    setOpenVolunteerLists(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? false : isOpen,
                      ),
                    )
                  }
                />
              )}

              {openRouteSheets[index] && (
                <RouteSheetsView
                  routes={mockRoutes}
                  onComplete={() => handleComplete(index)}
                  isCompleted={completedRouteSheets[index]}
                  isVolunteerSelected={isVolunteerSelected}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Модальное окно должно появляться только один раз при завершении доставки */}
      {isAllRoutesCompleted && isDeliveryCompletedModalOpen && (
        <ConfirmModal
          title="Доставка завершена"
          description="+4 балла"
          confirmText="Ok"
          onConfirm={handleConfirmDeliveryCompletion}
          isOpen={isDeliveryCompletedModalOpen}
          onOpenChange={() => setIsDeliveryCompletedModalOpen(false)}
          isSingleButton={true}
        />
      )}
    </div>
  );
};

export default RouteSheets;
