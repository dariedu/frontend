import { useState, useEffect, useContext } from 'react';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
// import Filter from './../../assets/icons/filter.svg?react';
import { Modal } from '../ui/Modal/Modal';
import { IDelivery } from '../../api/apiDeliveries';
import { ITask } from '../../api/apiTasks';
import Bread from './../../assets/icons/bread.svg?react';
import { IPromotion } from '../../api/apiPromotions';
import {
  combineAllNotConfirmed,
  cancelPromotion,
  cancelTakenDelivery,
  cancelTakenTask,
  confirmDelivery,
  confirmTask,
  confirmPromotion,
} from './helperFunctions';
import { getMetroCorrectName } from '../helperFunctions/helperFunctions';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { TokenContext } from '../../core/TokenContext';
import CancelledDeliveryOrTaskFeedback from '../DeliveryOrTaskFeedback/CancelledDeliveryOrTaskFeedback';


type TNotificationInfo = {
  objType: 'task' | 'delivery' | 'promo';
  nameOrMetro: string;
  addressOrInfo: string|JSX.Element
  stringStart: string;
  idString: string;
  id: number;
  timeString: string;
  oneDay: boolean;
};

interface INotifications {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  allNotConfirmedToday: IDelivery[];
  setAllNotConfirmedToday: React.Dispatch<React.SetStateAction<IDelivery[]>>;
  allNotConfirmedTomorrow: IDelivery[];
  setAllNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<IDelivery[]>>;
  allTasksNotConfirmedToday: ITask[];
  setAllTasksNotConfirmedToday: React.Dispatch<React.SetStateAction<ITask[]>>;
  allTasksNotConfirmedTomorrow: ITask[];
  setAllTasksNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<ITask[]>
  >;
  allPromoNotConfirmedToday: IPromotion[];
  setAllPromoNotConfirmedToday: React.Dispatch<React.SetStateAction<IPromotion[]>
  >;
  allPromoNotConfirmedTomorrow: IPromotion[];
  setAllPromoNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<IPromotion[]>
  >;
}

