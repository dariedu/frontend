import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
  getVolunteerCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import RouteSheets from '../RouteSheets/RouteSheets';
import DeliveryFeedback from '../DeliveryFeedback/DeliveryFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal'
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';

  
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
    description: 'Доставка милой бабуле',
  },
};

interface INearestDeliveryProps {
  delivery?: IDelivery;
  volunteer?: boolean;
  deliveryFilter?: TDeliveryFilter;
  booked?: boolean;
}

type TDeliveryFilter = 'nearest' | 'active' | 'completed';

const NearestDelivery: React.FC<INearestDeliveryProps> = ({
  delivery = delivery1,
  volunteer = true,
  deliveryFilter = 'active',
  //booked = false,
}) => {
  const deliveryDate = new Date(delivery.date);
  const currentDate = new Date();

  const [fullView, setFullView] = useState(false); ////раскрываем доставку, чтобы увидеть детали
  const [fullViewCurator, setFullViewCurator] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TDeliveryFilter>(deliveryFilter); /// статус доставки 'nearest' | 'active' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке волонтера
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] = useState(false); ////// открываем модальное окно, чтобы подтвердить доставку

  const [isConfirmDeliveryModalOpen, setIsConfirmDeliveryModalOpen] = useState(false); ///// модальное окно для подтверждения доставки 
  const [isDeliveryConfirmedModalOpen, setIsDeliveryConfirmedModalOpen] = useState(false); ///// модальное окно для подтверждения подтверждения доставки
  
  const [isCancelDeliveryModalOpen, setIsCancelDeliveryModalOpen] = useState(false);//// модальное окно для отмены доставки
  const [isDeliveryCancelledModalOpen, setIsDeliveryCancelledModalOpen] = useState(false);  //// модальное окно для подтверждения отмены доставки
  
  
  const lessThenTwoHours =
    (deliveryDate.valueOf() - currentDate.valueOf()) / 60000 <= 120;

  let curatorTelegramNik = delivery.curator.tg_username.includes('@')
    ? delivery.curator.tg_username.slice(1)
    : delivery.curator.tg_username;

  
  function onSelectVolunteer(volunteerName: string, volunteerAvatar: string):void {
    console.log(volunteerName + " " + volunteerAvatar)
  }
  return (
    <>
      {/* ///// раскрываем полные детали активной доставуи для волонтера///// */}
      {currentStatus == 'active' && volunteer ? (
              fullView == true ? (
                  <RouteSheets title= "Маршрутный лист 1" status= 'Активная'  onClose={()=>setFullView(false)} onStatusChange={()=>{setCurrentStatus('completed')}} />                
              ) : (
                ''
              )
            ) : (
              ''
      )} 
        {currentStatus == 'active' && !volunteer ? (
              fullViewCurator == true ? (
                  <RouteSheets title= "Маршрутный лист 1" status= 'Активная'  onClose={()=>setFullViewCurator(false)} onStatusChange={()=>{setCurrentStatus('completed')}} />                
              ) : (
                ''
              )
            ) : (
              ''
      )} 
      <div className={`${(currentStatus == 'active' && volunteer) ? (fullView == true ? "hidden" : "" ): (currentStatus == 'active' &&  !volunteer) ?  (fullViewCurator == true ? "hidden" : ""): ""} w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}>
        <div className="flex justify-between w-full">
          {currentStatus == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшая
            </p>
          ) : currentStatus == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активная
            </p>
          ) : currentStatus == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center">
              Завершённая
            </p>
          ) : (
            ''
          )}

          <div className="flex items-center">
            <p
              className={!volunteer && currentStatus == "nearest" ? "font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2": "font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2 cursor-pointer"}             
              onClick={() => {
                volunteer ? (fullView == true ? setFullView(false) : setFullView(true)) : (currentStatus== "nearest" ? "" :( fullViewCurator == true ? setFullViewCurator(false) : setFullViewCurator(true)) )
              }}
            >
              Доставка{' '}
            </p>
            {volunteer ? (
             currentStatus == 'nearest' || currentStatus == 'completed' ? (
              <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullView ? 'rotate-180' : ''} cursor-pointer`}
                onClick={() => {
                  fullView == true ? setFullView(false) : setFullView(true);
                }}
              />
            ) : currentStatus == 'active' ? (
              <img
                src="../src/assets/icons/arrow_right.png"
                className=" cursor-pointer"
                onClick={() => {
                  fullView == true ? setFullView(false) : setFullView(true);
                }}
              />
            ) : (
              ''
            )
            ) : (currentStatus == 'active' ? (
              <img
              src="../src/assets/icons/arrow_right.png"
              className=" cursor-pointer"
              onClick={() => {
                fullViewCurator==true ? setFullViewCurator(false) : setFullViewCurator(true);
              }}
            /> 
              ) : currentStatus == 'completed' ? (
                <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullViewCurator? 'rotate-180' : ''} cursor-pointer`}
                onClick={() => {
                  fullViewCurator==true ? setFullViewCurator(false) : setFullViewCurator(true);
                }}
              />
            ): ""
            )
             }
           
          </div>
        </div>
        {/* /////////////////////// */}
        
        {volunteer ? (
        <div className="flex w-fit  pt-[10px]">
        <img src="../src/assets/icons/metro_station.svg" />
        <div className="flex flex-col justify-center items-start pl-2 max-w-[290px]">
          <h1 className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
            Ст. {delivery.location.subway}
          </h1>
          <p className="font-gerbera-sub1 text-light-gray-5 text-left h-fit max-w-[290px] dark:text-light-gray-3">
            {delivery.location.address}
          </p>
        </div>
      </div>
        ) : ""}
        
        {/* /////////////////////// */}
        {volunteer ? (currentStatus == 'completed' ? (""): (
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
        )
        ) : (currentStatus == 'active' ? ("") : currentStatus == 'nearest' ? (
        <div className="flex justify-between items-center mt-[20px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-5 ">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {`${deliveryDate.getDate()}
                  ${getMonthCorrectEndingName(deliveryDate)} в
                  ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-5">Записались</p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {delivery.volunteers_taken == 0
                  ? '0 из'  + `${delivery.volunteers_needed}`
                  : `${delivery.volunteers_taken  + " из " + `${delivery.volunteers_needed}` + " " + getVolunteerCorrectEndingName(delivery.volunteers_needed)}`}
              </p>
            </div>
          </div>
        ) : ""
          
        )}

        {volunteer ? (
          (currentStatus == 'nearest' || currentStatus == 'completed')? (
            fullView ? (
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
                <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
                  <img
                    src="../src/assets/icons/small_sms.svg"
                    className="w-[36px] h-[35px]"
                  />
                </a>
              </div>
            ) : (
              ''
            )
          ) : currentStatus == 'active' ? ( ""
          ) : (
            ''
          )
        ) : (
          ''
        )}

        {fullView ? (
          currentStatus == 'nearest' ? (
            lessThenTwoHours ? (
              <div className="w-[329px] flex justify-between">
                <button
                  className="btn-M-GreenDefault  mt-[20px]"
                  onClick={e => {
                    e.preventDefault();
                    setIsConfirmDeliveryModalOpen(true)
                  }}
                >
                  Подтвердить
                </button>
                <button
                  className="btn-M-WhiteDefault  mt-[20px]"
                  onClick={e => {
                    e.preventDefault();
                   setIsCancelDeliveryModalOpen(true)
                  }}
                >
                  Отказаться
                </button>
              </div>
            ) : (
              <button
                className="btn-B-GrayDefault  mt-[20px]"
                onClick={e => {
                  e.preventDefault();
                  setIsCancelDeliveryModalOpen(true)
                }}
              >
                Отказаться
              </button>
            )
          ) : currentStatus == 'completed' ? (
            <button
            className="btn-B-GreenDefault  mt-[20px]"
            onClick={e => {
              e.preventDefault()
              setIsModalOpen(true)
            }}
          >
            Поделиться впечатлениями
          </button>
          ): ""
        ) : (
            !volunteer ? currentStatus == "active" || currentStatus == "completed" ? "" : (
              <button className='btn-B-WhiteDefault mt-[20px]' onClick={()=>setFullViewCurator(true)}>Список записавшихся волонтёров</button>
              ) : ""
        )}
         {!volunteer ? (currentStatus == "completed" && fullViewCurator) ? ( <button className="btn-B-GreenDefault  mt-[20px]"
            onClick={e => {
              e.preventDefault()
              setIsCuratorFeedbackModalOpen(true)
            }}
          >
            Поделиться впечатлениями
          </button>)
            : "" : ""}

        {/* /////////////////////// */}
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <DeliveryFeedback onOpenChange={setIsModalOpen} onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)} volunteer={true} delivery={true} />
      </Modal>
      <Modal isOpen={isCuratorFeedbackModalOpen} onOpenChange={setIsCuratorFeedbackModalOpen}>
        <DeliveryFeedback onOpenChange={setIsCuratorFeedbackModalOpen} onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)} volunteer={false} delivery={true} />
      </Modal>
      <ConfirmModal isOpen={isFeedbackSubmitedModalOpen} onOpenChange={setIsFeedbackSubmitedModalOpen} onConfirm={() => setIsFeedbackSubmitedModalOpen(false)} title={<p>Спасибо, что поделились!<br /> Это важно.</p>} description="" confirmText="Закрыть" isSingleButton={true} />
      <ConfirmModal isOpen={isConfirmDeliveryModalOpen} onOpenChange={setIsConfirmDeliveryModalOpen} onConfirm={() => { setIsConfirmDeliveryModalOpen(false); setIsDeliveryConfirmedModalOpen(true) }} title={<p>Вы подтверждаете участие в доставке?</p>} description="" confirmText="Да" cancelText='Нет'  />
      <ConfirmModal isOpen={isCancelDeliveryModalOpen} onOpenChange={setIsCancelDeliveryModalOpen} onConfirm={() => { setIsDeliveryCancelledModalOpen(true); setIsCancelDeliveryModalOpen(false) }} title={<p>Уверены, что хотите отменить участие в доставке?</p>} description="" confirmText="Да" cancelText="Нет" />
      <ConfirmModal isOpen={isDeliveryCancelledModalOpen} onOpenChange={setIsDeliveryCancelledModalOpen} onConfirm={() => setIsDeliveryCancelledModalOpen(false)} title='Участие в доставке отменено' description="" confirmText="Ок" isSingleButton={true} />
      <ConfirmModal isOpen={isDeliveryConfirmedModalOpen} onOpenChange={setIsDeliveryConfirmedModalOpen} onConfirm={() => setIsDeliveryConfirmedModalOpen(false)} title='Участие в доставке подтверждено' description="" confirmText="Ок" isSingleButton={true} />
      {/* ///// раскрываем полные детали активной доставуи для куратора///// */}
      {currentStatus == "nearest" ? (
      <Modal isOpen={fullViewCurator} onOpenChange={setFullViewCurator}><ListOfVolunteers  onSelectVolunteer={onSelectVolunteer}  onTakeRoute={()=>{}} showActions={true} /></Modal> 
      ) : "" }
    </>
  );
};

export default NearestDelivery;
