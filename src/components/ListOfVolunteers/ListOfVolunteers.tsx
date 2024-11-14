import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { IUser } from '../../core/types';
// import avatar1 from '../../assets/avatar.svg';
import Small_sms from "./../../assets/icons/small_sms.svg?react";
// import { assignRouteSheet,  TRouteSheetRequest} from '../../api/routeSheetApi';
//import { UserContext } from '../../core/UserContext';
// import { IRouteSheet } from '../../api/routeSheetApi';
// import { Modal } from '../ui/Modal/Modal';
// import RouteSheets from '../RouteSheets/RouteSheets';
//import RouteSheetsView from '../RouteSheets/RouteSheetsView';

// interface IVolunteer {
//   volunteerName: string;
//   avatar: string;
// }

interface ListOfVolunteersProps {
  listOfVolunteers: IUser[]
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
  // routeSheetsMy: IRouteSheet[]
  // onSelectVolunteer: (volunteerName: string, volunteerAvatar: string) => void;
  // onTakeRoute: () => void;
  // onClose: () => void; // Добавляем onClose
  showActions?: boolean; // Добавляем пропс для контроля видимости кнопок
  onVolunteerClick?:()=>{}
}

const ListOfVolunteers: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  onOpenChange,
  showActions,
  onVolunteerClick
  // routeSheetsMy,
  //showActions=true
}) => {
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

  return (
    <div className="space-y-4 w-fit rounded-[16px] flex flex-col items-center mt-3" onClick={e => {e.stopPropagation() }
}>
      {/* <div  className="space-y-4 bg-light-gray-white rounded-[16px] w-[328px] p-4" onClick={e => { setShowActions(false); e.stopPropagation() }
}> */}
        {/* Список волонтёров */}
       {listOfVolunteers.map((volunteer, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-light-gray-1 rounded-[16px] shadow cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onVolunteerClick()
          }
          }
        >
          {/* Аватарка */}
          <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 rounded-full bg-gray-300">
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
          <span className="font-gerbera-h3 text-light-gray-8-text">
            {`${volunteer.last_name} ${volunteer.name}`}
           </span>
           {volunteer.tg_username ?  (
                  <a href={'https://t.me/' + (volunteer.tg_username.includes('@')? volunteer.tg_username.slice(1): volunteer.tg_username)} target="_blank" onClick={(e=>e.stopPropagation())}>
                    <Small_sms className="w-[36px] h-[35px] ml-[90px]"/>
             </a>
               ) : ""} 
        </div>
       ))}  
        {/* Действия кнопок */}
      {showActions && (
        <div className="flex justify-between mt-4">
            <button
              className={'btn-B-GreenDefault'}
            // className={`btn-B-GreenDefault ${
            //   isClickedLeft ? 'btn-B-GreenClicked' : ''
            // }`}
            onClick={()=>onOpenChange(false)}
          >
            Закрыть
          </button>
        </div>
      )}
{/* </div> */}
      {/* <Modal isOpen={openRoutSheetPage} onOpenChange={setOpenRoutSheetPage}>
        <RouteSheets status='Ближайшая' routeSheetsData={routeSheetsMy} onClose={() => setOpenRoutSheetPage(false)} onStatusChange={() => { }}
    completedRouteSheets={[false, false, false]} setCompletedRouteSheets={setRouteSheets} />
      </Modal> */}
      </div> 
  );
};

export default ListOfVolunteers;
