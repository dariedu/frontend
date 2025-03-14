import React, {
  useState,
  useContext
} from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { TVolunteerForDeliveryAssignments } from './../../api/apiDeliveries'
import Small_sms from "./../../assets/icons/small_sms.svg?react";
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
// import {
//   postDeliveryTake,
//   type IDelivery, getDeliveryById
// } from '../../api/apiDeliveries';
// import { UserContext } from '../../core/UserContext';
// import { getMetroCorrectName, getMonthCorrectEndingName } from '../helperFunctions/helperFunctions';
import { TokenContext } from '../../core/TokenContext';
import { onVolunteerAssign, onVolunteerUnassign } from '../RouteSheetsCurator/helperFunctions';

interface ListOfVolunteersProps {
  listOfVolunteers: TVolunteerForDeliveryAssignments[]
  listOfConfirmedVol:number[]|null
  changeListOfVolunteers: React.Dispatch<React.SetStateAction<TVolunteerForDeliveryAssignments[]>>
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
  showActions: boolean; // Добавляем пропс для контроля видимости кнопок
  deliveryId: number
  routeSheetId?: number
  routeSheetName?: string
  assignVolunteerSuccess?: boolean
  setAssignVolunteerSuccess ?: React.Dispatch<React.SetStateAction<boolean>>
  unassignVolunteerSuccess?: boolean
  setUnassignVolunteerSuccess?: React.Dispatch<React.SetStateAction<boolean>>
  assignedVolunteerName?: string
  preview?:boolean
}

