import React from 'react';
import {
  // getMonthCorrectEndingName,
  getBallCorrectEndingName,
  getMetroCorrectName,
} from '../helperFunctions/helperFunctions';
// import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { IDelivery } from '../../api/apiDeliveries';
import Metro_station from './../../assets/icons/metro_station.svg?react';
import Small_sms from './../../assets/icons/small_sms.svg?react';
import * as Avatar from '@radix-ui/react-avatar';

type TDetailedInfoDelivery = {
  delivery: IDelivery;
  canBook: boolean;
  // isOpen: boolean;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  getDelivery: (delivery: IDelivery) => void;
  stringForModal: string;
  takeDeliverySuccess: boolean;
  setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const DetailedInfoDelivery: React.FC<TDetailedInfoDelivery> = ({
  delivery,
  canBook,
  // isOpen,
  onOpenChange,
  switchTab,
  getDelivery,
  stringForModal,
  takeDeliverySuccess,
  setTakeDeliverySuccess,
}) => {
  
  const deliveryDate = new Date(Date.parse(delivery.date) + 180 * 60000);

  let curatorTelegramNik = delivery.curator.tg_username;
  if (
    delivery.curator.tg_username &&
    delivery.curator.tg_username.length != 0
  ) {
    curatorTelegramNik = delivery.curator.tg_username.includes('@')
      ? delivery.curator.tg_username.slice(1)
      : delivery.curator.tg_username;
  }


    if (delivery.curator.photo && !delivery.curator.photo.includes('https')) {
      delivery.curator.photo = delivery.curator.photo.replace('http', 'https')
    }
  
  

  return (
    <>
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}> */}
        <>
          <div
            className="w-full max-w-[500px] py-[17px] px-4 h-fit rounded-2xl  mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-row justify-beetween w-full">
              <div className="flex w-[80%]">
                <Metro_station className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] bg-[#F8F8F8] fill-[#000000] rounded-full dark:bg-[#575757] dark:fill-[#F8F8F8]" />
                <div className="flex flex-col items-start pl-2">
                  <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                    {getMetroCorrectName(delivery.location.subway)}
                  </h1>
                  <p className="font-gerbera-sub1 text-light-gray-5 text-left h-fit max-w-[230px] dark:text-light-gray-3">
                    {delivery.location.address}
                  </p>
                </div>
              </div>
              <p className="font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 w-[20%] p-0 text-right">
                Доставка
              </p>
            </div>

            {/* /////////////////////// */}
            <div className="flex justify-center items-center mt-[14px] space-x-2">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
                <p className="font-gerbera-sub3 text-light-gray-black dark:text-light-gray-3">
                  Время начала
                </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                  {`${deliveryDate.getUTCDate()}
              ${deliveryDate.toLocaleDateString("RU", {month:"short"})} в
              ${deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours()}:${deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes()}`}
                </p>
              </div>
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
                <p className="font-gerbera-sub3 text-light-gray-black dark:text-light-gray-3">
                  Начисление баллов
                </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                  {'+'}
                  {delivery.price} {getBallCorrectEndingName(delivery.price)}
                </p>
              </div>
            </div>
            {/* /////////////////////// */}
            {delivery.curator.name && delivery.curator.name.length > 0 ? (
              <div className="w-full h-[67px] bg-light-gray-1 box-border rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
                <div className="flex">
                  <Avatar.Root className=" h-[32px] w-[32px] min-h-[32px] min-w-[32px] inline-flex items-center justify-center  bg-light-gray-white dark:bg-light-gray-8-text rounded-full">
                    <Avatar.Image
                      src={delivery.curator.photo || ''}
                      alt="Avatar"
                      className="h-[32px] w-[32px] min-h-[32px] min-w-[32px] object-cover rounded-full cursor-pointer"
                    />
                    <Avatar.Fallback className="text-black dark:text-white">
                      {delivery.curator.name ? delivery.curator.name[0] : 'A'}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="felx flex-col justify-center items-start ml-4">
                    <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                      {delivery.curator.name}
                    </h1>
                    <p className="font-gerbera-sub3 text-light-gray-4 text-start dark:text-light-gray-3">
                      Куратор
                    </p>
                  </div>
                </div>
                {curatorTelegramNik && curatorTelegramNik.length > 0 ? (
                  <a
                    href={'https://t.me/' + curatorTelegramNik}
                    target="_blank"
                  >
                    <Small_sms className="w-[36px] h-[35px] min-h-[35px] min-w-[36px]" />
                  </a>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}

            {/* /////////////////////// */}
            {delivery.location.description &&
            delivery.location.description.length != 0 ? (
              <div className="w-full bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl mt-[20px] flex flex-col h-fit items-start justify-start p-4">
                <p className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                  Подробности
                </p>
                <p className="font-gerbera-sub1 text-light-gray-4 dark:text-light-gray-3 mt-[6px] text-start">
                  {delivery.location.description}
                </p>
              </div>
            ) : (
              ''
            )}

            {/* ///////!delivery.is_free || ///////// */}
            <div className='w-full flex justify-center'>
            {!canBook ? (
              <button
                className="btn-B-WhiteDefault mt-[20px] dark:bg-light-gray-6 dark:text-light-brand-green self-center"
                onClick={e => {
                  e.preventDefault();
                  onOpenChange(false);
                }}
              >
                Вы уже записались
              </button>
            ) : !delivery.is_free ? (
              <button
                className="btn-B-GreenInactive  mt-[20px] dark:bg-light-gray-6 dark:text-light-brand-green self-center"
                onClick={e => {
                  e.preventDefault();
                  onOpenChange(false);
                }}
              >
                Нет мест
              </button>
            ) : (
              <button
                className="btn-B-GreenDefault  mt-[20px] self-center"
                onClick={e => {
                  e.preventDefault();
                  getDelivery(delivery);
                }}
              >
                Записаться
              </button>
            )}
            </div>
            
          </div>
        </>
      {/* </Modal> */}
      <ConfirmModal
        isOpen={takeDeliverySuccess}
        onOpenChange={setTakeDeliverySuccess}
        onConfirm={() => {
          setTakeDeliverySuccess(false);
        }}
        onCancel={() => {
          switchTab('tab2');
          setTakeDeliverySuccess(false);
        }}
        title={`Доставка ${stringForModal} в календаре `}
        description=""
        confirmText="Ок"
        cancelText="В календарь"
        isSingleButton={false}
      />
    </>
  );
};

export { DetailedInfoDelivery };
