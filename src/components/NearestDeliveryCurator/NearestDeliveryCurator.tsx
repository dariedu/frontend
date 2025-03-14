import React, { useState, useEffect, useContext} from 'react';
import {
  getBallCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import RouteSheetsM from '../RouteSheetsCurator/RouteSheetsCurator';
import DeliveryFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import { ModalTop } from '../ui/Modal/ModalTop';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import { type IDelivery, TCuratorDelivery,  TVolunteerForDeliveryAssignments, type TDeliveryListConfirmedForCurator } from '../../api/apiDeliveries';
import {
  // assignRouteSheet,
  type IRouteSheet
} from '../../api/routeSheetApi';
import { type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import { TokenContext } from '../../core/TokenContext';
import Arrow_right from './../../assets/icons/arrow_right.svg?react'
import Arrow_down from './../../assets/icons/arrow_down.svg?react'
import { requestMyDelivery,  requestEachMyRouteSheet, requestRouteSheetsAssignments, filterVolList } from './helperFunctions'


interface INearestDeliveryProps {
  curatorDelivery:TCuratorDelivery
  deliveryFilter: TDeliveryFilter
  feedbackSubmited?: boolean
  arrayListOfConfirmedVol:TDeliveryListConfirmedForCurator[]|null
}

type TDeliveryFilter = 'nearest' | 'active' | 'completed';

const NearestDeliveryCurator: React.FC<INearestDeliveryProps> = ({
  curatorDelivery,
  deliveryFilter,
  feedbackSubmited,
  arrayListOfConfirmedVol
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
  const [reqAssignedRouteSheetsSuccess, setReqAssignedRouteSheetsSuccess] = useState(false);///для апи запроса всех записанных маршрутных листов на волонтеров
  const [completeDeliverySuccess, setCompleteDeliverySuccess] = useState(false);
  const [activateDeliverySuccess, setActivateDeliverySuccess] = useState(false);
//  const [deliveryStatus, setDeliveryStatus]= useState<'Активная' | 'Ближайшая' | 'Завершенная' >(status)
  const [routeSheets, setRouteSheets] = useState<IRouteSheet[]>([])
  const [listOfConfirmedVol, setListOfConfirmedVol] = useState<number[] | null>(null); ///список подтвержденных волонтеров на доставку

  ///// используем контекст токена
   const {token} = useContext(TokenContext);
  ////// используем контекст
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  // assignVolunteerSuccess, unassignVolunteerSuccess
 const [unassignVolunteerSuccess, setUnassignVolunteerSuccess] = useState(false)
  const [assignVolunteerSuccess, setAssignVolunteerSuccess] = useState(false)
  
  useEffect(() => {
    filterVolList(arrayListOfConfirmedVol, curatorDelivery,  setListOfConfirmedVol)
  }, [arrayListOfConfirmedVol])
  

  useEffect(() => {
    requestMyDelivery(token, curatorDelivery, setDelivery, setDeliveryDate, setListOfVolunteers )
    requestEachMyRouteSheet(token,  deliveryFilter, curatorDelivery, setRouteSheets);
  }, [])

  useEffect(() => {
    requestRouteSheetsAssignments(token, curatorDelivery, setAssignedRouteSheets, setReqAssignedRouteSheetsSuccess);
  }, [unassignVolunteerSuccess, assignVolunteerSuccess])

// console.log(assignedRouteSheets, "assignedRouteSheets")

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

                {currentStatus == 'active' || (currentStatus == 'nearest') ? (
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
            {currentStatus == 'nearest' || currentStatus == 'active'   ? (
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
               {currentStatus == 'active' ?  'Волонтёры' : "Записались"}
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
           { currentStatus == 'active'  ? "Список волонтёров" : "Список записавшихся волонтёров"} 
            </button>
            )}
          </>
        ) : (
          ''
            )}
          
            {currentStatus == 'completed' && fullViewCompleted && (
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
               Баллы
                </p>
                <p className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  + {delivery.price} {getBallCorrectEndingName(delivery.price)}
                </p>
              </div>
                </div>
                {
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
                }
              
              </>
        )}
        {/* /////////////////////// */}
      </div>
      { routeSheets && reqAssignedRouteSheetsSuccess ? (
       <ModalTop isOpen={fullViewActive} onOpenChange={setFullViewActive}>
       <RouteSheetsM
        status={currentStatus ? (currentStatus == 'nearest' ? 'Ближайшая' : currentStatus == 'active' ? 'Активная' : 'Завершенная'):(deliveryFilter == 'nearest' ? 'Ближайшая' : deliveryFilter == 'active' ? 'Активная' : 'Завершенная')}
        currentStatus={currentStatus}
        routeSheetsData={routeSheets}
        onClose={() => setFullViewActive(false)}
        changeListOfVolunteers={setListOfVolunteers}
        listOfVolunteers={listOfVolunteers}
        listOfConfirmedVol={listOfConfirmedVol}
        deliveryId={delivery.id}
        assignedRouteSheets={assignedRouteSheets}
        setActivateDeliverySuccess={setActivateDeliverySuccess}
        setCompleteDeliverySuccess={setCompleteDeliverySuccess}
        setCurrentStatus={setCurrentStatus}
         unassignVolunteerSuccess={unassignVolunteerSuccess}
         setUnassignVolunteerSuccess={setUnassignVolunteerSuccess}
         assignVolunteerSuccess={assignVolunteerSuccess}
         setAssignVolunteerSuccess={setAssignVolunteerSuccess}
                
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
      {currentStatus == 'nearest' || currentStatus == "active" ? (
        <Modal isOpen={fullViewNearest} onOpenChange={setFullViewNearest}>
          <ListOfVolunteers
            listOfVolunteers={listOfVolunteers}
            listOfConfirmedVol={listOfConfirmedVol}
            changeListOfVolunteers={setListOfVolunteers}
            onOpenChange={setFullViewNearest}
            deliveryId={delivery.id}
            showActions={false}
            preview={true}
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
      {delivery &&
        <ConfirmModal
        isOpen={activateDeliverySuccess}
        onOpenChange={setActivateDeliverySuccess}
        onConfirm={() => setActivateDeliverySuccess(false)}
        title={
          <p>
            Доставка активирована,
            <br />теперь волонтёры смогут видеть назначенные маршрутные листы.
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
export type {TDeliveryFilter}
