import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
} from '../../../helperFunctions/helperFunctions';
import DetailedInfo from '../../../DetailedInfo/DetailedInfo';
import { Modal } from '../../Modal/Modal';
import { type IPromotion } from '../../../../api/apiPromotions';
import * as Avatar from '@radix-ui/react-avatar';


// Интерфейс для пропсов CardPromotion
interface IPromotionProps {
  promotion: IPromotion
  optional: boolean
  reserved: boolean
  makeReservationFunc?: (promotion: IPromotion) => void
  cancelPromotion?: (promotion: IPromotion) => void
}

const CardPromotion: React.FC<IPromotionProps> = ({ promotion, optional, reserved, makeReservationFunc, cancelPromotion}) => {
  const [openFullView, setOpenFullView] = useState(false);

  const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180);
  let day: number = eventDate.getUTCDate();
  let month: string = getMonthCorrectEndingName(eventDate);

  return (
    <>
      <div
        className="w-[159px] bg-light-gray-white rounded-2xl overflow-hidden flex flex-col h-[190px] select-none dark:bg-light-gray-6"
        onClick={() => setOpenFullView(true)}
      >
        {/* Image Section */}
        <div className="relative">
          {promotion.picture ? (
          <Avatar.Root className='inline-flex items-center justify-center align-middle overflow-hidden w-[159px] h-[112px] rounded-2xl bg-light-gray-2 dark:bg-light-gray-5'>{
            promotion.picture && (
             <Avatar.Image src={promotion.picture} decoding='async'  loading='lazy' className='w-[159px] h-[112px] object-cover rounded-2xl' />
         )}
              <Avatar.Fallback delayMs={2000} className='bg-light-gray-2 dark:bg-light-gray-5 rounded-t-2xl w-full h-full'>
                
           </Avatar.Fallback>
         </Avatar.Root>
         
          ) : (
              <div className='w-[159px] h-[112px] bg-light-gray-2 '></div>
          )}
          <div className="absolute top-2 left-2 bg-light-brand-green text-light-gray-white px-2 py-1 rounded-full font-gerbera-sub1">
            {promotion.price + ' ' + getBallCorrectEndingName(promotion.price)}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1 text-left mt-[6px] p-[6px]">
          <p className="font-gerbera-sub2 text-light-gray-black w-[159px] h-[17px] dark:text-light-gray-1 overflow-hidden">
            {promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1)}
          </p>
          {!promotion.is_permanent ? (
            <p className="font-gerbera-sub1 text-light-brand-green ">
              {day + ' ' + month}
            </p>
          ) : (
            <p className="font-gerbera-sub1 text-light-brand-green ">
            В любое время
          </p>
          )}
          <p className="font-gerbera-sub1 text-light-gray-4 overflow-hidden h-[15px]">
            {promotion.address}
          </p>
        </div>
      </div>
        <Modal isOpen={openFullView} onOpenChange={setOpenFullView}>
           <DetailedInfo onOpenChange={setOpenFullView} optional={optional} promotion={promotion} reserved={reserved} makeReservationFunc={makeReservationFunc} cancelPromotion={cancelPromotion} />
        </Modal>
    </>
  );
};

export default CardPromotion;
