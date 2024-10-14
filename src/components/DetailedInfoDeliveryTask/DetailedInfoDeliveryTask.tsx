import React, {useState} from 'react'
//import { type IDelivery } from "../../api/apiDeliveries";
import { type ITask } from "../../api/apiTasks";
import { getMonthCorrectEndingName, getBallCorrectEndingName } from '../helperFunctions/helperFunctions';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

interface IDelivery {
  id: number;
  date: string;
  curator: {
    id: number;
    tg_id: number;
    tg_username: string;
    last_name: string;
    name: string;
    avatar: string;
  };
  price: number;
  is_free: boolean;
  is_active: boolean;
  is_completed: boolean;
  in_execution: boolean;
  volunteers_needed: number;
  volunteers_taken: number;
  delivery_assignments: string[];
  route_sheet: number;
  location: {
    id: number;
    city: {
      id: number;
      city: string;
    };
    address: string;
    link: string;
    subway: string;
    media_files: null | string;
    description: string;
  };
}

export const delivery1: IDelivery = {
  id: 1,
  date: '2024-10-08T15:00:00Z',
  curator: {
    id: 9,
    tg_id: 333,
    tg_username: '@mgdata',
    last_name: 'Фомина',
    name: 'Анна',
    avatar: '../src/assets/icons/pictureTest.jpg',
  },
  price: 5,
  is_free: true,
  is_active: true,
  is_completed: false,
  in_execution: false,
  volunteers_needed: 5,
  volunteers_taken: 3,
  delivery_assignments: [],
  route_sheet: 1,
  location: {
    id: 1,
    city: {
      id: 1,
      city: 'Москва',
    },
    address:
      'поселение Внуковское, ул. Авиаконстраукора Петькина, д.15 к1. строение 15 кв. 222',
    link: 'null',
    subway: 'Белорусская',
    media_files: null,
    description: 'В черную дверь возле лифта, второй этаж В черную дверь возле лифта, второй этаж В черную дверь возле лифта, второй этаж В черную дверь возле лифта, второй этажВ черную дверь возле лифта, второй этажВ черную дверь возле лифта, второй этажВ черную дверь возле лифта, второй этаж',
  },
};

type TDetailedInfoDelivery = {
  delivery?: IDelivery
  isOpen: boolean
  onOpenChange:(open: boolean) => void
}

const DetailedInfoDelivery: React.FC<TDetailedInfoDelivery> = ({ delivery = delivery1, isOpen, onOpenChange }) => {

  ////const [isAddToCalendarModalOpen, setIsAddToCalendarModalOpen] = useState(false);
  const [isDeliveryInCalendar, setIsDeliveryInCalendar] = useState(false);

  const deliveryDate = new Date(delivery.date);
  return (
  
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <>
          <div className="w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
            onClick={(e)=>{e.stopPropagation()}}>
        <div className="flex justify-between w-full">
          <div className="flex items-start">
               <div className="flex w-fit items-start">
          <img src="../src/assets/icons/metro_station.svg" />
          <div className="flex flex-col justify-center items-start pl-2 w-max-[290px]">
            <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
              Ст. {delivery.location.subway}
            </h1>
            <p className="font-gerbera-sub1 tetx-light-gray-5 text-left h-fit w-[230px] dark:text-light-gray-3">
              {delivery.location.address}
            </p>
          </div>
                </div>
                <p className="font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4">
                  Доставка{' '}
                </p>
          </div>
        </div>

        {/* /////////////////////// */}
        <div className="flex justify-between items-center mt-[14px]">
          <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
            <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
              Время начала
            </p>
            <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
              {`${deliveryDate.getDate()}
              ${getMonthCorrectEndingName(deliveryDate)} в
              ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
            </p>
          </div>
          <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
            <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
              Начисление баллов
            </p>
            <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
              {'+'}
              {delivery.price} {getBallCorrectEndingName(delivery.price)}
            </p>
          </div>
        </div>
           {/* /////////////////////// */}
        <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4">
          <div className="flex">
            <img
              className="h-[32px] w-[32px] rounded-full"
              src={delivery.curator.avatar}
            />
            <div className="felx flex-col justify-center items-start ml-4">
              <h1 className="font-gerbera-h3 text-light-gray-8-text text-start">
                {delivery.curator.name}
              </h1>
              <p className="font-gerbera-sub2 text-light-gray-2 text-start">
                Куратор
              </p>
            </div>
          </div>
          <a href={'https://t.me/' + delivery.curator.tg_username} target="_blank">
            <img
              src="../src/assets/icons/small_sms.svg"
              className="w-[36px] h-[35px]"
            />
          </a>
        </div>
        {/* /////////////////////// */}
        {delivery.location.description && delivery.location.description.length != 0 ? (
        <div className="w-[330px] min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex flex-col h-fit items-start justify-start p-4">
            <p className='font-gerbera-h3 text-light-gray-8-text text-start'>Подробности</p>
            <p className='font-gerbera-sub1 text-light-gray-5 mt-[6px] text-start'>{delivery.location.description}</p>
         </div>
        ): ""}
       
          {/* /////////////////////// */}
        <button
          className="btn-B-GreenDefault  mt-[20px]"
          onClick={e => {
            e.preventDefault();
            setIsDeliveryInCalendar(true)
          }}
        >
          Записаться
        </button>
        </div>
        </>
      </Modal>
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* заменить кнопку записаться на вы уже записались!!!! в основном окне */}
      <ConfirmModal isOpen={isDeliveryInCalendar} onOpenChange={setIsDeliveryInCalendar} onConfirm={() => setIsDeliveryInCalendar(false)} onCancel={() => setIsDeliveryInCalendar(false)} title='Доставка в календаре' description="" confirmText="Ок" cancelText="В календарь" isSingleButton={false} />
    </>

  )
          
}

const DetailedInfoTask:React.FC<ITask> = (task) => {

  
  return (
    <>
      { task}
    </>
  ) 
}

export {DetailedInfoDelivery, DetailedInfoTask}