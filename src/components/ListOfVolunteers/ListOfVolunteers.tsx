import React, {
  useState,
  useContext
} from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { TVolunteerForDeliveryAssignments } from './../../api/apiDeliveries'
import Small_sms from "./../../assets/icons/small_sms.svg?react";
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { TokenContext } from '../../core/TokenContext';
import { onVolunteerAssign, onVolunteerUnassign } from '../RouteSheetsCurator/helperFunctions';
import { IfilteredRouteSheet } from '../RouteSheetsCurator/helperFunctions';
import '../RouteSheetsCurator/index.css';
import CloseIcon from "../../assets/icons/closeIcon.svg?react"

interface ListOfVolunteersProps {
  listOfVolunteers: TVolunteerForDeliveryAssignments[]
  listOfConfirmedVol:number[]|null
  changeListOfVolunteers: React.Dispatch<React.SetStateAction<TVolunteerForDeliveryAssignments[]>>
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
  showActions: boolean; // Добавляем пропс для контроля видимости кнопок
  deliveryId: number
  // routeSheetId?: number
  routeSheetName?: string
  assignVolunteerSuccess?: boolean
  setAssignVolunteerSuccess ?: React.Dispatch<React.SetStateAction<boolean>>
  unassignVolunteerSuccess?: boolean
  setUnassignVolunteerSuccess?: React.Dispatch<React.SetStateAction<boolean>>
  // assignedVolunteerName?: string[]
  preview?: boolean
  routeS?: IfilteredRouteSheet;
  onClose:()=>void
}

