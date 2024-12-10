import React, { useState, useEffect, useContext} from 'react';
import {
  getBallCorrectEndingName,
  // getMonthCorrectEndingName
} from '../helperFunctions/helperFunctions';
import RouteSheetsM from '../RouteSheets/RouteSheetsCurator';
import DeliveryFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import { ModalTop } from '../ui/Modal/ModalTop';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import { type IDelivery, TCuratorDelivery, getDeliveryById, TVolunteerForDeliveryAssignments, postDeliveryComplete } from '../../api/apiDeliveries';
import { type IRouteSheet, getRouteSheetById} from '../../api/routeSheetApi';
import { getRouteSheetAssignments, type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import { TokenContext } from '../../core/TokenContext';
import Arrow_right from './../../assets/icons/arrow_right.svg?react'
import Arrow_down from './../../assets/icons/arrow_down.svg?react'



interface INearestDeliveryProps {
  curatorDelivery:TCuratorDelivery
  deliveryFilter: TDeliveryFilter
  feedbackSubmited?:boolean
}

type TDeliveryFilter = 'nearest' | 'active' | 'completed';

const NearestDeliveryCurator: React.FC<INearestDeliveryProps> = ({
  curatorDelivery,
  deliveryFilter,
  feedbackSubmited
}) => {

  const [isFeedbackSubmited, setIsFeedbackSubmited] = useState(feedbackSubmited);
  const [delivery, setDelivery] = useState<IDelivery>()
  const [fullViewCompleted, setFullViewCompleted] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewActive, setFullViewActive] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewNearest, setFullViewNearest] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали

  const [currentStatus, setCurrentStatus] = useState<TDeliveryFilter>(deliveryFilter) ; /// статус доставки 'nearest' | 'active' | 'completed'
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] = useState(false); ////// открываем модальное окно, чтобы подтвердить доставку
  
  const [listOfVolunteers, setListOfVolunteers] = useState<TVolunteerForDeliveryAssignments[]>([])
  const [assignedRouteSheets, setAssignedRouteSheets] = useState<IRouteSheetAssignments[]>([]); /// список волонтеров по маршрутным листам!!!!!
  const [assignedRouteSheetsSuccess, setAssignedRouteSheetsSuccess] = useState(false)
  const [completeDeliverySuccess, setCompleteDeliverySuccess] = useState(false);

  const [routeSheets, setRouteSheets] = useState<IRouteSheet[]>([])
   
  ///// используем контекст токена
   const {token} = useContext(TokenContext);
  ////// используем контекст
  const [deliveryDate, setDeliveryDate] = useState<Date>();


  async function requestMyDelivery() { 
     if (token) {
       try {
         const result: IDelivery = await getDeliveryById(token, curatorDelivery.id_delivery);      
         if (result) {
          if (result.is_completed) { 
            let timeDiff = Math.abs(+new Date() - +new Date(result.date));
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays <= 5) { setDelivery(result) }
          } else {
             setDelivery(result)
          }
           setDeliveryDate(new Date(Date.parse(result.date) + 180 * 60000))
           curatorDelivery.volunteers.map(vol => {
             if (vol.photo && !vol.photo.includes('https')) {
               vol.photo = vol.photo.replace('http', 'https')
             }
           })
           setListOfVolunteers(curatorDelivery.volunteers)
         }
       } catch (err) {
         console.log("requestMyDelivery() NearestDeliveryCurator has failed")
          }
     }
  }
  ////завершение доставки куратором
  async function requestDeliveryComplete(deliveryId:number) {
    if (token && delivery) {
      try {
        const result: IDelivery = await postDeliveryComplete(token, deliveryId, delivery);
        if (result) {
          setCurrentStatus('completed')
          setCompleteDeliverySuccess(true)
        }
      } catch (err) {
        console.log("requestDeliveryComplete, NearestDeliveryCurator has failed")
     }
   } 
  }

   //// 4. запрашиваем все маршрутные листы по отдельности только у активной или доставки в процессе
 function requestEachMyRouteSheet() {
   let routesArr: IRouteSheet[] = [];
   if (token &&(deliveryFilter == 'active' || deliveryFilter == "nearest")) {
     Promise.allSettled(curatorDelivery.id_route_sheet.map(routeS => { return getRouteSheetById(token, routeS) }))
         .then(responses => responses.forEach((result, num) => {
           if (result.status == "fulfilled") {
             routesArr.push(result.value)
           }
           if (result.status == "rejected") {
             console.log(`${num} routeSheet was not fetched`)
           }
         })).finally(() => {setRouteSheets(routesArr)}
         )
    }
  }
    ////запрашиваем все записанные на волонтеров маршрутные листы
    async function requestRouteSheetsAssignments() {
      if (token) {
        try {
          const response:IRouteSheetAssignments[] = await getRouteSheetAssignments(token);
          if (response) {
            let filtered = response.filter(i => i.delivery == curatorDelivery.id_delivery)
            setAssignedRouteSheets(filtered)
            setAssignedRouteSheetsSuccess(true);
          }
        } catch (err) {
          console.log(err)
        }
      }
    }


  useEffect(() => {
    requestMyDelivery()
    requestEachMyRouteSheet();
    requestRouteSheetsAssignments();
  }, [])



  return (
    <>
      {(delivery !== undefined && deliveryDate!=undefined) && (
        <>
           <div
        className={`${fullViewActive == true ? 'hidden ' : ' '} w-full max-w-[500px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
      >
        <div className="flex justify-between w-full">
          {/* //////// */}
          {currentStatus == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшая
            </p>
          ) : currentStatus == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активная
            </p>
          ) : currentStatus == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center ">
              Завершённая
            </p>
          ) : (
            ''
          )}
          {/* ////////// */}
          <div className="flex items-center">
            <p
              className={
                'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2'
              }
            >
              Доставка{' '}
            </p>

                {currentStatus == 'active' || (currentStatus == 'nearest' && delivery.volunteers_taken != 0) ? (
                    <Arrow_right  className="stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer"
                    onClick={() => {
                      setFullViewActive(true);
                    }}
                  />
                ) : currentStatus == 'completed' ? (
                    <Arrow_down className={` ${!fullViewCompleted ? 'rotate-180' : ''} stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer`}
                  onClick={() => {
                    fullViewCompleted == true
                      ? setFullViewCompleted(false)
                      : setFullViewCompleted(true);
                  }}
                />
            ) : (
              ''
            )}
          </div>
        </div>
        {/* /////////////////////// */}
        {currentStatus == 'nearest' ? (
          <>
            <div className="flex justify-between items-center mt-[20px] space-x-2">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-full box-border min-w-[161px] h-[62px] p-3 dark:bg-light-gray-6">
                <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                  Время начала
                </p>
                <p className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  {`${deliveryDate.getUTCDate()}
                  ${deliveryDate.toLocaleDateString("RU", {month:"short"})} в
                  ${deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours()}:${deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes()}`}
                </p>
              </div>
              <div className="bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl flex flex-col justify-between box-border items-start w-full min-w-[161px] h-[62px] p-3">
                <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                  Записались
                </p>
                <p className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  {delivery.volunteers_taken == 0
                    ? `0 из ${delivery.volunteers_needed}`
                    : `${delivery.volunteers_taken} из ${delivery.volunteers_needed}`}
                </p>
              </div>
            </div>
            {delivery.volunteers_taken == 0 ? ("") : (
              <button
              className="btn-B-WhiteDefault mt-[20px] self-center"
              onClick={() => setFullViewNearest(true)}
            >
              Список записавшихся волонтёров
            </button>
            )}
          </>
        ) : (
          ''
            )}
          
            {currentStatus == 'completed' && fullViewCompleted && (
              feedbackSubmited ? (
                <button
                className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                Oтзыв отправлен
              </button>
              ) : isFeedbackSubmited ? (
                <button
                className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                Oтзыв отправлен
              </button>
              ) : ( <button
                className="btn-B-GreenDefault  mt-[20px] self-center"
                onClick={e => {
                  e.preventDefault();
                  setIsCuratorFeedbackModalOpen(true);
                }}
              >
                Поделиться впечатлениями
              </button>)
        )}
        {/* /////////////////////// */}
      </div>
      { routeSheets && routeSheets.length > 0 && assignedRouteSheetsSuccess ? (
       <ModalTop isOpen={fullViewActive} onOpenChange={setFullViewActive}>
       <RouteSheetsM
        status={deliveryFilter == 'nearest' ? 'Ближайшая' : deliveryFilter == 'active' ? 'Активная' : 'Завершенная'}
        currentStatus={currentStatus}
        onClose={() => setFullViewActive(false)}
        routeSheetsData={routeSheets}
        listOfVolunteers={listOfVolunteers}
        changeListOfVolunteers={setListOfVolunteers}
        deliveryId={delivery.id}
        assignedRouteSheets={assignedRouteSheets}
        changeAssignedRouteSheets={requestRouteSheetsAssignments}
        completeDeliveryFunc={requestDeliveryComplete}
       />
     </ModalTop>
      ): ("")
      }
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <DeliveryFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={() => { setIsFeedbackSubmitedModalOpen(true); setIsFeedbackSubmited(true) }}
          volunteer={false}
          delivery={true}
          deliveryOrTaskId={curatorDelivery.id_delivery}
        />
      </Modal>
      <ConfirmModal
        isOpen={isFeedbackSubmitedModalOpen}
        onOpenChange={setIsFeedbackSubmitedModalOpen}
        onConfirm={() => setIsFeedbackSubmitedModalOpen(false)}
        title={
          <p>
            Спасибо, что поделились!
            <br /> Это важно.
          </p>
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      {/* ///// раскрываем полные детали активной доставки для куратора///// */}
      {currentStatus == 'nearest' ? (
          <Modal isOpen={fullViewNearest} onOpenChange={setFullViewNearest}>
          <ListOfVolunteers
            listOfVolunteers={listOfVolunteers}
            changeListOfVolunteers={setListOfVolunteers}
            onOpenChange={setFullViewNearest}
            deliveryId={delivery.id}
            showActions={false}
          />
        </Modal>
      ) : (
        ''
      )}
        </>)}
      {delivery &&
        <ConfirmModal
        isOpen={completeDeliverySuccess}
        onOpenChange={setCompleteDeliverySuccess}
        onConfirm={() => setCompleteDeliverySuccess(false)}
        title={
          <p>
            Доставка завершена
            <br /> +{delivery.price} {getBallCorrectEndingName(delivery.price)}
          </p>
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
         }
        
    </>
  );
};

export default NearestDeliveryCurator;
