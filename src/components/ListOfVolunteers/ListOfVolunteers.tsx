import React, {useState} from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { TVolunteerForDeliveryAssignments } from './../../api/apiDeliveries'
//import { IUser } from '../../core/types';
// import avatar1 from '../../assets/avatar.svg';
import Small_sms from "./../../assets/icons/small_sms.svg?react";
// import { assignRouteSheet,  TRouteSheetRequest} from '../../api/routeSheetApi';
//import { UserContext } from '../../core/UserContext';
// import { IRouteSheet } from '../../api/routeSheetApi';
// import { Modal } from '../ui/Modal/Modal';
// import RouteSheets from '../RouteSheets/RouteSheets';
//import RouteSheetsView from '../RouteSheets/RouteSheetsView';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
//import { VolunteerData } from '../ui/VolunteerData/VolunteerData';

// interface IVolunteer {
//   volunteerName: string;
//   avatar: string;
// }

interface ListOfVolunteersProps {
  listOfVolunteers:  TVolunteerForDeliveryAssignments[]
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
  // routeSheetsMy: IRouteSheet[]
  // onSelectVolunteer: (volunteerName: string, volunteerAvatar: string) => void;
  // onTakeRoute: () => void;
  // onClose: () => void; // Добавляем onClose
  showActions?: boolean; // Добавляем пропс для контроля видимости кнопок
  //onVolunteerClick?: () => {}
  deliveryId?: number
  routeSheetId?: number
  routeSheetName?: string
  onVolunteerAssign?:(volunteerId: number, deliveryId: number, routeSheetId: number) => {}
}

const ListOfVolunteers: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  onOpenChange,
  showActions,
  //onVolunteerClick,
  deliveryId,
  routeSheetId,
  routeSheetName,
  onVolunteerAssign,
  
  // routeSheetsMy,
  //showActions=true
}) => {
  const [volunteerClicked, setVolunteerClicked] = useState(false);
  const [volunteerId, setVolunteerId] = useState<number>();
  const [volunteerName, setVolunteerName]= useState<string>('')

     
  //const [isClickedLeft, setIsClickedLeft] = useState(false);
  //const [isClickedRight, setIsClickedRight] = useState(false);
 // const [showActions, setShowActions] = useState(false)
  //const [volunteerForRoutSheet, setVolunteerForRoutSheet] = useState<IUser>();
  //const [openRoutSheetPage, setOpenRoutSheetPage] = useState(false);
  //const [routeSheets, setRouteSheets] = useState<boolean[]>([]);
  // const handleClickLeft = () => {
  //   setIsClickedLeft(true);
  // };

  // const handleClickRight = () => {
  //   setIsClickedRight(true);
  //   //onTakeRoute();
  // };


//   function handleVolunteerClick(volunteer:IUser) {
//     setVolunteerForRoutSheet(volunteer)
//     setShowActions(true)
// }


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
  
  // function onVolunteerChoose() {
    
  // }

  return (
    <div className={showActions? "space-y-4 w-[360px] pt-10 pb-5 rounded-[16px] flex flex-col items-center mt-3 bg-light-gray-white dark:bg-light-gray-7-logo" : "w-[310px] rounded-[16px] flex flex-col items-center mt-3 space-y-4 "} onClick={e => {e.stopPropagation() }
}>
      {/* <div  className="space-y-4 bg-light-gray-white rounded-[16px] w-[328px] p-4" onClick={e => { setShowActions(false); e.stopPropagation() }
}> */}
        {/* Список волонтёров */}
      {listOfVolunteers.map((volunteer, index) => (
        <div
          key={index}
          className={showActions? "flex items-center justify-between space-x-4 p-4 bg-light-gray-1 dark:bg-light-gray-6 rounded-[16px] shadow cursor-pointer w-[328px]": "flex items-center justify-between space-x-4 p-4 bg-light-gray-1 dark:bg-light-gray-6 rounded-[16px] shadow cursor-pointer w-[310px]" } 
          onClick={(e) => {
            e.stopPropagation();
            setVolunteerId(volunteer.id)
            setVolunteerName(`${volunteer.name} ${volunteer.last_name}`)
            setVolunteerClicked(true)
          }
          }
        >
           {/* Аватарка */}
           <div className='flex w-fit items-center'>
           <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 rounded-full bg-light-gray-2 dark:bg-light-gray-5">
            {/* <Avatar.Image
              className="w-full h-full object-cover"
              src={volunteer.avatar}
              alt={volunteer.volunteerName}
            /> */}
            <Avatar.Fallback
              className="w-full h-full flex items-center justify-center text-white bg-black"
              delayMs={600}
            >
              {volunteer.name?.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
          {/* Имя волонтера */}
          <span className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1  ml-[10px]">
            {`${volunteer.last_name} ${volunteer.name}`}
           </span>
         </div>
          
           {volunteer.tg_username ?  (
                  <a href={'https://t.me/' + (volunteer.tg_username.includes('@')? volunteer.tg_username.slice(1): volunteer.tg_username)} target="_blank" onClick={(e=>e.stopPropagation())}>
                    <Small_sms className="w-[36px] h-[35px] ml-[90px]"/>
             </a>
               ) : ""} 
        </div>
       ))}  
        {/* Действия кнопок */}
      {showActions && (
        <div className="flex justify-between mt-4 w-[328px]">
            <button
              className={'btn-M-GreenDefault'}
            onClick={()=>onOpenChange(false)}
          >
            Закрыть
          </button>
          <button
              className={'btn-M-GreenClicked'}
            onClick={()=>onOpenChange(false)}
          >
            Забрать себе
          </button>
        </div>
      )}
      {/* </div> */}
      {onVolunteerAssign && volunteerId && deliveryId && routeSheetId ? (
  <ConfirmModal
  isOpen={volunteerClicked}
  onOpenChange={setVolunteerClicked}
    onConfirm = {() => {onVolunteerAssign(volunteerId, deliveryId, routeSheetId)}}
  onCancel={()=>setVolunteerClicked(false)}
  title={` Назначить волонтера ${volunteerName} на ${routeSheetName}?`}
  description=""
  confirmText="Назначить"
  isSingleButton={false}
/>
  ): ("")}
      
      {/* <Modal isOpen={openRoutSheetPage} onOpenChange={setOpenRoutSheetPage}>
        <RouteSheets status='Ближайшая' routeSheetsData={routeSheetsMy} onClose={() => setOpenRoutSheetPage(false)} onStatusChange={() => { }}
    completedRouteSheets={[false, false, false]} setCompletedRouteSheets={setRouteSheets} />
      </Modal> */}
      </div> 
  );
};

export default ListOfVolunteers;