const ListOfVolunteers: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  listOfConfirmedVol,
  onOpenChange,
  showActions,
  deliveryId,
  // routeSheetId,
  routeSheetName,
  // assignVolunteerSuccess,
  setAssignVolunteerSuccess,
  // unassignVolunteerSuccess,
  setUnassignVolunteerSuccess,
  // assignedVolunteerName,
  routeS,
  preview,
  onClose
}) => {
  // console.log(routeS, "routeS")
  // console.log(assignedVolunteerName, "assignedVolunteerName")
  const [volunteerAssignClicked, setVolunteerAssignClicked] = useState(false);
  const [volunteerUnassignClicked, setVolunteerUnassignClicked] = useState(false);
  
  // const [volunteerName, setVolunteerName] = useState<string[]>(routeS?.volunteerFullName? routeS.volunteerFullName : [])
  // const [assignVolunteerFail, setAssignVolunteerFail] = useState(false) // ошибка и снятия и назначения волонтера
  // const [unassignVolunteerFail, setUnassignVolunteerFail] = useState(false)
  const [volListForAction, setVolListForAction] = useState<string[]>(routeS?.volunteers.length == 0 ? [] : routeS?.volunteerFullName ? routeS?.volunteerFullName: []);/// список поименный, который мы будет менять назначать или снимать с доставки
  const [volIdListForAction, setVolIdListForAction] = useState<number[]>(routeS?.volunteers? routeS.volunteers : []);// список айди, который мы будет менять назначать или снимать с доставки
  // const [takeDeliverySuccess, setTakeDeliverySuccess] = useState<boolean>(false); //// подтверждение бронирования доставки
  // const [takeDeliverySuccessDateName, setTakeDeliverySuccessDateName] = useState<string>(''); ///строка для вывова названия и времени доставки в алерт
  // const [takeDeliveryFail, setTakeDeliveryFail] = useState<boolean>(false); /// переменная для записи если произошла ошибка  при взятии доставки
  // const [takeDeliveryFailString, setTakeDeliveryFailString] = useState<string>(''); //переменная для записи названия ошибки при взятии доставки
  // const [askCurator, setAskCurator] = useState(false) ///спрашиваем куратора точно ли он хочет записать доставку на себя
  const [moreThenTwoVol, setMoreThenTwoVol] = useState(false); // если пытается выбрать больше двух волонтеров за раз

  const [title, setTitle] = useState<string|JSX.Element>("");
  const [openModal, setOpenModal] = useState<boolean>(false)

  const [actionTitle, setActionTitle] = useState<string>("")

  // const [errorTitle, setErrorTitle] = useState<string>('');
  // const [error, setError] = useState<boolean>(false);

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

  
  function handleAssignClick() {
    const volMatch: (boolean | undefined)[] = volIdListForAction.map(i => routeS?.volunteers.includes(i));
    /// есть ли эьти волонтеры в списке назначенных волонтеров на этом маршрутном листе
    // console.log(routeS?.volunteers.length, "length", volMatch)

    if (volMatch.every(i => i)) { ////если список полностью совпадает со списком уже назначенных волонтеров
      if (volMatch.length == 2) {
        setTitle(`Волонтёры ${volListForAction[0]} и ${volListForAction[1]} уже назначены на ${routeSheetName}`)
      } else {
        setTitle(`Волонтёр ${volListForAction[0]} уже назначен на ${routeSheetName}.`)
      }
      setOpenModal(true)
    } else if (volMatch.every(i => !i)) { // если список к действию полностью не совпадает со списком уже назначенных волонтеров
      if (volIdListForAction.length == 2) {
        if (routeS?.volunteers.length == 0) {
          const confirmed: (boolean | undefined)[] = volIdListForAction.map(i => listOfConfirmedVol?.includes(i));
          if (confirmed.every(i => i)) {
            setActionTitle(`Назначить волонтёров ${volListForAction[0]} и ${volListForAction[1]} на ${routeSheetName}?`)
            setVolunteerAssignClicked(true)
          } else if (confirmed.every(i => !i)) {
            setActionTitle(`Вы уверены, что хотите назначить волонтёров ${volListForAction[0]} и ${volListForAction[1]} на ${routeSheetName}? 
              Они еще не подтвердили свое участие в доставке!`)
            setVolunteerAssignClicked(true)
          } else {
            setActionTitle(`Вы уверены, что хотите назначить волонтёров ${volListForAction[0]} и ${volListForAction[1]} на ${routeSheetName}? 
              ${confirmed[0] == false ? volListForAction[0] : volListForAction[1]} еще не подтвердил свое участие в доставке!`)
            setVolunteerAssignClicked(true)
          }
        } else if (routeS?.volunteers.length == 1) {
          setTitle(`На этот маршрутный лист уже назначен один волонтёр. Оставьте только одного волотёра в списке для нового назначения.`)
          setOpenModal(true)
        } else if (routeS?.volunteers.length == 2) {
          setTitle(`На этот маршрутный лист уже назначены два волонтёра. Чтобы назначить новых, сначала снимите назначенных волонтёров с этого маршрутного листа.`)
          setOpenModal(true)
        }
    } else if (volIdListForAction.length == 1) {
        if (routeS?.volunteers.length == 1 && routeS?.volunteerFullName) {
          const notAssignedIndex = volMatch.indexOf(false)
          if (listOfConfirmedVol?.includes(volIdListForAction[0])) {
            setActionTitle(`На этот маршрутный лист уже назначен волонтёр ${routeS?.volunteerFullName[0]}. Назначить еще одного волонтёра: ${volListForAction[0]}?`)
          } else {
            setActionTitle(`На этот маршрутный лист уже назначен волонтёр ${routeS?.volunteerFullName[0]}. Волонтёр ${volListForAction[0]} еще не подтвердил свое участие в доставке! Назначить еще одного волонтёра: ${volListForAction[0]}?  `)
          }
          setVolIdListForAction([volIdListForAction[notAssignedIndex]])
          setVolListForAction([volListForAction[notAssignedIndex]])
          setVolunteerAssignClicked(true)
         
        } else if (routeS?.volunteers.length == 2) {
          setTitle(`На этот маршрутный лист уже назначены два волонтёра. Чтобы назначить нового, сначала снимите одного из них с этого маршрута.`)
          setOpenModal(true)
        } else if (routeS?.volunteers.length == 0) {
          if (listOfConfirmedVol?.includes(volIdListForAction[0])) {
            setActionTitle(`Назначить волонтёра ${volListForAction[0]} на этот маршрутный лист?`)
            setVolunteerAssignClicked(true)
          } else {
            setActionTitle(`Волонтёр ${volListForAction[0]} еще не подтвердил свое участие в доставке! Вы уверены, что хотите назначить его на ${routeSheetName}?`)
            setVolunteerAssignClicked(true)
          }
        }
       }

    } else if (routeS?.volunteerFullName) {//// не весь список выбранных к действию волонтеров совпадает с уже назначенными
      
        if (routeS?.volunteers.length == 1) {
          const notAssignedIndex = volMatch.indexOf(false)
            if (listOfConfirmedVol?.includes(volIdListForAction[notAssignedIndex])) {
            setActionTitle(`На этот маршрутный лист уже назначен волонтёр ${routeS?.volunteerFullName[0]}. Назначить еще одного волонтёра: ${volListForAction[notAssignedIndex]}?`)
          } else {
            setActionTitle(`На этот маршрутный лист уже назначен волонтёр ${routeS?.volunteerFullName[0]}. Волонтёр ${volListForAction[notAssignedIndex]} еще не подтвердил свое участие в доставке! Назначить еще одного волонтёра: ${volListForAction[notAssignedIndex]}?  `)
          }
          setVolIdListForAction([volIdListForAction[notAssignedIndex]])
          setVolListForAction([volListForAction[notAssignedIndex]])
          setVolunteerAssignClicked(true)
        } else if (routeS?.volunteers.length == 2 ) {
            setTitle(`На этот маршрутный лист уже назначены два волонтёра. Чтобы назначить нового, сначала снимите одного из назначенных волонтёров.`)
          setOpenModal(true)
        }
    }
  }
  
  
  function handleUnassignClick() {

    const volMatch: (boolean | undefined)[] = volIdListForAction.map(i => routeS?.volunteers.includes(i));
    // console.log(volMatch, "volMtahc")
    /// есть ли эьти волонтеры в списке назначенных волонтеров на этом маршрутном листе

    if (volMatch.every(i => i)) {
      if (volMatch.length == 2) {
        setActionTitle(`Вы уверены, что хотите снять волонтёров ${volListForAction[0]} и ${volListForAction[1]} с этого маршрутного листа?`)
        setVolunteerUnassignClicked(true)
      } else {
        setActionTitle(`Вы уверены, что хотите снять волонтёра ${volListForAction[0]} с этого маршрутного листа?`)
        setVolunteerUnassignClicked(true)
      }
    } else if (volMatch.every(i => !i)) {
      if (volMatch.length == 2) {
        setTitle(`Волонтёров ${volListForAction[0]} и ${volListForAction[1]} невозможно снять с маршрута, так как они еще не были назначены на ${routeSheetName}?`)
        setOpenModal(true)
      } else if (volMatch.length == 1) {
        setTitle(`Волонтёра ${volListForAction[0]} невозможно снять с маршрута, так как он еще не был назначен на ${routeSheetName}?`)
        setOpenModal(true)
      }
    } else if (routeS?.volunteerFullName) {
      const assignedIndex = volMatch.indexOf(true)
      setVolIdListForAction([volIdListForAction[assignedIndex]])
      setVolListForAction([volListForAction[assignedIndex]])
      setActionTitle(`Снять волонтёра  ${volListForAction[assignedIndex]} с этого маршрутного листа?`)
      // console.log(assignedIndex,  volIdListForAction, volListForAction, "assignedIndex for action")
      setVolunteerUnassignClicked(true) 
      }
  }
// console.log(volIdListForAction.length, volListForAction, volListForAction.length , 'volIdListForAction.length, volListForAction.length')

  return (
    <div className={"items-center space-y-4 w-full max-w-[500px] px-4 pt-[8px] pb-10 rounded-[16px] flex flex-col mt-3 bg-light-gray-white dark:bg-light-gray-7-logo"} onClick={e => {e.stopPropagation() }
}>
       <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end' onClick={onClose} />
      {/* Список волонтёров */}
      <div className='overflow-y-scroll max-h-[450px] items-start justify-start space-y-4 w-full'>
        {listOfVolunteers.map((volunteer, index) => (
        <div
          key={index}
            className={volIdListForAction.includes(volunteer.id) ? "flex items-center justify-between space-x-4 p-4  rounded-[16px] shadow cursor-pointer w-full dark:bg-light-gray-5 bg-light-gray-2":
              "flex items-center justify-between space-x-4 p-4 bg-light-gray-1 dark:bg-light-gray-6 rounded-[16px] shadow cursor-pointer w-full"
            } onClick={(e) => {
              e.stopPropagation(); 
              if (volIdListForAction.includes(volunteer.id)) {
                if (volListForAction.length == 2 && volIdListForAction.length == 2) {
                  const arrName = volListForAction.filter(i => i !== `${volunteer.name} ${volunteer.last_name}`)
                  const arrId = volIdListForAction.filter(i => i !== volunteer.id)
                    setVolListForAction(arrName);
                    setVolIdListForAction(arrId)
                  } else if (volListForAction.length == 1 && volIdListForAction.length == 1) {
                    setVolListForAction([]);
                    setVolIdListForAction([])
                  }
              } else {
                if (volListForAction.length == 2 && volIdListForAction.length == 2){
                  setMoreThenTwoVol(true)
                  setTimeout(() => {
                   setMoreThenTwoVol(false)
                  }, 1000);
              } else if (volListForAction.length == 0 && volIdListForAction.length == 0) {
                setVolListForAction([`${volunteer.name} ${volunteer.last_name}`])
                setVolIdListForAction([volunteer.id])
              } else if (volListForAction.length == 1 && volIdListForAction.length == 1) {
                setVolListForAction([volListForAction[0], `${volunteer.name} ${volunteer.last_name}`]);
                setVolIdListForAction([volIdListForAction[0], volunteer.id])
              }}}}>
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
              handleAssignClick()
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
              handleUnassignClick()
            }}
          >
            Снять
          </button>
        </div>
      )}
      { moreThenTwoVol &&
        <p className=" bg-light-gray-white dark:bg-light-gray-7-logo shadow-xl font-gerbera-sub3
          text-light-gray-black text-center  dark:text-light-gray-white ToastViewport ToastRoot">
          Можно выбрать только 2 волонтёра
       </p>}
       
  {setAssignVolunteerSuccess && volIdListForAction.length > 0 && deliveryId && routeS ? (
  <ConfirmModal
  isOpen={volunteerAssignClicked}
  onOpenChange={setVolunteerAssignClicked}
  onConfirm={() => {
  onVolunteerAssign(volIdListForAction, deliveryId, routeS.id, token, setTitle, setOpenModal, setAssignVolunteerSuccess);
    setVolunteerAssignClicked(false);
    // setVolIdListForAction([]);
    // setVolListForAction([]);
   setActionTitle('') }}
  onCancel={() => setVolunteerAssignClicked(false)}
  title={actionTitle}
  // title={assignedVolunteerName && assignedVolunteerName.length > 0 ?
  // listOfConfirmedVol && listOfConfirmedVol.includes(volunteerId[0]) ? `На ${routeSheetName} уже назначен волонтёр ${assignedVolunteerName}, назначить вместо него волонтёра ${volunteerName}?`: <p>Волонтёр {volunteerName} еще не подтвердил свое участие в доставке! <br/> Вы уверены, что хотите назначить его вместо {assignedVolunteerName}  на {routeSheetName}? </p>
  // : listOfConfirmedVol && listOfConfirmedVol.includes(volunteerId[0]) ? `Назначить волонтёра ${volunteerName} на ${routeSheetName}?` : <p>Волонтёр {volunteerName} еще не подтвердил свое участие в доставке! <br/> Вы уверены, что хотите назначить его на {routeSheetName}? </p> }
  description=""
  confirmText="Назначить"
  cancelText='Закрыть'
  isSingleButton={false}
/>
      ) : ("")}
{setUnassignVolunteerSuccess && volIdListForAction.length >0 && deliveryId && routeS ? (
  <ConfirmModal
  isOpen={volunteerUnassignClicked}
  onOpenChange={setVolunteerUnassignClicked}
  onConfirm={() => {
  routeS.volunteerFullName && routeS.volunteerFullName.length > 0 &&
  onVolunteerUnassign(volIdListForAction, deliveryId, routeS.id, token, setTitle, setOpenModal, setUnassignVolunteerSuccess);
    setVolunteerUnassignClicked(false);
    // setVolIdListForAction([]);
    // setVolListForAction([]);
   setActionTitle('')}}
  onCancel={() => setVolunteerUnassignClicked(false)}
  title={actionTitle}
  // title={assignedVolunteerName && assignedVolunteerName.length > 0  ? `Снять волонтёра ${volunteerName} с ${routeSheetName}?` : "Этот волонтер не назначен на эту доставку"}
  description=""
  confirmText="Снять"
  cancelText='Закрыть'
  isSingleButton={false}
/>
      ) : ("")}
      {/* {assignVolunteerFail && (
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

      )} */}
      {openModal && title && (
        <ConfirmModal
      isOpen={openModal}
      onOpenChange={setOpenModal}
      onConfirm={() => { setOpenModal(false); setTitle('') }}
      title={title}
      description=""
      confirmText="Ок"
      isSingleButton={true}
      />
      )}
       {/* {unassignVolunteerFail && (
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
      ) } */}
      {/* {unassignVolunteerSuccess && setUnassignVolunteerSuccess &&  (
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
      )} */}
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
      {/* <ConfirmModal
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
      /> */}
      </div> 
  );
};

export default ListOfVolunteers;