const ListOfVolunteers: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  listOfConfirmedVol,
  onOpenChange,
  showActions,
  deliveryId,
  routeSheetId,
  routeSheetName,
  // onVolunteerAssign,
  // onVolunteerUnassign,
  assignVolunteerSuccess,
  setAssignVolunteerSuccess,
  unassignVolunteerSuccess,
  setUnassignVolunteerSuccess,
  assignedVolunteerName,
  preview
}) => {

  const [volunteerAssignClicked, setVolunteerAssignClicked] = useState(false);
  const [volunteerUnassignClicked, setVolunteerUnassignClicked] = useState(false);
  const [volunteerId, setVolunteerId] = useState<number[]>([]);
  const [volunteerName, setVolunteerName] = useState<string[]>([])
  const [assignVolunteerFail, setAssignVolunteerFail] = useState(false)
  const [unassignVolunteerFail, setUnassignVolunteerFail] = useState(false)
  
  // const [takeDeliverySuccess, setTakeDeliverySuccess] = useState<boolean>(false); //// подтверждение бронирования доставки
  // const [takeDeliverySuccessDateName, setTakeDeliverySuccessDateName] = useState<string>(''); ///строка для вывова названия и времени доставки в алерт
  const [takeDeliveryFail, setTakeDeliveryFail] = useState<boolean>(false); /// переменная для записи если произошла ошибка  при взятии доставки
  const [takeDeliveryFailString, setTakeDeliveryFailString] = useState<string>(''); //переменная для записи названия ошибки при взятии доставки
  // const [askCurator, setAskCurator] = useState(false) ///спрашиваем куратора точно ли он хочет записать доставку на себя
  
  // const {currentUser} = useContext(UserContext);
  /// используем контекст токена
  const {token} = useContext(TokenContext);


  ////функция чтобы куратор взял себе доставку
  // async function getDelivery(delivery: IDelivery) {
  //   const id: number = delivery.id;
  //   const deliveryDate = new Date(delivery.date);
  //   const date = deliveryDate.getDate();
  //   const month = getMonthCorrectEndingName(deliveryDate);
  //   const hours =
  //     deliveryDate.getHours() < 10
  //       ? '0' + deliveryDate.getHours()
  //       : deliveryDate.getHours();
  //   const minutes =
  //     deliveryDate.getMinutes() < 10
  //       ? '0' + deliveryDate.getMinutes()
  //       : deliveryDate.getMinutes();
  //   const subway = getMetroCorrectName(delivery.location.subway);
  //   const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
  //   try {
  //     if (token) {
  //       let result: IDelivery = await postDeliveryTake(token, id, delivery);
  //       if (result) {
  //         setTakeDeliverySuccess(true);
  //         setTakeDeliverySuccessDateName(finalString);
  //         let list: TVolunteerForDeliveryAssignments[] = [];
  //         listOfVolunteers.forEach(i => list.push(i));
  //         if (currentUser && currentUser.tg_username && currentUser.last_name && currentUser.name && currentUser.photo) {
  //           list.push({
  //             id: currentUser.id,
  //             tg_username: currentUser.tg_username,
  //             last_name: currentUser.last_name,
  //             name: currentUser.name,
  //             photo: currentUser.photo
  //           })
  //         }
  //         changeListOfVolunteers(list)
  //       }
  //     }
  //   } catch (err) {
  //     if (err == 'Error: You have already taken this delivery') {
  //       setTakeDeliveryFail(true);
  //       setTakeDeliveryFailString(
  //         `Ошибка, ${finalString} доставка, уже у вас в календаре`,
  //       );
  //     } else {
  //       setTakeDeliveryFail(true);
  //       setTakeDeliveryFailString(`Упс, что то пошло не так, попробуйте позже`);
  //     }
  //   }
  // }


  
  //   async function getDeliveryId(deliveryId: number) {
  //     if (token) {
  //       try {
  //         let result: IDelivery = await getDeliveryById(token, deliveryId);
  //         if (result) {
  //        getDelivery(result)
  //     }
  //       } catch (err) {
  //         console.log(err, "getDeliveryId, ListOfVolunteers")
  //       }
  //     }
  // }
  


  return (
    <div className={"items-center space-y-4 w-full max-w-[500px] px-4 py-10 rounded-[16px] flex flex-col mt-3 bg-light-gray-white dark:bg-light-gray-7-logo"} onClick={e => {e.stopPropagation() }
}>
      {/* Список волонтёров */}
      <div className='overflow-y-scroll max-h-[450px] items-start justify-start space-y-4 w-full'>
        {listOfVolunteers.map((volunteer, index) => (
        <div
          key={index}
            className={ "flex items-center justify-between space-x-4 p-4 bg-light-gray-1 dark:bg-light-gray-6 rounded-[16px] shadow cursor-pointer w-full"}
          onClick={(e) => {
            e.stopPropagation();

            const listOfVol: string[] = [];
            const listOfVolId:number[] = [];
            volunteerName.forEach(i => listOfVol.push(i))
            listOfVol.push(`${volunteer.name} ${volunteer.last_name}`)
            setVolunteerName(listOfVol);

            volunteerId.forEach(i => listOfVolId.push(i))
            listOfVolId.push(volunteer.id)
            setVolunteerId(listOfVolId)
          }
          }
        >
           {/* Аватарка */}
           <div className='flex w-fit items-center'>
           <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 rounded-full bg-light-gray-2 dark:bg-light-gray-5">
            <Avatar.Image
              className="w-[40px] h-[40px] object-cover"
              src={volunteer.photo}
              
            />
            
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
                {listOfConfirmedVol && listOfConfirmedVol.includes(volunteer.id) && <p className='text-light-gray-5 dark:text-light-gray-4 font-gerbera-sub3'>Подтвержден</p>}
           </span>
         </div>
          
           {volunteer.tg_username ?  (
                  <a href={'https://t.me/' + (volunteer.tg_username.includes('@')? volunteer.tg_username.slice(1): volunteer.tg_username)} target="_blank" onClick={(e=>e.stopPropagation())}>
                    <Small_sms className="w-[36px] h-[35px]"/>
             </a>
               ) : ""} 
          </div>
       ))}  
      </div>
      
      {/* Действия кнопок */}
      {preview && (
         <button
         className={'btn-B-GreenDefault'}
         onClick={()=>onOpenChange(false)}
       >
         Закрыть
       </button>
      )}
      {showActions && (
        <div className="flex justify-between mt-4 w-[328px]">
            <button
              className={'btn-M-GreenDefault'}
            onClick={e => {
              e.stopPropagation();
              setVolunteerAssignClicked(true)
            }
          }
          >
            Назначить
          </button>
          {/* <button
            className={'btn-M-GreenClicked'}
            onClick={()=>setAskCurator(true)}
          >
            Забрать себе
          </button> */}
          <button
            className={'btn-M-GreenClicked'}
            onClick={e => {
              e.stopPropagation();
              setVolunteerUnassignClicked(true)

            }}
          >
            Снять
          </button>
        </div>
      )}
      {/* </div> */}
      {setAssignVolunteerSuccess && volunteerId && deliveryId && routeSheetId ? (
  <ConfirmModal
  isOpen={volunteerAssignClicked}
  onOpenChange={setVolunteerAssignClicked}
  onConfirm={() => { onVolunteerAssign(volunteerId[0], deliveryId, routeSheetId, token, setAssignVolunteerSuccess, setAssignVolunteerFail); setVolunteerAssignClicked(false) }}
  onCancel={()=>setVolunteerAssignClicked(false)}
  title={assignedVolunteerName && assignedVolunteerName.length > 0 ?
  listOfConfirmedVol && listOfConfirmedVol.includes(volunteerId[0]) ? `На ${routeSheetName} уже назначен волонтёр ${assignedVolunteerName}, назначить вместо него волонтёра ${volunteerName}?`: <p>Волонтёр {volunteerName} еще не подтвердил свое участие в доставке! <br/> Вы уверены, что хотите назначить его вместо {assignedVolunteerName}  на {routeSheetName}? </p>
  : listOfConfirmedVol && listOfConfirmedVol.includes(volunteerId[0]) ? `Назначить волонтёра ${volunteerName} на ${routeSheetName}?` : <p>Волонтёр {volunteerName} еще не подтвердил свое участие в доставке! <br/> Вы уверены, что хотите назначить его на {routeSheetName}? </p> }
  description=""
  confirmText="Назначить"
  cancelText='Закрыть'
  isSingleButton={false}
/>
      ) : ("")}
{setUnassignVolunteerSuccess && volunteerId && deliveryId && routeSheetId ? (
  <ConfirmModal
  isOpen={volunteerUnassignClicked}
  onOpenChange={setVolunteerUnassignClicked}
  onConfirm={() => {assignedVolunteerName && assignedVolunteerName.length > 0  && onVolunteerUnassign(volunteerId[0], deliveryId, routeSheetId, token, setUnassignVolunteerSuccess, setUnassignVolunteerFail); setVolunteerUnassignClicked(false) }}
  onCancel={()=>setVolunteerUnassignClicked(false)}
  title={assignedVolunteerName && assignedVolunteerName.length > 0  ? `Снять волонтёра ${volunteerName} с ${routeSheetName}?` : "Этот волонтер не назначен на эту доставку"}
  description=""
  confirmText="Снять"
  cancelText='Закрыть'
  isSingleButton={false}
/>
      ) : ("")}
      {assignVolunteerFail && setAssignVolunteerFail && (
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

      )}
      {assignVolunteerSuccess && setAssignVolunteerSuccess && (
        <ConfirmModal
      isOpen={assignVolunteerSuccess}
      onOpenChange={setAssignVolunteerSuccess}
        onConfirm = {() => {setAssignVolunteerSuccess(false)}}
      title={
        <p>
        Волонтер успешно назначен на маршрут!
        </p>
      }
      description=""
      confirmText="Ок"
      isSingleButton={true}
          />
      )}
       {unassignVolunteerFail && (
      <ConfirmModal
      isOpen={unassignVolunteerFail}
      onOpenChange={setUnassignVolunteerFail}
        onConfirm = {() => {setUnassignVolunteerFail(false)}}
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
      ) }
      {unassignVolunteerSuccess && setUnassignVolunteerSuccess &&  (
        <ConfirmModal
      isOpen={unassignVolunteerSuccess}
      onOpenChange={setUnassignVolunteerSuccess}
        onConfirm = {() => {setUnassignVolunteerSuccess(false)}}
      title={
        <p>
        Волонтер успешно снят с маршрута!
        </p>
      }
      description=""
      confirmText="Ок"
      isSingleButton={true}
          />
      )}
      {/* <ConfirmModal
        isOpen={askCurator}
        onOpenChange={setAskCurator}
        onConfirm={() => {
          deliveryId ? getDeliveryId(deliveryId) : () => { };
          setAskCurator(false)
        }}
        title={`Вы уверены, что хотите записаться на доставку в качестве волонтёра`}
        description=""
        confirmText="Да"
        cancelText='Отменить'
        isSingleButton={false}
      /> */}
       {/* <ConfirmModal
        isOpen={takeDeliverySuccess}
        onOpenChange={setTakeDeliverySuccess}
        onConfirm={() => {
          setTakeDeliverySuccess(false);
        }}
        title={`Доставка ${takeDeliverySuccessDateName} в календаре, теперь Вы можете назначить маршрутный лист`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      /> */}
      <ConfirmModal
        isOpen={takeDeliveryFail}
        onOpenChange={setTakeDeliveryFail}
        onConfirm={() => {
          setTakeDeliveryFail(false);
          setTakeDeliveryFailString('');
        }}
        title={takeDeliveryFailString}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      </div> 
  );
};

export default ListOfVolunteers;
