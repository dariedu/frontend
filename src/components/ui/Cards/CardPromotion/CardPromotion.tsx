import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
} from '../../../helperFunctions/helperFunctions';
import DetailedInfo from '../../../DetailedInfo/DetailedInfo';
import { Modal } from '../../Modal/Modal';
import { type IPromotion } from '../../../../api/apiPromotions';

// Интерфейс для пропсов CardPromotion
interface IPromotionProps {
  promotion: IPromotion;
}

const CardPromotion: React.FC<IPromotionProps> = ({ promotion }) => {
  const [openFullView, setOpenFullView] = useState(false);

  const eventDate: Date = new Date(promotion.start_date);
  let day: number = eventDate.getDate();
  let month: string = getMonthCorrectEndingName(eventDate);

  return (
    <>
      <div
        className="w-[159px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-[182px] select-none"
        onClick={() => setOpenFullView(true)}
      >
        {/* Image Section */}
        <div className="relative">
          {promotion.picture ? (
            <img
              src={promotion.picture}
              alt={promotion.name}
              draggable={false} // Prevent default image dragging
              className="w-[159px] h-[112px] object-cover rounded-[16px]"
            />
          ) : (
            <img
              src="./../src/assets/icons/pictureTest.jpg"
              alt={promotion.name}
              draggable={false} // Prevent default image dragging
              className="w-[159px] h-[112px] object-cover rounded-[16px]"
            />
          )}
          <div className="absolute top-2 left-2 bg-light-brand-green text-light-gray-white px-2 py-1 rounded-full font-gerbera-sub1">
            {promotion.price + ' ' + getBallCorrectEndingName(promotion.price)}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1 text-left mt-[6px] p-[6px]">
          <p className="font-gerbera-sub2 text-light-gray-black w-[159px]">
            {promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1)}
          </p>
          {promotion.start_date ? (
            <p className="font-gerbera-sub1 text-light-brand-green ">
              {day + ' ' + month}
            </p>
          ) : (
            ''
          )}
          <p className="font-gerbera-sub1 text-light-gray-3">
            {promotion.address}
          </p>
        </div>
      </div>
        <Modal isOpen={openFullView} onOpenChange={setOpenFullView}>
           <DetailedInfo promotion={promotion} />
        </Modal>
    </>
  );
};

export default CardPromotion;
