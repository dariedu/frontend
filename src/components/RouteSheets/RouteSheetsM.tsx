import React, { useEffect, useState, useContext } from 'react';
import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
import menuIcon from '../../assets/icons/icons.png';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
//import curator from '../../assets/icons/curator.svg';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from './RouteSheetsView';
//import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { getRouteSheets, IRouteSheet } from '../../api/routeSheetApi';
import { UserContext } from '../../core/UserContext';
// import { IUser } from '../../core/types';
// import { assignRouteSheet, TRouteSheetRequest } from '../../api/routeSheetApi';
import { TVolunteerForDeliveryAssignments } from '../../api/apiDeliveries';
//import { IDelivery } from '../../api/apiDeliveries';


interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена' | 'Нет доставок';
  routeSheetsData: IRouteSheet[];
  onClose: () => void;
  // onStatusChange: () => void;
  completedRouteSheets: boolean[];
  listOfVolunteers: TVolunteerForDeliveryAssignments[]
  onVolunteerAssign: (volunteerId: number, deliveryId: number, routeSheetId: number) => {}
  deliveryId:number
  //setCompletedRouteSheets: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const RouteSheetsM: React.FC<RouteSheetsProps> = ({
  status,
  routeSheetsData,
  onClose,
  // onStatusChange,
  completedRouteSheets,
  listOfVolunteers,
  onVolunteerAssign,
  deliveryId
 // setCompletedRouteSheets,
}) => {
  const { token } = useContext(UserContext); // Получаем токен из контекста пользователя
  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(Array(routeSheetsData.length).fill(false),);
  const [selectedVolunteers, setSelectedVolunteers] =
    useState<{ name: string; avatar: string }[]>(Array(routeSheetsData.length).fill({
      name: 'Не выбран',
      avatar: avatarIcon,
    }),
    );
  
  const [openVolunteerLists, setOpenVolunteerLists] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );
  const [isAllRoutesCompleted, setIsAllRoutesCompleted] = useState(false);
  const [isDeliveryCompletedModalOpen, setIsDeliveryCompletedModalOpen] = useState(false);
  const [deliveryCompletedOnce, setDeliveryCompletedOnce] = useState(false);
  const [routeSheets, setRouteSheets] = useState<IRouteSheet[]>([]);
console.log(listOfVolunteers, 'ListOfVolunteers')
  // console.log(isAllRoutesCompleted, isDeliveryCompletedModalOpen, onStatusChange, setDeliveryCompletedOnce, setSelectedVolunteers)
  
  useEffect(() => {
    // Загрузка данных маршрутных листов из API
    const fetchRouteSheets = async () => {
      if (!token) return;
      try {
        const data = await getRouteSheets(token);
        setRouteSheets(data);
      } catch (error) {
        console.error('Ошибка загрузки маршрутных листов:', error);
      }
    };

    fetchRouteSheets();
  }, [token]);

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

  //const handleComplete = (index: number) => {
    // setCompletedRouteSheets(prev =>
    //   prev.map((completed, idx) => (idx === index ? true : completed)),
    // );
  //};

  // const handleConfirmDeliveryCompletion = () => {
  //   setIsDeliveryCompletedModalOpen(false);
  //   setDeliveryCompletedOnce(true);
  //   onStatusChange();
  // };

  // const handleVolunteerSelect = (
  //   index: number,
  //   volunteerName: string,
  //   volunteerAvatar: string,
  // ) => {
  //   setSelectedVolunteers(prev =>
  //     prev.map((volunteer, idx) =>
  //       idx === index
  //         ? { name: volunteerName, avatar: volunteerAvatar }
  //         : volunteer,
  //     ),
  //   );
  //   setOpenVolunteerLists(prev =>
  //     prev.map((isOpen, idx) => (idx === index ? false : isOpen)),
  //   );
  // };

  // const handleTakeRoute = (index: number) => {
  //   setSelectedVolunteers(prev =>
  //     prev.map((volunteer, idx) =>
  //       idx === index ? { name: 'Куратор', avatar: curator } : volunteer,
  //     ),
  //   );
  //   setOpenVolunteerLists(prev =>
  //     prev.map((isOpen, idx) => (idx === index ? false : isOpen)),
  //   );
  // };

//   async function assignRoutSheetFunction(volunteerForRoutSheet: IUser, routeSheetId:number, deliveryId:number) {
//     let data:TRouteSheetRequest = {
//       volunteer_id: volunteerForRoutSheet.id,
//       delivery_id: deliveryId
//    }
//     if (token) {
//       try {
//         let result = await assignRouteSheet(routeSheetId, token, data);
//         if (result) {
//           console.log('success')
//         }
//       } catch (err) {
//         console.log(err, 'assignRoutSheetFunction list of volunteers')
//       }
//     }
// }

  return (
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex flex-col overflow-y-auto max-h-full" onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-center mb-4">
        <button onClick={onClose} className="mr-2">
          <img src={leftArrowIcon} alt="back" className="w-6 h-6" />
        </button>
        <h2 className="font-gerbera-h1 text-lg">{status} доставка</h2>
      </div>

      <div className="flex flex-col">
        {routeSheets.map((routeSheet, index) => {
          const isVolunteerSelected =
          selectedVolunteers[index].name !== 'Не выбран';
          return (
            <div key={routeSheet.id} className="mb-4 p-2 border rounded-lg">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-gerbera-h3 text-light-gray-5">
                  {`Маршрутный лист: ${routeSheet.name}`}
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

              <div className="flex items-center justify-between ">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    setOpenVolunteerLists(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? isOpen ? false: true : isOpen,
                      ),
                    )
                  }
                >
                  <img
                    src={selectedVolunteers[index].avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="font-gerbera-h3 text-light-gray-8" >
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

              {openVolunteerLists[index]&& (
                <ListOfVolunteers
                  listOfVolunteers={listOfVolunteers}
                  onOpenChange={() => { }}
                  showActions={false}
                  //onVolunteerClick={() => { }}
                  onVolunteerAssign={onVolunteerAssign}
                  deliveryId={deliveryId}
                  routeSheetName={`Маршрутный лист: ${routeSheet.name}`}
                  routeSheetId={routeSheet.id}
                />
              )}

              {openRouteSheets[index] && (
                <RouteSheetsView
                  routes={routeSheet.address.map(addr => ({
                    address: addr.address || 'Адрес не указан', // Используем поле address из TAddress
                    additionalInfo: addr.link || '', // Используем поле link для доп. информации, если оно существует
                    personName: addr.beneficiary || 'Имя не указано', // Имя получателя (beneficiary)
                    avatar: avatarIcon, // Пока что статичная иконка, так как в данных нет поля для аватара
                    needsPhoto: false, // Если необходима, можно добавить логику на основе условия
                  }))}
                  //onComplete={() => handleComplete(index)}
                  isCompleted={completedRouteSheets[index]}
                  isVolunteerSelected={isVolunteerSelected}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* {isAllRoutesCompleted && isDeliveryCompletedModalOpen && (
        <ConfirmModal
          title="Доставка завершена"
          description="+4 балла"
          confirmText="Ok"
          onConfirm={handleConfirmDeliveryCompletion}
          isOpen={isDeliveryCompletedModalOpen}
          onOpenChange={() => setIsDeliveryCompletedModalOpen(false)}
          isSingleButton={true}
        />
      )} */}
    </div>
  );
};

export default RouteSheetsM;
