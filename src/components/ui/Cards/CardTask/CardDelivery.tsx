import React, { useState } from 'react';
import { type IDelivery } from '../../../../api/apiDeliveries';
import {
  getBallCorrectEndingName,
  getMetroCorrectName,
} from '../../../helperFunctions/helperFunctions';
import { DetailedInfoDelivery } from '../../../DetailedInfoDeliveryTask/DetailedInfoDeliveryTask';
import { Modal } from '../../Modal/Modal';
import Metro_station from './../../../../assets/icons/metro_station.svg?react'



type TCardDeliveryProps = {
  delivery: IDelivery
  canBook: boolean
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getDelivery: (delivery: IDelivery) => void;
  stringForModal: string;
  takeDeliverySuccess: boolean;
  setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const CardDelivery: React.FC<TCardDeliveryProps> = ({ delivery, canBook, switchTab,  getDelivery, stringForModal, takeDeliverySuccess, setTakeDeliverySuccess}) => {
 const [isOpen, setIsOpen] = useState(false);

   const deliveryDate = new Date(delivery.date);
   const hours =
    deliveryDate.getHours() < 10
      ? '0' + deliveryDate.getHours()
      : deliveryDate.getHours();
    const minutes =
    deliveryDate.getMinutes() < 10
      ? '0' + deliveryDate.getMinutes()
      : deliveryDate.getMinutes();

     return (
     <>
     <div className="p-4 bg-light-gray-1 rounded-2xl shadow w-[240px] h-[116px] mb-4 flex flex-col justify-between dark:bg-light-gray-6" onClick={()=>setIsOpen(true)}>
      <div className="flex items-center">
             <div className="flex items-start justify-center">
             <Metro_station  className='w-[32px] h-[32px] bg-[#FFFFFF] fill-[#000000] rounded-full dark:bg-[#575757] dark:fill-[#F8F8F8]' />
          <div className='flex flex-col items-start ml-2'>
              <p className='font-gerbera-h3 text-light-gray-black w-40 h-[18px] overflow-hidden text-start dark:text-light-gray-white'>
                {getMetroCorrectName(delivery.location.subway)}
              </p>
          <p className='text-light-gray-black font-gerbera-sub1 dark:text-light-gray-3'>{delivery.location.address}</p>

          </div>
             </div>
            </div>    
        <div className="flex justify-between items-center w-fit space-x-1">
        <div className="flex justify-center text-center bg-light-gray-white w-fit h-fit py-[6px] px-3 rounded-2xl dark:bg-light-gray-5 dark:text-light-gray-2 font-gerbera-sub2">
          {`${hours}:${minutes}`}
            </div>
          <div className="flex items-center justify-center bg-light-brand-green w-fit h-fit py-[6px] px-3 rounded-2xl">
            <span className="text-light-gray-white font-gerbera-sub2">
              + {delivery.price} {getBallCorrectEndingName(delivery.price)}
            </span>
          </div>
        </div>
           </div>
           
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
       <DetailedInfoDelivery delivery={delivery} canBook={canBook} switchTab={switchTab} isOpen={isOpen} onOpenChange={setIsOpen} getDelivery={getDelivery} stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
      </Modal>
          
         </>
         )

   };

export default CardDelivery;
