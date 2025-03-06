import React, {useContext, useEffect, useState} from 'react';
import { type IPromotion } from './../../api/apiPromotions.ts';
import { getBallCorrectEndingName } from '../helperFunctions/helperFunctions';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal.tsx';
import CloseIcon from "../../assets/icons/closeIcon.svg?react"
import * as Avatar from '@radix-ui/react-avatar';
import { TokenContext } from '../../core/TokenContext.tsx';
import { getUserById, IUser } from '../..//api/userApi.ts';
import Small_sms from "./../../assets/icons/small_sms.svg?react"
import { UserContext } from '../../core/UserContext.tsx';

interface IDefaultInfoProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  optional: boolean
  promotion: IPromotion
  reserved: boolean 
  confirmed?: boolean
  makeReservationFunc?: (promotion: IPromotion, token:string|null, setRedeemPromotionSuccessName:React.Dispatch<React.SetStateAction<string>>,setRedeemPromotionSuccess:React.Dispatch<React.SetStateAction<boolean>>, userValue:any, setRedeemPromotionErr: React.Dispatch<React.SetStateAction<string>>,setError:React.Dispatch<React.SetStateAction<boolean>>) => {}
  cancelPromotion?: (promotion: IPromotion, token:string|null,setCancelPromotionSuccess:React.Dispatch<React.SetStateAction<boolean>>,setCancelPromotionSuccessName:React.Dispatch<React.SetStateAction<string>>, userValue:any,setCancelPromotionErr:React.Dispatch<React.SetStateAction<string>>,setCancelError:React.Dispatch<React.SetStateAction<boolean>>) => {}
  setRedeemPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>
  setRedeemPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setRedeemPromotionErr: React.Dispatch<React.SetStateAction<string>>
  setError: React.Dispatch<React.SetStateAction<boolean>>
  setCancelPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setCancelPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>
  setCancelPromotionErr: React.Dispatch<React.SetStateAction<string>>
  setCancelError: React.Dispatch<React.SetStateAction<boolean>>
  allPromoNotConfirmed: number[]
}

 
const DetailedInfo: React.FC<IDefaultInfoProps> = ({
  onOpenChange,
  optional,
  promotion,
  reserved,
  makeReservationFunc,
  setRedeemPromotionSuccessName,
  setRedeemPromotionSuccess,
  setRedeemPromotionErr,
  setError,
  cancelPromotion,
  setCancelPromotionSuccess,
  setCancelPromotionSuccessName,
  setCancelPromotionErr,
  setCancelError,
  allPromoNotConfirmed
}) => {
  const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180*60000);
  const currentDate = new Date()
  const promotionDate = new Date(promotion.start_date)
  const lessThenTwoHours = (promotionDate.valueOf() - currentDate.valueOf()) / 60000 <= 120;
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [confirmMakeReservationModal, setConfirmMakeReservationModal] = useState(false);
  const [contactPerson, setContactPerson] = useState<IUser>()

  const { token } = useContext(TokenContext);
   ////// используем контекст юзера, чтобы вывести количество доступных баллов 
    const userValue = useContext(UserContext);
  // const userPoints = userValue.currentUser?.point;

  async function getContactName() {
    if (token) {
      try {
     const user:IUser = await getUserById(promotion.contact_person, token);
        if (user) {
          if (!user.photo?.includes('https')) {
           user.photo = user.photo?.replace('http', 'https')
          }
          setContactPerson(user)
}
      } catch(err) {
       console.log(err, "getContactName() promotions bankTab volunteer") 
    }
  }
}

  
  useEffect(()=>{getContactName()}, [])


  /////////////////////////////
  let curatorTelegramNik = contactPerson?.tg_username;
  if (contactPerson?.tg_username && contactPerson?.tg_username.length > 0) {
    curatorTelegramNik = contactPerson?.tg_username.includes('@', 0)
    ? contactPerson?.tg_username.slice(1)
    : contactPerson?.tg_username;
  }
  ///////////////////////////////////


  return (
    <div className=" w-full max-w-[500px] flex flex-col h-fit max-h-screen overflow-y-scroll rounded-t-2xl px-4 pt-2 pb-8 bg-light-gray-white dark:bg-light-gray-7-logo" onClick={e=>e.stopPropagation()}>
     <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end mb-2' onClick={()=>onOpenChange(false)} />
      <div className="flex items-start justify-between">
        <div className="flex w-[90%]">
          <div className="flex flex-col justify-center items-start">
            <h1 className="w-full h-fit max-h-[34px] font-gerbera-h3 m-0 p-0 dark:text-light-gray-1" >
              {promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1)}
            </h1>
            <p className="w-full font-gerbera-sub1 text-light-gray-4 text-start dark:text-light-gray-3">
              {promotion.address}
            </p>
          </div>
        </div>
        {promotion.category!=undefined && promotion.category.name.length > 0 &&
        <div className='flex justify-center items-center'>
           <p className="font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4">{promotion.category.name.slice(0,1).toUpperCase()+promotion.category.name.slice(1)}</p>
        </div>
      }
      </div>
      {optional ? "" : (
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start p-4 mt-[14px] dark:bg-light-gray-6">
        <h3 className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
         Детали
        </h3>
        {promotion.is_permanent && (promotion.about_tickets || promotion.ticket_file) ?
          (<p className="w-full h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-4">
              {promotion.about_tickets && promotion.about_tickets}
              {promotion.ticket_file && <a href={promotion.ticket_file} target='_blank' rel="noopener noreferrer" className='text-light-brand-green'>Ссылка на билет</a>}
          </p>) : lessThenTwoHours && (promotion.about_tickets || promotion.ticket_file) ? (
        <p className="w-full h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-4">
         {promotion.about_tickets && promotion.about_tickets}
         {promotion.ticket_file && <a href={promotion.ticket_file} target='_blank' rel="noopener noreferrer" className='text-light-brand-green' >Ссылка на билет</a>}</p>)
              : (<p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-3">
          За два часа до мероприятия тут появится информация о вашем билете
          </p>)}
      </div>
      )}
      <div className="w-full min-w-[328px] flex justify-center items-center mt-[14px] self-center space-x-2">
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] min-w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
          <p className="font-gerbera-sub3 text-light-gray-8-text dark:text-light-gray-1 ">
            Время начала
          </p>
          <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
            {promotion.is_permanent
              ? 'В любое время'
                : `${eventDate.getUTCDate()}
            ${eventDate.toLocaleDateString("RU", {month:"short"})} в
            ${eventDate.getUTCHours() < 10 ? '0' + eventDate.getUTCHours() : eventDate.getUTCHours()}:${eventDate.getUTCMinutes() < 10 ? '0' + eventDate.getUTCMinutes() : eventDate.getUTCMinutes()}`
          }  
            
          </p>
        </div>
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] min-w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
          <p className="font-gerbera-sub3 text-light-gray-8-text dark:text-light-gray-1 ">
            Списание баллов
          </p>
          <p className="font-gerbera-h3 text-light-brand-green ">
            {promotion.price} {getBallCorrectEndingName(promotion.price)} 
          </p>
        </div>
      </div>
      {contactPerson && contactPerson.name && contactPerson.tg_id &&
        <div className="w-full h-[67px] min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
              <div className="flex">
              <Avatar.Root className="inline-flex items-center justify-center h-[32px] w-[32px] bg-light-gray-white dark:bg-light-gray-8-text rounded-full">
              {contactPerson.photo &&
              <Avatar.Image
                src={contactPerson.photo}
                className="h-[32px] w-[32px] object-cover rounded-full cursor-pointer"
              />}
              <Avatar.Fallback
                className="text-black dark:text-white"
              >
                {contactPerson.name ? contactPerson.name[0] : 'A'}
              </Avatar.Fallback>
            </Avatar.Root>
                  <div className="felx flex-col justify-center items-start ml-4">
                    <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                      {contactPerson.name.slice(0, 1).toUpperCase()+contactPerson.name.slice(1)}
                    </h1>
                    <p className="font-gerbera-sub3 text-light-gray-4 text-start dark:text-light-gray-3">
                      Контактное лицо
                    </p>
                  </div>
                </div>
              <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
              <Small_sms className="w-[36px] h-[35px]"/>
                </a>
              </div>}
      {promotion.description != undefined && promotion.description.length > 0 ? (
      <div className="w-full h-fit max-h-[160px] p-4 bg-light-gray-1 rounded-2xl mt-[14px] flex flex-col justify-center items-start dark:bg-light-gray-6">
        <h3 className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">Описание</h3>
        <p className="font-gerbera-sub1 text-light-gray-4 h-fit text-start mt-[10px] dark:text-light-gray-3 overflow-y-auto">
          {promotion.description}
        </p>
      </div>
      ): ""}
      
      {promotion.picture && (
        <Avatar.Root className="mt-[14px] self-center inline-flex items-center justify-center h-fit w-fit bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl">
        {promotion.picture &&
        <Avatar.Image
          src={promotion.picture}
          className="w-full min-w-[328px] aspect-[2/1] rounded-2xl self-center object-cover"
        />}
        <Avatar.Fallback
          className="w-0 h-0 "
        >
        </Avatar.Fallback>
      </Avatar.Root>
      )}
      {!reserved ? (
        <div className="w-full min-w-[328px] flex justify-center space-x-2 items-center mt-[14px] self-center">
        <button
          onClick={() => {
            setConfirmMakeReservationModal(true)
          }}
          className="btn-B-GreenDefault "
        >
          Забронировать
        </button>
      </div>
      ) : allPromoNotConfirmed.includes(promotion.id) && (
       <div className="w-full flex justify-center items-center mt-[14px] self-center">
       <button
         onClick={() => {
          setConfirmCancelModal(true)
         }}
         className="btn-B-WhiteDefault self-center"
       >
         Отказаться
            </button>
     </div>
      )}
     <ConfirmModal
        isOpen={confirmCancelModal}
        onOpenChange={setConfirmCancelModal}
        onConfirm={() => {
         if (cancelPromotion) {
            cancelPromotion(promotion, token,setCancelPromotionSuccess,setCancelPromotionSuccessName, userValue,setCancelPromotionErr,setCancelError)
           onOpenChange(false);
           setConfirmCancelModal(false)
          }
        }}
        title={<p>Уверены, что хотите отменить участие в мероприятии?</p>}
        description=""
        confirmText="Да"
        cancelText="Нет"
      />
      <ConfirmModal
        isOpen={confirmMakeReservationModal}
        onOpenChange={setConfirmMakeReservationModal}
        onConfirm={() => {
          if (makeReservationFunc) {
            makeReservationFunc(promotion, token, setRedeemPromotionSuccessName, setRedeemPromotionSuccess, userValue, setRedeemPromotionErr, setError)
            onOpenChange(false)
            setConfirmMakeReservationModal(false)
          }
        }}
        title={<p>Уверены, что хотите забронировать мероприятие?</p>}
        description=""
        confirmText="Да"
        cancelText="Нет"
      />
    </div>
  );
};


export default DetailedInfo;
