import React, { useState, useContext} from 'react';
import {
  getMonthCorrectEndingName
} from '../helperFunctions/helperFunctions';
import RouteSheetsM from '../RouteSheets/RouteSheetsM';
import DeliveryFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import { type IDelivery } from '../../api/apiDeliveries';
//import { getUserById, IUser } from '../../api/userApi';
import { UserContext } from '../../core/UserContext';
import { type IRouteSheet, assignRouteSheet, type TRouteSheetRequest} from '../../api/routeSheetApi';

interface IDeliveryWithRouteSheets extends IDelivery {
  delivery_routeSheets?: IRouteSheet[]
}

interface INearestDeliveryProps {
  delivery: IDeliveryWithRouteSheets
  deliveryFilter: TDeliveryFilter
  //routeSheetsList?:IRouteSheet[]
}

type TDeliveryFilter = 'nearest' | 'active' | 'completed';

const NearestDeliveryCurator: React.FC<INearestDeliveryProps> = ({
  delivery,
  deliveryFilter,
 // routeSheetsList
}) => {
  const deliveryDate = new Date(delivery.date);

  const [fullViewCompleted, setFullViewCompleted] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewActive, setFullViewActive] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewNearest, setFullViewNearest] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали

  const [currentStatus, setCurrentStatus] = useState<TDeliveryFilter>(deliveryFilter); /// статус доставки 'nearest' | 'active' | 'completed'
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] = useState(false); ////// открываем модальное окно, чтобы подтвердить доставку
  const [assignVolunteerSuccess, setAssignVolunteerSuccess] = useState(false)
  const [assignVolunteerFail, setAssignVolunteerFail] = useState(false)

  // console.log(delivery, "NearestDeliveryCurator")
  ///////////////////////////
  // function onSelectVolunteer(
  //   volunteerName: string,
  //   volunteerAvatar: string,
  // ): void {
  //   console.log(volunteerName + ' ' + volunteerAvatar);
  // }
  ////////////////////////

    ////// используем контекст юзера
    const userValue = useContext(UserContext);
    const token = userValue.token;
   ////// используем контекст

  
  // function getAllVolunteers() { 
  //   if (token && delivery.delivery_assignments) {
  //     let usersArr: IUser[] = [];
  //     Promise.allSettled(delivery.delivery_assignments.map(id => getUserById(id, token)))
  //       .then(responses => responses.forEach((result, num) => {
  //         if (result.status == "fulfilled") {
  //           usersArr.push(result.value)
  //         }
  //         if (result.status == "rejected") {
  //           console.log(`${num} user was not fetched`)
  //         }
  //       })).finally(() => setVolunteers(usersArr)
  //       )
  //   }
  // }
  
  // assignRouteSheet = async (
  //   routeSheetId:number,
  //   access:string,
  //   data: TRouteSheetRequest,
  // type TRouteSheetRequest = {
  //   volunteer_id: number
  //   delivery_id: number
  // };

  async function onVolunteerAssign(volunteerId: number, deliveryId: number, routeSheetId: number) {
    let object:TRouteSheetRequest = {
      volunteer_id: volunteerId,
      delivery_id: deliveryId,
      routesheet_id:routeSheetId
    }
    if (token) {
      try {
        let result = await assignRouteSheet(token, object)
        if (result) {
          setAssignVolunteerSuccess(true)
        }
      } catch (err) {
        setAssignVolunteerFail(true)
      }
    }
  }
  


  return (
    <>
      <div
        className={`${fullViewActive == true ? 'hidden ' : ' '} w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
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
            <p className="btn-S-GreenInactive flex items-center justify-center">
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
              <img
                src="../src/assets/icons/arrow_right.png"
                className="cursor-pointer"
                onClick={() => {
                  setFullViewActive(true);
                }}
              />
            ) : currentStatus == 'completed' ? (
              <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullViewCompleted ? 'rotate-180' : ''} cursor-pointer`}
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
            <div className="flex justify-between items-center mt-[20px]">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
                <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                  Время начала
                </p>
                <p className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  {`${deliveryDate.getDate()}
                  ${getMonthCorrectEndingName(deliveryDate)} в
                  ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
                </p>
              </div>
              <div className="bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
                <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                  Записались
                </p>
                <p className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  {delivery.volunteers_taken == 0
                    ? `0 из ${delivery.volunteers_needed}`
                    : `${delivery.volunteers_taken} из ${delivery.volunteers_needed} ${delivery.volunteers_needed == 1 ? "": "волонтёров"}`}
                </p>
              </div>
            </div>
            {delivery.volunteers_taken == 0 ? ("") : (
              <button
              className="btn-B-WhiteDefault mt-[20px]"
              onClick={() => setFullViewNearest(true)}
            >
              Список записавшихся волонтёров
            </button>
            )}
          </>
        ) : (
          ''
        )}
        {currentStatus == 'completed' && fullViewCompleted ? (
          <button
            className="btn-B-GreenDefault  mt-[20px]"
            onClick={e => {
              e.preventDefault();
              setIsCuratorFeedbackModalOpen(true);
            }}
          >
            Поделиться впечатлениями
          </button>
        ) : (
          ''
        )}

        {/* /////////////////////// */}
      </div>
      { delivery.delivery_assignments!=undefined && delivery.delivery_routeSheets && delivery.delivery_assignments.length > 0 && delivery.delivery_routeSheets.length > 0 ? (
       <Modal isOpen={fullViewActive} onOpenChange={setFullViewActive}>
       <RouteSheetsM
         status="Активная"
         onClose={() => setFullViewActive(false)}
        //  onStatusChange={() => {
        //   return setCurrentStatus('completed');
        //  }}
         routeSheetsData={delivery.delivery_routeSheets}
         completedRouteSheets={[]}
        // setCompletedRouteSheets={() => { }}
          listOfVolunteers={delivery.delivery_assignments}
          onVolunteerAssign={onVolunteerAssign}
          deliveryId={delivery.id}
       />
     </Modal>
      ): ("")
       
      }
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <DeliveryFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)}
          volunteer={false}
          delivery={true}
          deliveryOrTaskId={0}
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

      {/* ///// раскрываем полные детали активной доставуи для куратора///// */}
      {currentStatus == 'nearest' ? (
        delivery.delivery_assignments ? (
          <Modal isOpen={fullViewNearest} onOpenChange={setFullViewNearest}>
          <ListOfVolunteers
            listOfVolunteers={delivery.delivery_assignments}
            onOpenChange={setFullViewNearest}
            showActions={true}
          />
        </Modal>
        ): ("")
       
      ) : (
        ''
      )}
<ConfirmModal
  isOpen={assignVolunteerSuccess}
  onOpenChange={setAssignVolunteerSuccess}
    onConfirm = {() => {setAssignVolunteerSuccess(false)}}
  title={
    <p>
    Волонтер успешно назначен на доставку!
    </p>
  }
  description=""
  confirmText="Ок"
  isSingleButton={true}
      />
      <ConfirmModal
  isOpen={assignVolunteerFail}
  onOpenChange={setAssignVolunteerFail}
    onConfirm = {() => {setAssignVolunteerFail(false)}}
  title={
    <p>
      Упс, что-то пошло не так<br />
      Попробуйте позже
    </p>
  }
  description=""
  confirmText="Ок"
  isSingleButton={true}
/>
    </>
  );
};

export default NearestDeliveryCurator;
