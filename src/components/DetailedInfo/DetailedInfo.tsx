import React, {useState} from 'react';
import { type IPromotion } from './../../api/apiPromotions.ts';
import { getBallCorrectEndingName, getMonthCorrectEndingName } from '../helperFunctions/helperFunctions';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal.tsx';
import CloseIcon from "../../assets/icons/closeIcon.svg?react"

interface IDefaultInfoProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  optional: boolean
  promotion: IPromotion
  reserved: boolean 
  confirmed?: boolean
  makeReservationFunc?: (promotion: IPromotion) => void
  cancelPromotion?: (promotion: IPromotion) => void
}

 
const DetailedInfo: React.FC<IDefaultInfoProps> = ({
  onOpenChange,
  optional,
  promotion,
  reserved,
  makeReservationFunc,
  cancelPromotion
}) => {

  const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180);
  const currentDate = new Date()
  const promotionDate = new Date(promotion.start_date)
  const lessThenOneHour = (promotionDate.valueOf() - currentDate.valueOf()) / 60000 <= 60;
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [confirmMakeReservationModal, setConfirmMakeReservationModal] = useState(false);




  return (
    <div className=" w-full max-w-[500px] flex flex-col h-fit max-h-screen overflow-y-scroll rounded-t-2xl px-4 pt-[20px] pb-8 bg-light-gray-white dark:bg-light-gray-7-logo" onClick={e=>e.stopPropagation()}>
    
      <div className="flex align-middle justify-between">
        <div className="flex">
          <div className="flex flex-col ml-[14px] justify-center items-start">
            <h1 className="w-[200px] h-fit max-h-[34px] font-gerbera-h3 m-0 p-0 dark:text-light-gray-1" >
              {promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1)}
            </h1>
            <p className="w-[162px] font-gerbera-sub1 text-light-gray-4 text-start dark:text-light-gray-3">
              {promotion.address}
            </p>
          </div>
        </div>
        <div className='flex justify-center items-center'>
           <p className="font-gerbera-sub2 text-light-gray-3 mr-2 dark:text-light-gray-4">{promotion.category.name.slice(0,1).toUpperCase()+promotion.category.name.slice(1)}</p>
        <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8' onClick={()=>onOpenChange(false)} />
        </div>
       
      </div>
      {optional ? "" : (
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start p-4 mt-[14px] dark:bg-light-gray-6">
        <h3 className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
         Как получить билет?
        </h3>
        {promotion.is_permanent ?
          (<p className="w-full h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-4">
          {promotion.about_tickets}
          </p>) : lessThenOneHour ? (
        <p className="w-full h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-4">
        {promotion.about_tickets}
        </p>
        ) : (<p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px] dark:text-light-gray-3">
          За один час до мероприятия тут будет информация о вашем билете
          </p>)}
        
      </div>
      )}
    
      <div className="w-full min-w-[328px] flex justify-center items-center mt-[14px] self-center space-x-2">
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] h-[62px] p-[12px] dark:bg-light-gray-6">
          <p className="font-gerbera-sub3 text-light-gray-8-text dark:text-light-gray-1 ">
            Время начала
          </p>
          <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
            {promotion.is_permanent
              ? 'В любое время'
                : `${eventDate.getUTCDate()}
            ${getMonthCorrectEndingName(eventDate)} в
            ${eventDate.getUTCHours() < 10 ? '0' + eventDate.getUTCHours() : eventDate.getUTCHours()}:${eventDate.getUTCMinutes() < 10 ? '0' + eventDate.getUTCMinutes() : eventDate.getUTCMinutes()}`
          }  
            
          </p>
        </div>
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] h-[62px] p-[12px] dark:bg-light-gray-6">
          <p className="font-gerbera-sub3 text-light-gray-8-text dark:text-light-gray-1 ">
            Списание баллов
          </p>
          <p className="font-gerbera-h3 text-light-brand-green ">
            {promotion.price} {getBallCorrectEndingName(promotion.price)} 
          </p>
        </div>
      </div>
      {promotion.description != undefined && promotion.description.length > 0 ? (
      <div className="w-full min-w-[328px]  h-fit max-h-[125px] p-4 bg-light-gray-1 rounded-2xl mt-[14px] flex flex-col justify-center items-start dark:bg-light-gray-6">
        <h3 className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">Описание</h3>
        <p className="font-gerbera-sub1 text-light-gray-4 h-fit text-start mt-[10px] dark:text-light-gray-3 overflow-y-auto">
          {promotion.description}
        </p>
      </div>
      ): ""}
      
      {promotion.picture && (
        <img
          className="w-full min-w-[328px] max-w-[360px] h-[205px] rounded-2xl mt-[14px] self-center"
          src={promotion.picture}
          decoding='async'
          loading='lazy'
        />
      )}
      {!reserved ? (
        <div className="w-full min-w-[328px] flex justify-between items-center mt-[14px] self-center">
        <button
          onClick={() => {
            setConfirmMakeReservationModal(true)
          }}
          className="btn-B-GreenDefault "
        >
          Забронировать
        </button>
        <button
          onClick={(e) => {
              e.preventDefault();
              onOpenChange(false)
          }}
          className="btn-M-WhiteDefault "
        >
          Закрыть
        </button>
      </div>
      ) : (
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
            cancelPromotion(promotion)
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
            makeReservationFunc(promotion)
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
