import {useState, useContext, useEffect} from 'react'
import Calendar from "../../../components/Calendar/Calendar";
import NearestDeliveryVolunteer from "../../../components/NearestDelivery/NearestDeliveryVolunteer";
import { getVolunteerDeliveries, postDeliveryCancel, type IDelivery, type IVolunteerDeliveries } from '../../../api/apiDeliveries';
import { UserContext } from '../../../core/UserContext';
///import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import { getMonthCorrectEndingName, getMetroCorrectName } from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import { getMyFeedbacks, type TMyFeedback } from '../../../api/feedbackApi';
import CancelledDeliveryOrTaskFeedback from '../../../components/DeliveryOrTaskFeedback/CancelledDeliveryOrTaskFeedback';
import { Modal } from '../../../components/ui/Modal/Modal';
import { getMyTasksNoFilter, postTaskRefuse, type ITask } from '../../../api/apiTasks';
import NearestTaskVolunteer from '../../../components/NearestTask/NearestTaskVolunteer';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react'

const CalendarTabVolunteer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());/// дата для календаря
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]) ////доставки записанные на меня
  const [myPast, setMyPast] = useState<IDelivery[]>([]) //// мои прошедшие доставки

  const [cancelDeliverySuccess, setCancelDeliverySuccess] = useState<boolean>(false) //// доставка успешно отмемена
  const [cancelDeliveryFail, setCancelDeliveryFail]= useState<boolean>(false)////// доставку не удалось отменить, произошла ошибка
  const [cancelDeliverySuccessString, setCancelDeliverySuccessString] = useState<string>(""); ////// если доставка отменена то тут будут данные по отмененной доставке, метро, дата и время
  const [cancelId, setCancelId] = useState<number>();

  const [completedDeliveryFeedbacks, setCompletedDeliveryFeedbacks] = useState<number[]>([]); ////тут все мои отзывы
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =  useState(false); ////// открываем модальное окно, чтобы проинформировать пользоватенля что фидбэк по завершенной заявке отправлен
  const [cancelDeliveryReasonOpenModal, setCancelDeliveryReasonOpenModal] = useState(false);  /// модальное окно для отправки отзыва
  const [isCancelledDeliveryFeedbackSubmited, setIsCancelledDeliveryFeedbackSubmited] =  useState(false);

  const [allMyTasks, setAllMyTasks] = useState<ITask[]>([])

  const [cancelTaskSuccess, setCancelTaskSuccess] = useState(false)  //// таск успешно отмемен
  const [cancelTaskFail, setCancelTaskFail]= useState<boolean>(false)////// доставку не удалось отменить, произошла ошибка
  const [cancelTaskSuccessString, setCancelTaskSuccessString] = useState<string>(""); ////// если доставка отменена то тут будут данные по отмененной доставке, метро, дата и время
  const [cancelTaskReasonOpenModal, setCancelTaskReasonOpenModal] = useState(false);  /// модальное окно для отправки отзыва
  const [cancelTaskId, setCancelTaskId] = useState<number>();
  const [isCancelledTaskFeedbackSubmited, setIsCancelledTaskFeedbackSubmited] =  useState(false);

  ////// используем контекст юзера, чтобы вывести количество доступных баллов
   const userValue = useContext(UserContext);
   const token = userValue.token;
  ////// используем контекст

  async function getMyDeliveries() {
    const current: IDelivery[] = [];
    const past: IDelivery[] = [];
   
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
           result['мои активные доставки'].forEach(i => { current.push(i)});
           result['мои завершенные доставки'].forEach(i => { past.push(i)});
           //result['свободные доставки'].forEach(i => { avaliable.push(i)});     
           setMyCurrent(current);
           setMyPast(past)}
    }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
  }
  
  async function getAllMyFeedbacks() {
    if (token) {
      try {
        let result:TMyFeedback[] = await getMyFeedbacks(token);
        if (result) {
          let allMySubmitedFeedbacksForCompletedDeliveries:number[] = []
          result.forEach(i => {
            if (typeof i.delivery == 'number' && i.type == 'completed_delivery') {
              allMySubmitedFeedbacksForCompletedDeliveries.push(i.delivery)
            }
          })
          setCompletedDeliveryFeedbacks(allMySubmitedFeedbacksForCompletedDeliveries)
        }
      } catch (err) {
        console.log("getAllMyFeedbacks volunteer tab has failed")
    }
  }
  }

  async function getAllMyTasks() {
    try {
      if (token) {
        let result: ITask[] = await getMyTasksNoFilter(token);
        if (result) {
          setAllMyTasks(result)
        }
      }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
  }

  useEffect(() => {
    getMyDeliveries();
  }, [token, cancelDeliverySuccess])

  useEffect(() => {
    getAllMyFeedbacks()
  }, [isFeedbackSubmitedModalOpen])

    useEffect(() => {
    getAllMyTasks()
  }, [token, cancelTaskSuccess])


 ////функция чтобы волонтер отменил взятую доставку
async function cancelTakenDelivery(delivery:IDelivery) {
  const id: number = delivery.id;
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, id, delivery);
     if (result) {
       const deliveryDate = new Date(delivery.date);
       const date = deliveryDate.getDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours();
       const minutes = deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
       setCancelDeliveryReasonOpenModal(true)/// открываем модалку для отзыва о причине отмены
       setCancelDeliverySuccessString(finalString);  
       setCancelId(id)
       setCancelDeliverySuccess(true)
  }
}
} catch (err) {
  setCancelDeliveryFail(true)
  console.log(err, "CalendarTabVolunteer cancelTakenDelivery has failed")
}
  }

   ////функция чтобы волонтер отменил взятое доброе дело