const Notifications: React.FC<INotifications> = ({
  onClose,
  open,
  allNotConfirmedToday,
  setAllNotConfirmedToday,
  allNotConfirmedTomorrow,
  setAllNotConfirmedTomorrow,
  allTasksNotConfirmedToday,
  setAllTasksNotConfirmedToday,
  allTasksNotConfirmedTomorrow,
  setAllTasksNotConfirmedTomorrow,
  allPromoNotConfirmedToday,
  setAllPromoNotConfirmedToday,
  allPromoNotConfirmedTomorrow,
  setAllPromoNotConfirmedTomorrow,
}) => {
  /////подтврждение
  const [confirmParticipation, setConfirmParticipation] = useState(false);
  const [confirmString, setConfirmString] = useState<string | JSX.Element>('');
  const [indexForAction, setIndexForAction] = useState<number>(NaN);
  const [notifDay, setNotifDay] = useState<'today'|"tomorrow"|null>(null);

  const [confirmedSuccess, setConfirmedSuccess] = useState(false);
  const [confirmedSuccessString, setConfirmedSuccessString] = useState<string>('');

  const [confirmFailed, setConfirmFailed] = useState(false);
  const [confirmFailedString, setConfirmFailedString] = useState<string>('');
  /////подтврждение
  /////отмена
  const [cancelParticipation, setCancelParticipation] = useState(false);
  const [cancelString, setCancelString] = useState<string | JSX.Element>('');

  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelSuccessString, setCancelSuccessString] = useState<string>('');

  const [cancelFail, setCancelFail] = useState(false);
  const [cancelFailString, setCancelFailString] = useState<string>('');
  /////отмена
  const [cancelTaskId, setCancelTaskId] = useState<number|undefined>()
  const [cancelDeliveryId, setCancelDeliveryId] = useState<number|undefined>()
  const [cancelTaskDeliveryReasonOpenModal, setCancelTaskDeliveryReasonOpenModal] = useState(false);
  const [isCancelledTaskDeliveryFeedbackSubmited, setIsCancelledTaskDeliveryFeedbackSubmited] = useState(false);

  const { token } = useContext(TokenContext);
  // console.log(setAllNotConfirmedToday,  setAllNotConfirmedTomorrow, setAllTasksNotConfirmedToday,  setAllTasksNotConfirmedTomorrow, setAllPromoNotConfirmedToday,  setAllPromoNotConfirmedTomorrow)

  const [allMyNotificationsToday, setAllMyNotificationsToday] = useState<TNotificationInfo[]
  >([]);
  const [allMyNotificationsTomorrow, setAllMyNotificationsTomorrow] = useState<
    TNotificationInfo[]
  >([]);

  useEffect(() => {
    combineAllNotConfirmed(
      allNotConfirmedToday,
      allNotConfirmedTomorrow,
      allTasksNotConfirmedToday,
      allTasksNotConfirmedTomorrow,
      allPromoNotConfirmedToday,
      allPromoNotConfirmedTomorrow,
      setAllMyNotificationsToday,
      setAllMyNotificationsTomorrow,
    );
  }, [
    allNotConfirmedToday,
    allNotConfirmedTomorrow,
    allTasksNotConfirmedToday,
    allTasksNotConfirmedTomorrow,
    allPromoNotConfirmedToday,
    allPromoNotConfirmedTomorrow,
  ]);

  function handleCancelClick(item: TNotificationInfo) {
    // console.log(item, 'item to cancel');
    if (notifDay == "today" || notifDay == "tomorrow") {
      if (item.objType == 'delivery' && token) {
        cancelTakenDelivery(
          item,
          setCancelDeliveryId,
          setNotifDay,
          notifDay == "today" ? allNotConfirmedToday : allNotConfirmedTomorrow,
          notifDay == "today" ? setAllNotConfirmedToday : setAllNotConfirmedTomorrow,
          token,
          setCancelSuccess,
          setCancelSuccessString,
          setCancelFail,
          setCancelFailString,
        );
      } else if (item.objType == 'task' && token) {
        cancelTakenTask(
          item,
          setCancelTaskId,
          setNotifDay,
          notifDay == "today" ? allTasksNotConfirmedToday : allTasksNotConfirmedTomorrow,
          notifDay == "today" ? setAllTasksNotConfirmedToday :setAllTasksNotConfirmedTomorrow,
          token,
          setCancelSuccess,
          setCancelSuccessString,
          setCancelFail,
          setCancelFailString,
        );
      } else if (item.objType == 'promo' && token) {
        cancelPromotion(
          item,
          setNotifDay,
          notifDay == "today" ? allPromoNotConfirmedToday : allPromoNotConfirmedTomorrow,
          notifDay == "today" ? setAllPromoNotConfirmedToday :setAllPromoNotConfirmedTomorrow,
          token,
          setCancelSuccess,
          setCancelSuccessString,
          setCancelFail,
          setCancelFailString,
        );
      }
    }
  }

  function handleConfirmClick(item: TNotificationInfo) {
    console.log(item, 'item to confirm');
    if (notifDay == "today" || notifDay == "tomorrow") {
    if (item.objType == 'delivery' && token) {
      confirmDelivery(
        item,
        setNotifDay,
        notifDay == "today" ? allNotConfirmedToday : allNotConfirmedTomorrow,
        notifDay == "today" ? setAllNotConfirmedToday : setAllNotConfirmedTomorrow,
        token,
        setConfirmedSuccess,
        setConfirmedSuccessString,
        setConfirmFailed,
        setConfirmFailedString,
      );
    } else if (item.objType == 'task' && token) {
      confirmTask(
        item,
        setNotifDay,
        notifDay == "today" ? allTasksNotConfirmedToday : allTasksNotConfirmedTomorrow,
        notifDay == "today" ? setAllTasksNotConfirmedToday :setAllTasksNotConfirmedTomorrow,
        token,
        setConfirmedSuccess,
        setConfirmedSuccessString,
        setConfirmFailed,
        setConfirmFailedString,
      );
    } else if (item.objType == 'promo' && token) {
      confirmPromotion(
        item,
        setNotifDay,
        notifDay == "today" ? allPromoNotConfirmedToday : allPromoNotConfirmedTomorrow,
        notifDay == "today" ? setAllPromoNotConfirmedToday :setAllPromoNotConfirmedTomorrow,
        token,
        setConfirmedSuccess,
        setConfirmedSuccessString,
        setConfirmFailed,
        setConfirmFailedString,
      );
    }
    }
    
  }

  return (
    <Modal isOpen={open} onOpenChange={onClose}>
      <div
        className="bg-light-gray-1 dark:bg-light-gray-black rounded-b-2xl w-full max-w-[500px] h-full flex flex-col overflow-y-auto justify-start overflow-x-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-[4px] px-4 bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-full rounded-b-2xl h-[60px] min-h-[60px] ">
          <button onClick={() => onClose(false)}>
            <RightArrowIcon className="rotate-180 w-9 h-9 stroke-[#D7D7D7] dark:stroke-[#575757]" />
          </button>
          <div className="flex justify-between w-full items-center">
            <h2 className="text-light-gray-black dark:text-light-gray-1 ml-2">
              Уведомления
            </h2>
            {/* <Filter
              // onClick={() => {
              //   setOpenFilter(true);
              // }}
              className="cursor-pointer rounded-full bg-light-gray-1 fill-[#0A0A0A] dark:bg-light-gray-6 dark:fill-[#F8F8F8]"
            /> */}
          </div>
        </div>
        <div className="flex flex-col items-center px-4 w-full max-w-[500px]">
          {allMyNotificationsToday.length > 0 || allMyNotificationsTomorrow.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full max-w-[500px]">
              {allMyNotificationsToday.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full max-w-[500px]">
                  <div className="w-fit flex flex-col justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6">
                    Сегодня
                  </div>
                  {allMyNotificationsToday.map((objItem, index) => {
                    return (
                      <div
                        key={objItem.idString}
                        className="text-light-gray-6 h-fit w-full  bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                      >
                        <div className=" flex flex-col justify-between mb-[6px]">
                          <p className="font-gerbera-h3 dark:text-light-gray-1 text-light-gray-8-text w-fit h-fit  mb-[6px]">
                            Подтвердите{' '}
                            {objItem.objType == 'delivery'
                              ? 'доставку'
                              : objItem.objType == 'promo'
                                ? 'бронь'
                                : 'участие в добром деле'}
                          </p>
                          <p className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text h-fit">
                            {objItem.objType == 'delivery'
                              ? `Ст. ${getMetroCorrectName(objItem.nameOrMetro)}`
                              : objItem.nameOrMetro.slice(0, 1).toUpperCase() +
                                objItem.nameOrMetro.slice(1)}
                          </p>
                          <div className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text max-h-[48px] overflow-hidden h-fit">
                            {objItem.addressOrInfo}
                          </div>
                          <p className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text  h-fit">
                            {objItem.stringStart}
                          </p>
                          <div className="w-[229px] h-[38px] flex justify-between items-center mt-4">
                            <button
                              className="btn-S-GreenDefault"
                              onClick={() => {
                                setConfirmString(
                                  objItem.objType == 'delivery' ? (
                                    <p>
                                      Подтвердить участие в доставке м.{' '}
                                      {`${getMetroCorrectName(objItem.nameOrMetro)}`}
                                      ,<br /> сегодня в{' '}
                                      {`${objItem.stringStart.slice(-5)}`}?
                                    </p>
                                  ) : objItem.objType == 'task' ? (
                                    <p>
                                      Подтвердить участие в добром деле{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      ,<br />{' '}
                                      {`${objItem.oneDay ? 'сегодня в ' + objItem.stringStart.slice(-5) : objItem.stringStart}`}
                                      ?
                                    </p>
                                  ) : (
                                    <p>
                                      Вы уверены, что хотите отказаться от брони
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      {`${objItem.oneDay ? ',' : '?'}`}
                                      <br />{' '}
                                      {`${objItem.oneDay ? 'сегодня в ' + objItem.stringStart.slice(-5) + '?' : ''}`}
                                    </p>
                                  ),
                                );
                                setNotifDay('today')
                                setIndexForAction(index);
                                setConfirmParticipation(true);
                              }}
                            >
                              Подтвердить
                            </button>
                            <button
                              className="btn-S-GreenInactive"
                              onClick={() => {
                                setCancelString(
                                  objItem.objType == 'delivery' ? (
                                    <p>
                                      Вы уверены, что хотите отказаться от
                                      доставки
                                      <br />
                                      м.{' '}
                                      {`${getMetroCorrectName(objItem.nameOrMetro)}`}
                                      ,<br /> сегодня в{' '}
                                      {`${objItem.stringStart.slice(-5)}`}?
                                    </p>
                                  ) : objItem.objType == 'task' ? (
                                    <p>
                                      Вы уверены, что хотите отказаться от
                                      доброго дела
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      ,<br />{' '}
                                      {`${objItem.oneDay ? 'сегодня в ' + objItem.stringStart.slice(-5) : objItem.stringStart}`}
                                      ?
                                    </p>
                                  ) : (
                                    <p>
                                      Вы уверены, что хотите отказаться от брони
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      {`${objItem.oneDay ? ',' : '?'}`}
                                      <br />{' '}
                                      {`${objItem.oneDay ? 'сегодня в ' + objItem.stringStart.slice(-5) + '?' : ''}`}
                                    </p>
                                  ),
                                );
                                setNotifDay('today')
                                setIndexForAction(index);
                                setCancelParticipation(true);
                              }}
                            >
                              Отказаться
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {allMyNotificationsTomorrow.length > 0 && (
                <div className="flex flex-col items-center justify-center w-full max-w-[500px]">
                  <div className="w-fit flex flex-col justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6">
                    Завтра
                  </div>
                  {allMyNotificationsTomorrow.map((objItem, index) => {
                    return (
                      <div
                        key={objItem.idString}
                        className="text-light-gray-6 h-fit w-full  bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                      >
                        <div className=" flex flex-col justify-between mb-[6px]">
                          <p className="font-gerbera-h3 dark:text-light-gray-1 text-light-gray-8-text w-fit h-fit  mb-[6px]">
                            Подтвердите{' '}
                            {objItem.objType == 'delivery'
                              ? 'доставку'
                              : objItem.objType == 'promo'
                                ? 'бронь'
                                : 'участие в добром деле'}
                          </p>
                          <p className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text h-fit">
                            {objItem.objType == 'delivery'
                              ? `Ст. ${getMetroCorrectName(objItem.nameOrMetro)}`
                              : objItem.nameOrMetro.slice(0, 1).toUpperCase() +
                                objItem.nameOrMetro.slice(1)}
                          </p>
                          <div className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text max-h-[48px] overflow-hidden h-fit">
                            {objItem.addressOrInfo}
                          </div>
                          <p className="font-gerbera-sub1 dark:text-light-gray-1 text-light-gray-8-text  h-fit">
                            {objItem.stringStart}
                          </p>
                          <div className="w-[229px] h-[38px] flex justify-between items-center mt-4">
                            <button
                              className="btn-S-GreenDefault"
                              onClick={() => {
                                setConfirmString(
                                  objItem.objType == 'delivery' ? (
                                    <p>
                                      Подтвердить участие в доставке м.{' '}
                                      {`${getMetroCorrectName(objItem.nameOrMetro)}`}
                                      ,<br /> завтра в{' '}
                                      {`${objItem.stringStart.slice(-5)}`}?
                                    </p>
                                  ) : objItem.objType == 'task' ? (
                                    <p>
                                      Подтвердить участие в добром деле{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      ,<br />{' '}
                                      {`${objItem.oneDay ? 'завтра в ' + objItem.stringStart.slice(-5) : objItem.stringStart}`}
                                      ?
                                    </p>
                                  ) : (
                                    <p>
                                      Вы уверены, что хотите отказаться от брони
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      {`${objItem.oneDay ? ',' : '?'}`}
                                      <br />{' '}
                                      {`${objItem.oneDay ? 'завтра в ' + objItem.stringStart.slice(-5) + '?' : ''}`}
                                    </p>
                                  ),
                                );
                                setNotifDay('tomorrow')
                                setIndexForAction(index);
                                setConfirmParticipation(true);
                              }}
                            >
                              Подтвердить
                            </button>
                            <button
                              className="btn-S-GreenInactive"
                              onClick={() => {
                                setCancelString(
                                  objItem.objType == 'delivery' ? (
                                    <p>
                                      Вы уверены, что хотите отказаться от
                                      доставки
                                      <br />
                                      м.{' '}
                                      {`${getMetroCorrectName(objItem.nameOrMetro)}`}
                                      ,<br /> сегодня в{' '}
                                      {`${objItem.stringStart.slice(-5)}`}?
                                    </p>
                                  ) : objItem.objType == 'task' ? (
                                    <p>
                                      Вы уверены, что хотите отказаться от
                                      доброго дела
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      ,<br />{' '}
                                      {`${objItem.oneDay ? 'завтра в ' + objItem.stringStart.slice(-5) : objItem.stringStart}`}
                                      ?
                                    </p>
                                  ) : (
                                    <p>
                                      Вы уверены, что хотите отказаться от брони
                                      <br />{' '}
                                      {`${objItem.nameOrMetro.slice(0, 1).toUpperCase() + objItem.nameOrMetro.slice(1)}`}
                                      {`${objItem.oneDay ? ',' : '?'}`}
                                      <br />{' '}
                                      {`${objItem.oneDay ? 'завтра в ' + objItem.stringStart.slice(-5) + '?' : ''}`}
                                    </p>
                                  ),
                                );
                                setNotifDay('tomorrow')
                                setIndexForAction(index);
                                setCancelParticipation(true);
                              }}
                            >
                              Отказаться
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-[50%]">
              <Bread data-testid="bread" className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
              <p className="font-gerbera-h2 text-light-gray-black dark:text-light-gray-1 mt-7 text-center">
                Пока нет планов
                <br />
                требующих вашего внимания
              </p>
            </div>
          )}
        </div>
        {(notifDay == "today" || notifDay == "tomorrow") &&
          <ConfirmModal
          isOpen={confirmParticipation}
          onOpenChange={setConfirmParticipation}
          onConfirm={() => {
            handleConfirmClick(notifDay == "today" ? allMyNotificationsToday[indexForAction] :  allMyNotificationsTomorrow[indexForAction] );
            setConfirmParticipation(false);
          }}
          title={confirmString}
          description=""
          confirmText="Подтвердить"
          cancelText="Закрыть"
        />
        }
       {(notifDay == "today" || notifDay == "tomorrow") &&
        <ConfirmModal
          isOpen={cancelParticipation}
          onOpenChange={setCancelParticipation}
          onConfirm={() => {
            handleCancelClick(notifDay == "today" ? allMyNotificationsToday[indexForAction] :  allMyNotificationsTomorrow[indexForAction]);
            setCancelParticipation(false);
          }}
          title={cancelString}
          description=""
          confirmText="Отказаться"
          cancelText="Закрыть"
        />}
        <ConfirmModal
          isOpen={confirmedSuccess}
          onOpenChange={setConfirmedSuccess}
          onConfirm={() => setConfirmedSuccess(false)}
          title={confirmedSuccessString}
          description=""
          confirmText="Закрыть"
          isSingleButton={true}
        />
        <ConfirmModal
          isOpen={confirmFailed}
          onOpenChange={setConfirmFailed}
          onConfirm={() => setConfirmFailed(false)}
          title={confirmFailedString}
          description=""
          confirmText="Закрыть"
          isSingleButton={true}
        />
        <ConfirmModal
          isOpen={cancelSuccess}
          onOpenChange={setCancelSuccess}
          onConfirm={() => { setCancelSuccess(false); setCancelTaskDeliveryReasonOpenModal(true) }}
          title={cancelSuccessString}
          description=""
          confirmText="Закрыть"
          isSingleButton={true}
        />
        <ConfirmModal
          isOpen={cancelFail}
          onOpenChange={setCancelFail}
          onConfirm={() => setCancelFail(false)}
          title={cancelFailString}
          description=""
          confirmText="Закрыть"
          isSingleButton={true}
        />
      {(cancelTaskId != undefined || cancelDeliveryId != undefined) &&
      <Modal isOpen={cancelTaskDeliveryReasonOpenModal} onOpenChange={()=>{}} >
      <CancelledDeliveryOrTaskFeedback
      onOpenChange={setCancelTaskDeliveryReasonOpenModal}
      onSubmitFidback={setIsCancelledTaskDeliveryFeedbackSubmited}
      delivery={cancelTaskId ? false : true}
      deliveryOrTaskId={cancelTaskId != undefined ? cancelTaskId : cancelDeliveryId!= undefined ? cancelDeliveryId : 0}
      />
      </Modal>}
        <ConfirmModal
      isOpen={isCancelledTaskDeliveryFeedbackSubmited}
      onOpenChange={setIsCancelledTaskDeliveryFeedbackSubmited}
          onConfirm={() => { setIsCancelledTaskDeliveryFeedbackSubmited(false); setCancelTaskId(undefined); setCancelDeliveryId(undefined) }}
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
      </div>
    </Modal>
  );
};

export type { TNotificationInfo };
export default Notifications;
