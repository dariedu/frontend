import React, {useState, useContext, useEffect} from 'react';
//import avatarIcon from '../../assets/route_sheets_avatar.svg';
import arrowIcon from '../../assets/icons/arrow_down.png';
//import menuIcon from '../../assets/icons/icons.png';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from './RouteSheetsView';
import {IRouteSheet, assignRouteSheet, type TRouteSheetRequest} from '../../api/routeSheetApi';
import { TVolunteerForDeliveryAssignments } from '../../api/apiDeliveries';
import { type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import { UserContext } from '../../core/UserContext';
//import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';


interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершенная' 
  routeSheetsData: IRouteSheet[]
  onClose: () => void
  //completedRouteSheets: boolean[];
  listOfVolunteers: TVolunteerForDeliveryAssignments[]
  deliveryId: number
  assignedRouteSheets:IRouteSheetAssignments[]
}

const RouteSheetsM: React.FC<RouteSheetsProps> = ({
  status,
  routeSheetsData,
  onClose,
  //completedRouteSheets,
  listOfVolunteers,
  deliveryId,
  assignedRouteSheets
}) => {

 console.log(routeSheetsData, "routeSheetsData")
  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(Array(routeSheetsData.length).fill(false),);
  // const [selectedVolunteers, setSelectedVolunteers] =
  //   useState<{ name: string; avatar: string }[]>(Array(routeSheetsData.length).fill({
  //     name: 'Не выбран',
  //     avatar: avatarIcon,
  //   }),
  //   );
  interface IfilteredRouteSheet extends IRouteSheet{
    volunteerFullName?:string
  }
  
  const [openVolunteerLists, setOpenVolunteerLists] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );

  const [assignVolunteerSuccess, setAssignVolunteerSuccess] = useState(false)
  const [assignVolunteerFail, setAssignVolunteerFail] = useState(false)
  const [filtered, setFiltered] = useState<IfilteredRouteSheet[]>([])
  const [filteredSuccess, setFilteredSuccess] = useState(false)
   /// используем контекст юзера
   const userValue = useContext(UserContext);
   const token = userValue.token;
  //// используем контекст
  
////проверяем назначен ли волонтер на конкретный маршрутный лист и добавляем к объекту маршрутного листа volunteerFullName
  function findAssignedRouteSheets() {
    let filtered: number[] = [];
    const routeSheetsWithVName: IfilteredRouteSheet[]=[];
    routeSheetsData.forEach(i => routeSheetsWithVName.push(i));

    routeSheetsData.forEach((item) => filtered.push(item.id))
    let final:{ id: number,  volunteerId: number, volunteerFullName:string}[] = [];
    for (let i = 0; i < filtered.length; i++){
      assignedRouteSheets.forEach(r => {
        if (r.route_sheet == filtered[i])
          final.push({ id: r.route_sheet, volunteerId: r.volunteer, volunteerFullName: "" })
      });

      final.forEach(i => {
        listOfVolunteers.forEach(y => {
          if (y.id == i.volunteerId) {
            i.volunteerFullName = `${y.name} ${y.last_name}`
          }
        })
      });
      
      final.forEach((i) => {
        routeSheetsWithVName.forEach((y => {
          if (y.id == i.id) {
         y.volunteerFullName = i.volunteerFullName
       }
     }))
   })
      setFiltered(routeSheetsWithVName);
      setFilteredSuccess(true)
    }
  }
  useEffect(()=>{findAssignedRouteSheets()}, [assignVolunteerSuccess])

  /////// записываем маршрутный лист на волонтера
  async function onVolunteerAssign(volunteerId: number, deliveryId: number, routeSheetId: number) {
    let object:TRouteSheetRequest = {
      volunteer_id: volunteerId,
      delivery_id: deliveryId,
      routesheet_id:routeSheetId
    }
    if (token) {
      try {
        let result = await assignRouteSheet(token, object)
        if (result == true) {
          setAssignVolunteerSuccess(true)
        }
      } catch (err) {
        setAssignVolunteerFail(true)
      }
    }
  }
  

  //let assigned = assignedRouteSheets.find(r=>{r.route_sheet == routeS.id})

  return ( filteredSuccess &&
    <div className="w-[360px] bg-white p-4 rounded-lg shadow-md flex flex-col overflow-y-auto max-h-full" onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-center mb-4">
        <button onClick={onClose} className="mr-2">
          <img src={leftArrowIcon} alt="back" className="w-6 h-6" />
        </button>
        <h2 className="font-gerbera-h1 text-lg">{status} доставка</h2>
      </div>
      <div className="flex flex-col">
        {filtered.map((routeS, index) => {
          return (
            <div key={routeS.id} className="mb-4 p-2 border rounded-lg">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-gerbera-h3 text-light-gray-5">
                  {`Маршрутный лист: ${routeS.name}`}
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
                  {/* <img
                    src={selectedVolunteers[index].avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  /> */}
                  <span className="font-gerbera-h3 text-light-gray-8" >
                    {routeS.volunteerFullName && routeS.volunteerFullName.length > 0 ? routeS.volunteerFullName : 'Не выбран' }
                  </span>
                </div>
              </div>

              {openVolunteerLists[index]&& (
                <ListOfVolunteers
                  listOfVolunteers={listOfVolunteers}
                  onOpenChange={() => { }}
                  showActions={false}
                  onVolunteerAssign={onVolunteerAssign}
                  deliveryId={deliveryId}
                  routeSheetName={`Маршрутный лист: ${routeS.name}`}
                  routeSheetId={routeS.id}
                  setAssignVolunteerFail={setAssignVolunteerFail}
                  setAssignVolunteerSuccess={setAssignVolunteerSuccess}
                  assignVolunteerFail={assignVolunteerFail}
                  assignVolunteerSuccess={assignVolunteerSuccess}
                />
              )}

              {openRouteSheets[index] && (
                <RouteSheetsView
                  routes={routeS.address.map(addr => (addr))}
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
