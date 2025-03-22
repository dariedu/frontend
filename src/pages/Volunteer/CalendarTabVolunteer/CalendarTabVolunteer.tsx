import {useState, useContext, useEffect} from 'react'
import NearestDeliveryVolunteer from "../../../components/NearestDeliveryVolunteer/NearestDeliveryVolunteer";
import { type IDelivery } from '../../../api/apiDeliveries';
import { TokenContext } from '../../../core/TokenContext';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import CancelledDeliveryOrTaskFeedback from '../../../components/DeliveryOrTaskFeedback/CancelledDeliveryOrTaskFeedback';
import { Modal } from '../../../components/ui/Modal/Modal';
import { type ITask } from '../../../api/apiTasks';
import NearestTaskVolunteer from '../../../components/NearestTask/NearestTaskVolunteer';
import { UserContext } from '../../../core/UserContext';
import Bread from './../../../assets/icons/bread.svg?react'
import { getAllMyTasks, getAllMyFeedbacks, getMyDeliveries, cancelTakenDelivery, cancelTakenTask } from './helperFunctions';
import {getListNotConfirmed } from '../../../components/NavigationBar/helperFunctions'


const CalendarTabVolunteer = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());/// дата для календаря
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>(localStorage.getItem(`vol_current_for_calendar_tab`) !== null && localStorage.getItem(`vol_current_for_calendar_tab`) !== undefined ? JSON.parse(localStorage.getItem(`vol_current_for_calendar_tab`) as string) : []) ////доставки записанные на меня
  const [myPast, setMyPast] = useState<IDelivery[]>(localStorage.getItem(`vol_past_for_calendar_tab`) !== null && localStorage.getItem(`vol_past_for_calendar_tab`) !== undefined ? JSON.parse(localStorage.getItem(`vol_past_for_calendar_tab`) as string) : []) //// мои прошедшие доставки

  const [cancelDeliverySuccess, setCancelDeliverySuccess] = useState<boolean>(false) //// доставка успешно отмемена
  const [cancelDeliveryFail, setCancelDeliveryFail] = useState<boolean>(false)////// доставку не удалось отменить, произошла ошибка
  const [cancelDeliverySuccessString, setCancelDeliverySuccessString] = useState<string>(""); ////// если доставка отменена то тут будут данные по отмененной доставке, метро, дата и время
  const [cancelId, setCancelId] = useState<number>();

  const [completedDeliveryFeedbacks, setCompletedDeliveryFeedbacks] = useState<number[]>([]); ////тут все мои отзывы
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] = useState(false); ////// открываем модальное окно, чтобы проинформировать пользоватенля что фидбэк по завершенной заявке отправлен
  const [cancelDeliveryReasonOpenModal, setCancelDeliveryReasonOpenModal] = useState(false);  /// модальное окно для отправки отзыва
  const [isCancelledDeliveryFeedbackSubmited, setIsCancelledDeliveryFeedbackSubmited] = useState(false);

  const [allMyTasks, setAllMyTasks] = useState<ITask[]>(localStorage.getItem(`vol_tasks_for_calendar_tab`) !== null && localStorage.getItem(`vol_tasks_for_calendar_tab`) !== undefined ? JSON.parse(localStorage.getItem(`vol_tasks_for_calendar_tab`) as string) : [])

  const [completedTaskFeedbacks, setCompletedTaskFeedbacks] = useState<number[]>([]) ///все отзывы по таскам
  const [cancelTaskSuccess, setCancelTaskSuccess] = useState(false)  //// таск успешно отмемен
  const [cancelTaskFail, setCancelTaskFail] = useState<boolean>(false)////// доставку не удалось отменить, произошла ошибка
  const [cancelTaskSuccessString, setCancelTaskSuccessString] = useState<string>(""); ////// если доставка отменена то тут будут данные по отмененной доставке, метро, дата и время
  const [cancelTaskReasonOpenModal, setCancelTaskReasonOpenModal] = useState(false);  /// модальное окно для отправки отзыва
  const [cancelTaskId, setCancelTaskId] = useState<number>();
  const [isCancelledTaskFeedbackSubmited, setIsCancelledTaskFeedbackSubmited] = useState(false);
  const [allNotConfirmed, setAllNotConfirmed] = useState<number[]|null>(null);
  // const [allTasksNotConfirmed, setAllTasksNotConfirmed] = useState<number[]|null>(null);

  ///// используем контекст токена
  const { token } = useContext(TokenContext);
  const { currentUser } = useContext(UserContext);
 ////// используем контекст


  useEffect(() => {
    if (token && currentUser?.is_confirmed) {
      getMyDeliveries(token, setMyCurrent, setMyPast)
    }
  }, [cancelDeliverySuccess])

  useEffect(() => {
    if (token && currentUser?.is_confirmed) {
      getAllMyFeedbacks(token, currentUser, setCompletedDeliveryFeedbacks, setCompletedTaskFeedbacks)
    }
  }, [isFeedbackSubmitedModalOpen])

  useEffect(() => {
    if (token && currentUser?.is_confirmed) {
      getAllMyTasks(token, setAllMyTasks)
    }
    }, [cancelTaskSuccess])
  
  useEffect(() => {
    if (token && currentUser?.is_confirmed) {
      getListNotConfirmed(token, setAllNotConfirmed)
    }
      // getTasksListNotConfirmed(token, setAllTasksNotConfirmed)
  }, [])

  // console.log(allMyTasks, "allmytasks")
  return (
    <>
      <div className="mb-4 flex flex-col h-full items-center overflow-x-hidden " >
        {/* <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}
        <div className='flex flex-col h-full mb-20 overflow-auto w-full max-w-[500px]'>
          {myCurrent.length > 0 ?
              (myCurrent.sort((a, b) =>{return +new Date(a.date) - +new Date(b.date)}).map((i) => {
                const currentStatus = i.in_execution == true ? "active" : "nearest";
                return(
                <div key={i.id}>
                    <NearestDeliveryVolunteer delivery={i} allNotConfirmed={allNotConfirmed}  setCancelDeliverySuccessString={setCancelDeliverySuccessString} setCancelId={setCancelId} setCancelDeliverySuccess={setCancelDeliverySuccess} setCancelDeliveryFail={setCancelDeliveryFail} status={currentStatus} cancelFunc={cancelTakenDelivery} setAllNotConfirmed={setAllNotConfirmed} />
                </div>)
              })
            ) : ""
          }
          {allMyTasks && allMyTasks.length > 0 ? (
            allMyTasks.filter(i=>!i.is_completed).sort((a, b)=>{return +new Date(a.start_date) - +new Date(b.start_date)}).map(task => {
               let taskFilter:'nearest' | 'active';
                let date = new Date();
                let taskDate = new Date(task.start_date)
               taskFilter = ((+date - +taskDate) > 0) ? "active" : "nearest";
                return (<div key={task.id}>
                  <NearestTaskVolunteer task={task}   taskFilter={taskFilter} setCancelDeliveryFail={setCancelDeliveryFail} setCancelTaskSuccess={setCancelTaskSuccess} cancelFunc={cancelTakenTask} setCancelTaskSuccessString={setCancelTaskSuccessString} setCancelTaskId={setCancelTaskId}  feedbackSubmited={true} />
                </div>
                )
            })
          ) : ""}
          
                {myPast.length > 0 ? (
            myPast.map((i: IDelivery) => (
              completedDeliveryFeedbacks.length > 0 ? (
                completedDeliveryFeedbacks.includes(i.id) ? (
              <div key={i.id}>
              <NearestDeliveryVolunteer delivery={i} allNotConfirmed={allNotConfirmed} setAllNotConfirmed={setAllNotConfirmed} setCancelDeliverySuccessString={setCancelDeliverySuccessString} setCancelId={setCancelId} setCancelDeliverySuccess={setCancelDeliverySuccess} setCancelDeliveryFail={setCancelDeliveryFail} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={true} />
              </div>
                ) : (
                  <div key={i.id}>
            <NearestDeliveryVolunteer delivery={i} allNotConfirmed={allNotConfirmed} setAllNotConfirmed={setAllNotConfirmed}  setCancelDeliverySuccessString={setCancelDeliverySuccessString} setCancelId={setCancelId} setCancelDeliverySuccess={setCancelDeliverySuccess} setCancelDeliveryFail={setCancelDeliveryFail} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={false} />
            </div>   
              )) : (
               <div key={i.id}>
            <NearestDeliveryVolunteer delivery={i} allNotConfirmed={allNotConfirmed} setAllNotConfirmed={setAllNotConfirmed} setCancelDeliverySuccessString={setCancelDeliverySuccessString} setCancelId={setCancelId} setCancelDeliverySuccess={setCancelDeliverySuccess} setCancelDeliveryFail={setCancelDeliveryFail} status={"completed"} isFeedbackSubmitedModalOpen={isFeedbackSubmitedModalOpen} setIsFeedbackSubmitedModalOpen={setIsFeedbackSubmitedModalOpen} feedbackSubmited={false} />
            </div>)
            ))) : ""
          }
          {allMyTasks && allMyTasks.length > 0 ? (
            allMyTasks.filter(i => i.is_completed).sort((a, b)=>{return +new Date(a.start_date) - +new Date(b.start_date)}).map(task => (
                  completedTaskFeedbacks.includes(task.id) ? (
                <div key={task.id}>
                  <NearestTaskVolunteer task={task}  taskFilter='completed' setCancelDeliveryFail={setCancelDeliveryFail} setCancelTaskSuccess={setCancelTaskSuccess} cancelFunc={cancelTakenTask} setCancelTaskSuccessString={setCancelTaskSuccessString} setCancelTaskId={setCancelTaskId} feedbackSubmited={true}/>
                </div>
                ): (
              <div key={task.id}>
                  <NearestTaskVolunteer task={task}   taskFilter='completed' setCancelDeliveryFail={setCancelDeliveryFail} setCancelTaskSuccess={setCancelTaskSuccess} cancelFunc={cancelTakenTask} setCancelTaskSuccessString={setCancelTaskSuccessString} setCancelTaskId={setCancelTaskId} feedbackSubmited={false}/>
                </div>
                )
              )
          )) : ""}
          {myCurrent.length == 0 && allMyTasks.length == 0 ?
            (
          <div className='flex flex-col h-full mt-[50%] items-center justify-center overflow-y-hidden'>
            <Bread className='fill-[#000000] dark:fill-[#F8F8F8] mb-4 '/>
            <p className=' text-light-gray-black dark:text-light-gray-1 w-64 '>Пока нет запланированных<br/>добрых дел</p>
        </div>
          )
        : ""}
        </div>
      </div>    
      <ConfirmModal
        isOpen={cancelDeliverySuccess}
        onOpenChange={setCancelDeliverySuccess}
        onConfirm={() => { setCancelDeliverySuccess(false);  setCancelDeliveryReasonOpenModal(true) }}
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
        onConfirm={() => { setCancelTaskSuccess(false);  setCancelTaskReasonOpenModal(true)}}
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
      <Modal isOpen={cancelDeliveryReasonOpenModal} onOpenChange={()=>{}} >
      <CancelledDeliveryOrTaskFeedback
      onOpenChange={setCancelDeliveryReasonOpenModal}
      onSubmitFidback={setIsCancelledDeliveryFeedbackSubmited}
      delivery={true}
      deliveryOrTaskId={cancelId}
      />
      </Modal>
      ) : ""}

      {cancelTaskId ? (
      <Modal isOpen={cancelTaskReasonOpenModal} onOpenChange={()=>{}} >
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