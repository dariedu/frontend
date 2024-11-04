import React, { useState } from 'react';
import { type IDelivery } from '../../../../api/apiDeliveries';
import {
  getBallCorrectEndingName,
  getMetroCorrectName,
} from '../../../helperFunctions/helperFunctions';
import { DetailedInfoDelivery } from '../../../DetailedInfoDeliveryTask/DetailedInfoDeliveryTask';
import { Modal } from '../../Modal/Modal';

type TCardDeliveryProps = {
  delivery: IDelivery;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getDelivery: (delivery: IDelivery) => {};
  stringForModal: string;
  takeDeliverySuccess: boolean;
  setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const CardDelivery: React.FC<TCardDeliveryProps> = ({
  delivery,
  switchTab,
  getDelivery,
  stringForModal,
  takeDeliverySuccess,
  setTakeDeliverySuccess,
}) => {
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
      <div
        className="p-4 bg-light-gray-1 rounded-2xl shadow w-[240px] h-[116px] mb-4 flex flex-col justify-between"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          <div className="flex items-start justify-center">
            <img
              src="./../src/assets/icons/metro_station.svg"
              alt="task-icon"
              className="w-[32px] h-[32px]"
            />
            <div className="flex flex-col items-start ml-2">
              <p className="font-gerbera-h3 text-light-gray-black w-40 h-[18px] overflow-hidden text-start">
                {getMetroCorrectName(delivery.location.subway)}
                {/* {delivery.location.subway.replace(/м\.\s|м\.|м\s/, "").slice(0, 1).toLocaleUpperCase() + delivery.location.subway.replace(/м\.\s|м\.|м\s/, "").slice(1)} */}
              </p>
              <p className="text-light-gray-black font-gerbera-sub1">
                {delivery.location.address}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-[133px]">
          <div className="flex items-center justify-center bg-light-gray-white w-[54px] h-[28px] rounded-full">
            {`${hours}:${minutes}`}
          </div>
          <div className="flex items-center justify-center bg-light-brand-green min-w-[75px] h-[28px] rounded-full">
            <span className="text-light-gray-white font-gerbera-sub2">
              + {delivery.price} {getBallCorrectEndingName(delivery.price)}
            </span>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <DetailedInfoDelivery
          delivery={delivery}
          switchTab={switchTab}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          getDelivery={getDelivery}
          stringForModal={stringForModal}
          takeDeliverySuccess={takeDeliverySuccess}
          setTakeDeliverySuccess={setTakeDeliverySuccess}
        />
      </Modal>
    </>
  );
};

export default CardDelivery;
