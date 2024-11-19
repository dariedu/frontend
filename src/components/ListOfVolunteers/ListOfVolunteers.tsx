import React, {useState} from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { TVolunteerForDeliveryAssignments } from './../../api/apiDeliveries'
import Small_sms from "./../../assets/icons/small_sms.svg?react";
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';


interface ListOfVolunteersProps {
  listOfVolunteers:  TVolunteerForDeliveryAssignments[]
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
  showActions?: boolean; // Добавляем пропс для контроля видимости кнопок
  deliveryId?: number
  routeSheetId?: number
  routeSheetName?: string
  onVolunteerAssign?: (volunteerId: number, deliveryId: number, routeSheetId: number) => {}
  assignVolunteerFail?: boolean
  assignVolunteerSuccess?: boolean
  setAssignVolunteerSuccess?: React.Dispatch<React.SetStateAction<boolean>>
  setAssignVolunteerFail?:React.Dispatch<React.SetStateAction<boolean>>
}

const ListOfVolunteers: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  onOpenChange,
  showActions,
  deliveryId,
  routeSheetId,
  routeSheetName,
  onVolunteerAssign,
  assignVolunteerFail,
  assignVolunteerSuccess,
  setAssignVolunteerFail,
  setAssignVolunteerSuccess
}) => {
  const [volunteerClicked, setVolunteerClicked] = useState(false);
  const [volunteerId, setVolunteerId] = useState<number>();
  const [volunteerName, setVolunteerName]= useState<string>('')

     

  return (
    <div className={showActions? "space-y-4 w-[360px] pt-10 pb-5 rounded-[16px] flex flex-col items-center mt-3 bg-light-gray-white dark:bg-light-gray-7-logo" : "w-[310px] rounded-[16px] flex flex-col items-center mt-3 space-y-4 "} onClick={e => {e.stopPropagation() }
}>
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
                    <Small_sms className="w-[36px] h-[35px]"/>
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
  onConfirm={() => { onVolunteerAssign(volunteerId, deliveryId, routeSheetId); setVolunteerClicked(false) }}
  onCancel={()=>setVolunteerClicked(false)}
  title={` Назначить волонтера ${volunteerName} на ${routeSheetName}?`}
  description=""
  confirmText="Назначить"
  isSingleButton={false}
/>
      ) : ("")}
      {onVolunteerAssign && assignVolunteerFail && setAssignVolunteerFail ? (
        <>
      <ConfirmModal
      isOpen={assignVolunteerFail}
      onOpenChange={setAssignVolunteerFail}
        onConfirm = {() => {setAssignVolunteerFail(false)}}
      title={
        <p>
          Упс, что-то пошло не так<br />
          Попробуйте позже
        </p>
      }
      description=""
      confirmText="Ок"
      isSingleButton={true}
    />
        </>
      ) : ("")}
      {onVolunteerAssign  && assignVolunteerSuccess && setAssignVolunteerSuccess ? (
        <>
        <ConfirmModal
      isOpen={assignVolunteerSuccess}
      onOpenChange={setAssignVolunteerSuccess}
        onConfirm = {() => {setAssignVolunteerSuccess(false)}}
      title={
        <p>
        Волонтер успешно назначен на доставку!
        </p>
      }
      description=""
      confirmText="Ок"
      isSingleButton={true}
          />
        </>
      ):("")}
      </div> 
  );
};

export default ListOfVolunteers;
