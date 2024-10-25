import React from 'react';
import { type IPromotion } from './../../api/apiPromotions.ts';
import { getBallCorrectEndingName, getMonthCorrectEndingName } from '../helperFunctions/helperFunctions';


interface IDefaultInfoProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  optional: boolean
  promotion: IPromotion
  reserved: boolean 
  confirmed?: boolean
  makeReservationFunc?: (chosenId: number) => void
  cancelPromotion?: (chosenId: number) => void
}

 

const DetailedInfo: React.FC<IDefaultInfoProps> = ({
  onOpenChange,
  optional,
  promotion,
  reserved,
  makeReservationFunc,
  cancelPromotion
}) => {

  const eventDate: Date = new Date(promotion.start_date);
  const currentDate = new Date()
  const promotionDate = new Date(promotion.start_date)
  const lessThenOneHour = (promotionDate.valueOf() - currentDate.valueOf()) / 60000 <= 60;

  return (
    <div className="w-[360px] flex flex-col h-fit rounded-t-2xl px-4 pt-[41px] pb-8 mt- bg-light-gray-white" onClick={e=>e.stopPropagation()}>
      <div className="flex align-middle justify-between">
        <div className="flex">
          <div className="flex flex-col ml-[14px] justify-center items-start">
            <h1 className="w-[162px] h-fit font-gerbera-h3 m-0 p-0" >
              {promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1)}
            </h1>
            <p className="w-[162px] font-gerbera-sub1 text-light-gray-4 text-start">
              {promotion.address}
            </p>
          </div>
        </div>
        <p className="font-gerbera-sub2 text-light-gray-3 mr-2">{promotion.category.name.slice(0,1).toUpperCase()+promotion.category.name.slice(1)}</p>
      </div>
      {optional ? "" : (
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start p-4 mt-[14px]">
        <h3 className="font-gerbera-h3 text-light-gray-black">
         Как получить билет?
        </h3>
        {promotion.is_permanent ?
          (<p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px]">
          {promotion.about_tickets}
          </p>) : lessThenOneHour ? (
        <p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px]">
        {promotion.about_tickets}
        </p>
        ) : (<p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px]">
          За один час до мероприятия тут будет информация о вашем билете
          </p>)}
        
      </div>
      )}
    
      {/* {promotion.file != undefined ? (
        <div className="flex w-[215px] h-[24px] justify-start mt-[14px] items-center">
          <img
            src="./src/assets/icons/catppuccin_pdf.svg"
            className="w-4 h-4"
          />
          <a
            href={promotion.file}
            className="font-gerbera-sub2 text-light-gray-4 stroke-none ml-[14px]"
          >
            билет в формате PDF
          </a>
        </div>
      ) : (
        ''
      )} */}
      <div className="flex justify-between items-center mt-[14px]">
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
          <p className="font-gerbera-sub2 text-light-gray-black ">
            Время начала
          </p>
          <p className="font-gerbera-h3 text-light-gray-black">
            {promotion.is_permanent
              ? 'В любое время'
                : `${eventDate.getDate()}
            ${getMonthCorrectEndingName(eventDate)} в
            ${eventDate.getHours() < 10 ? '0' + eventDate.getHours() : eventDate.getHours()}:${eventDate.getMinutes() < 10 ? '0' + eventDate.getMinutes() : eventDate.getMinutes()}`
          }  
            
          </p>
        </div>
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
          <p className="font-gerbera-sub2 text-light-gray-black ">
            Списание баллов
          </p>
          <p className="font-gerbera-h3 text-light-brand-green ">
            {promotion.price} {getBallCorrectEndingName(promotion.price)} 
          </p>
        </div>
      </div>
      <div className="w-[328px] h-fit p-4 bg-light-gray-1 rounded-2xl mt-[14px] flex flex-col justify-center items-start">
        <h3 className="font-gerbera-h3 text-light-gray-black">Описание</h3>
        <p className="font-gerbera-sub1 text-light-gray-4 h-full text-start mt-[10px]">
          {promotion.description}
        </p>
      </div>
      {/* {promotion.picture.length > 0 ? (
        <img
          className="w-[328px] h-[205px] rounded-2xl mt-[14px]"
          src={promotion.picture}
        />
      ) : (
        ''
      )} */}
      {!reserved ? (
        <div className="flex justify-between items-center mt-[14px]">
        <button
          onClick={() => {
            if (makeReservationFunc) {
              makeReservationFunc(promotion.id)
              onOpenChange(false)
            }
          }}
          className="btn-M-GreenDefault"
        >
          Забронировать
        </button>
        <button
          onClick={(e) => {
              e.preventDefault();
              onOpenChange(false)
          }}
          className="btn-M-WhiteDefault"
        >
          Отменить
        </button>
      </div>
      ) : (
       <div className="flex justify-between items-center mt-[14px]">
       <button
         onClick={() => {
          if (cancelPromotion) {
            cancelPromotion(promotion.id)
            onOpenChange(false)
          }
         }}
         className="btn-B-WhiteDefault"
       >
         Отказаться
       </button>
     </div>
      )}
     
    </div>
  );
};


export default DetailedInfo;