async function cancelTakenTask(task:ITask) {
  const id: number = task.id;
try {
   if (token) {
     let result: ITask = await postTaskRefuse(id, token);
     if (result) {
       const taskDate = new Date(task.start_date);
       const date = taskDate.getDate();
       const month = getMonthCorrectEndingName(taskDate);
       const hours = taskDate.getHours() < 10 ? '0' + taskDate.getHours() : taskDate.getHours();
       const minutes = taskDate.getMinutes() < 10 ? '0' + taskDate.getMinutes() : taskDate.getMinutes();    
       const finalString = `\"${task.name.slice(0, 1).toLocaleUpperCase()+task.name.slice(1)}\", ${date} ${month}, ${hours}:${minutes}`;
       setCancelTaskReasonOpenModal(true)/// открываем модалку для отзыва о причине отмены
       setCancelTaskSuccessString(finalString);  
       setCancelTaskId(id)
       setCancelTaskSuccess(true)
  }
}
} catch (err) {
  setCancelDeliveryFail(true)
  console.log(err, "CalendarTabVolunteer cancelTakenDelivery has failed")
}
  }
  
  
  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-center overflow-x-hidden" >
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        {myCurrent.length == 0 && myPast.length == 0 ? (
          <div className='flex flex-col h-[350px] items-center justify-center overflow-y-hidden'>
            <LogoNoTaskYet className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
            <p className='font-gerbera-h2 text-light-gray-black dark:text-light-gray-1 mt-7'>Пока нет запланированных<br/>добрых дел</p>
        </div>
        ): ""}
        <div className='flex flex-col h-full mb-20 overflow-auto'>
          {myCurrent.length > 0 ?
              (myCurrent.map((i) => {
                const currentStatus = i.in_execution == true ? "active" : "nearest";
                return(
                <div key={i.id}>
                    <NearestDeliveryVolunteer delivery={i} status={currentStatus} cancelFunc={cancelTakenDelivery}  />
                </div>)
              })
            ) : ""
          }
          {myPast.length > 0 ? (
            myPast.map((i: IDelivery) => (
              completedDeliveryFeedbacks.length > 0 ? (
                completedDeliveryFeedbacks.includes(i.id) ? (
              <div key={i.id}>
              <NearestDeliveryVolunteer delivery={i} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={true} />
              </div>
                ) : (
                  <div key={i.id}>
            <NearestDeliveryVolunteer delivery={i} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={false} />
            </div>   
              )) : (
               <div key={i.id}>
            <NearestDeliveryVolunteer delivery={i} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={false} />
            </div>)
            ))) : ""
          }
          {allMyTasks && allMyTasks.length > 0 ? (
            allMyTasks.map(task => {
              let taskFilter:'nearest' | 'active' | 'completed';
              if (task.is_completed) {
                taskFilter = 'completed';
                return(<div key={task.id}>
                  <NearestTaskVolunteer task={task} taskFilter={taskFilter} cancelFunc={cancelTakenTask} />
                </div>)
              }
              let date = new Date();
              let taskDate = new Date(task.start_date)
              taskFilter = ((+date - +taskDate) > 0)? "active": "nearest";
              return(<div key={task.id}>
                <NearestTaskVolunteer task={task} taskFilter={taskFilter} cancelFunc={cancelTakenTask} />
              </div>)
            })
          ): "" }
        </div>
      </div>    
      <ConfirmModal
        isOpen={cancelDeliverySuccess}
        onOpenChange={setCancelDeliverySuccess}
        onConfirm={() => setCancelDeliverySuccess(false)}
        title={`Участие в доставке ${cancelDeliverySuccessString} отменено`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
        <ConfirmModal
        isOpen={cancelDeliveryFail}
        onOpenChange={setCancelDeliveryFail}
        onConfirm={() => setCancelDeliveryFail(false)}
        title={`Упс, что-то пошло не так, попробуйте позже`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
       <ConfirmModal
        isOpen={cancelTaskSuccess}
        onOpenChange={setCancelTaskSuccess}
        onConfirm={() => setCancelTaskSuccess(false)}
        title={`Участие в добром деле ${cancelTaskSuccessString} успешно отменено`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
        <ConfirmModal
        isOpen={cancelTaskFail}
        onOpenChange={setCancelTaskFail}
        onConfirm={() => setCancelTaskFail(false)}
        title={`Упс, что-то пошло не так, попробуйте позже`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      {cancelId ? (
      <Modal isOpen={cancelDeliveryReasonOpenModal} onOpenChange={setCancelDeliveryReasonOpenModal} >
      <CancelledDeliveryOrTaskFeedback
      onOpenChange={setCancelDeliveryReasonOpenModal}
      onSubmitFidback={setIsCancelledDeliveryFeedbackSubmited}
      delivery={true}
      deliveryOrTaskId={cancelId}
      />
      </Modal>
      ) : ""}

      {cancelTaskId ? (
      <Modal isOpen={cancelTaskReasonOpenModal} onOpenChange={setCancelTaskReasonOpenModal} >
      <CancelledDeliveryOrTaskFeedback
      onOpenChange={setCancelTaskReasonOpenModal}
      onSubmitFidback={setIsCancelledTaskFeedbackSubmited}
      delivery={false}
      deliveryOrTaskId={cancelTaskId}
      />
      </Modal>
      ) : ""}

      <ConfirmModal
      isOpen={isCancelledDeliveryFeedbackSubmited}
      onOpenChange={setIsCancelledDeliveryFeedbackSubmited}
      onConfirm={() => setIsCancelledDeliveryFeedbackSubmited(false)}
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

      <ConfirmModal
      isOpen={isCancelledTaskFeedbackSubmited}
      onOpenChange={setIsCancelledTaskFeedbackSubmited}
      onConfirm={() => setIsCancelledTaskFeedbackSubmited(false)}
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
      
    </>
  )
}

export default CalendarTabVolunteer