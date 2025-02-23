import React, {useState, useContext, useEffect} from 'react';
import {IRouteSheet, assignRouteSheet, type TRouteSheetRequest} from '../../api/routeSheetApi';
import { TVolunteerForDeliveryAssignments } from '../../api/apiDeliveries';
import { type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import Arrow_right from './../../assets/icons/arrow_right.svg?react';
import { TokenContext } from '../../core/TokenContext';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import {
  getPhotoReportsByDeliveryId,
  type TServerResponsePhotoReport,
} from '../../api/apiPhotoReports';
import RouteSheet from './CuratorRSCreator';


interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершенная' 
  currentStatus: 'nearest' | 'active' | 'completed'
  routeSheetsData: IRouteSheet[]
  onClose: () => void
  changeListOfVolunteers: React.Dispatch<React.SetStateAction<TVolunteerForDeliveryAssignments[]>>
  listOfVolunteers: TVolunteerForDeliveryAssignments[]
  deliveryId: number
  assignedRouteSheets: IRouteSheetAssignments[]
  changeAssignedRouteSheets: () => {}
  completeDeliveryFunc: (deliveryId: number)=> Promise<void>
}

const RouteSheetsM: React.FC<RouteSheetsProps> = ({
  status,
  currentStatus,
  routeSheetsData,
  onClose,
  changeListOfVolunteers,
  listOfVolunteers,
  deliveryId,
  assignedRouteSheets,
  changeAssignedRouteSheets,
  completeDeliveryFunc
}) => {


  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(Array(routeSheetsData.length).fill(false));
  interface IfilteredRouteSheet extends IRouteSheet{
    volunteerFullName?: string
    telegramNik?:string
  }
  
  
  const [openVolunteerLists, setOpenVolunteerLists] = useState<boolean[]>(Array(routeSheetsData.length).fill(false));
  const [assignVolunteerSuccess, setAssignVolunteerSuccess] = useState(false)
  const [assignVolunteerFail, setAssignVolunteerFail] = useState(false)
  const [filtered, setFiltered] = useState<IfilteredRouteSheet[]>([])
  const [filteredSuccess, setFilteredSuccess] = useState(false)
  const [askCuratorCompleteDelivery, setAskCuratorCompleteDelivery] = useState(false)
  const [myPhotoReports, setMyPhotoReports] = useState<TServerResponsePhotoReport[]>(localStorage.getItem(`curator_del_${deliveryId}`) !== null && localStorage.getItem(`curator_del_${deliveryId}`) !== undefined ? JSON.parse(localStorage.getItem(`curator_del_${deliveryId}`) as string) : []);


  ///// используем контекст токена
  const tokenContext = useContext(TokenContext);
  const token = tokenContext.token;
 ////// используем контекст


////проверяем назначен ли волонтер на конкретный маршрутный лист и добавляем к объекту маршрутного листа volunteerFullName
  function findAssignedRouteSheets() {
    let filtered: number[] = [];
    const routeSheetsWithVName: IfilteredRouteSheet[]=[];
    routeSheetsData.forEach(i => routeSheetsWithVName.push(i));

    routeSheetsData.forEach((item) => filtered.push(item.id))
    let final:{ id: number,  volunteerId: number, volunteerFullName:string, telegramNik:string}[] = [];
    for (let i = 0; i < filtered.length; i++){
      assignedRouteSheets.forEach(r => {
        if (r.route_sheet == filtered[i])
          final.push({ id: r.route_sheet, volunteerId: r.volunteer, volunteerFullName: "", telegramNik:"" })
      });

      final.forEach(i => {
        listOfVolunteers.forEach(y => {
          if (y.id == i.volunteerId) {
            i.volunteerFullName = `${y.name} ${y.last_name}`
            i.telegramNik = y.tg_username
          }
        })
      });
      
      final.forEach((i) => {
        routeSheetsWithVName.forEach((y => {
          if (y.id == i.id) {
            y.volunteerFullName = i.volunteerFullName
            y.telegramNik = i.telegramNik
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
          changeAssignedRouteSheets()
          setAssignVolunteerSuccess(true)
        }
      } catch (err) {
        setAssignVolunteerFail(true)
      }
    }
  }

   async function requestPhotoReports() {
      if (token) {
        try {
          let result = await getPhotoReportsByDeliveryId(token, deliveryId);
          console.log(result, `photo report by deliveryid ${deliveryId}`)
          setMyPhotoReports(result);
          localStorage.setItem(`curator_del_${deliveryId}`, JSON.stringify(result))
        } catch (err) {
          console.log(err, 'getPhotoReports has failed RouteSheetCurator');
        }
      }
    }
  
 useEffect(() => {
    requestPhotoReports();
  }, []);


  return (routeSheetsData.length == 0 ? (
    <div className="w-full max-w-[500px] bg-light-gray-1 dark:bg-light-gray-black  h-screen flex flex-col overflow-y-auto pb-[74px]" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center pb-1 mb-1 h-[60px] min-h-[60px] text-light-gray-black rounded-b-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full">
        <Arrow_right  className={`stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer transform rotate-180 ml-[22px] mr-4`} onClick={onClose}/>
        <h2 className="font-gerbera-h1 text-lg text-light-gray-black dark:text-light-gray-1 ">{status} доставка</h2>
      </div>
      <div className='font-gerbera-h1 text-lg text-light-gray-black dark:text-light-gray-1 text-center h-full flex flex-col justify-center w-[90%] self-center '>
        Маршрутные листы не доступны, проверьте корректность назначения куратора на эти маршрутные листы в Админ панели, в разделе Адреса ==&gt; Локации
      </div>
      </div>
  ) : filteredSuccess &&
    (<div className="w-full max-w-[500px] bg-light-gray-1 dark:bg-light-gray-black h-screen flex flex-col overflow-y-auto pb-[74px]" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center pb-1 mb-1 h-[60px] min-h-[60px] text-light-gray-black rounded-b-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full">
        <Arrow_right  className={`stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer transform rotate-180 ml-[22px] mr-4`} onClick={onClose}/>
        <h2 className="font-gerbera-h1 text-lg text-light-gray-black dark:text-light-gray-1 ">{status} доставка</h2>
      </div>
      <div className="flex flex-col">
        {filtered.length > 0 && filtered.map((routeS, index) => {
          return (
            <RouteSheet routeS={routeS} index={index} setOpenVolunteerLists={setOpenVolunteerLists}
              listOfVolunteers={listOfVolunteers} openVolunteerLists={openVolunteerLists}
              changeListOfVolunteers={changeListOfVolunteers}
              onVolunteerAssign={onVolunteerAssign} deliveryId={deliveryId}
              assignVolunteerFail={assignVolunteerFail} setAssignVolunteerFail={setAssignVolunteerFail}
              assignVolunteerSuccess={assignVolunteerSuccess} setAssignVolunteerSuccess={setAssignVolunteerSuccess}
              openRouteSheets={openRouteSheets} setOpenRouteSheets={setOpenRouteSheets} myPhotoReports={myPhotoReports}
            />
          );
        })}
      </div>
      {status == 'Активная' &&
        <button className={currentStatus == 'completed'? "btn-B-GreenInactive mt-10 self-center" : 'btn-B-GreenDefault mt-10 self-center'} onClick={() => {
          if (currentStatus == 'completed') { 
            ()=>{}
          } else {
            setAskCuratorCompleteDelivery(true)
          }
        }}>
        {currentStatus == 'completed' ? "Завершена" : "Завершить доставку"} 
       </button>}
      <ConfirmModal
        isOpen={askCuratorCompleteDelivery}
        onOpenChange={setAskCuratorCompleteDelivery}
        onConfirm={() => { completeDeliveryFunc(deliveryId); setAskCuratorCompleteDelivery(false)} }
        onCancel={() => setAskCuratorCompleteDelivery(false)}
        title="Вы уверены, что хотите завершить доставку?"
        cancelText='Закрыть'
        description=""
        confirmText="Завершить"
        isSingleButton={false}
      />
      
    </div>)
  );
};

export default RouteSheetsM;
