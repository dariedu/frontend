import {useState, useContext, useEffect} from 'react'
// import Calendar from "../../../components/Calendar/Calendar";
import NearestDeliveryVolunteer from "../../../components/NearestDelivery/NearestDeliveryVolunteer";
import { getVolunteerDeliveries, postDeliveryCancel, type IDelivery, type IVolunteerDeliveries } from '../../../api/apiDeliveries';
import { TokenContext } from '../../../core/TokenContext';
import { getMonthCorrectEndingName, getMetroCorrectName } from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import { getMyFeedbacks, type TMyFeedback } from '../../../api/feedbackApi';
import CancelledDeliveryOrTaskFeedback from '../../../components/DeliveryOrTaskFeedback/CancelledDeliveryOrTaskFeedback';
import { Modal } from '../../../components/ui/Modal/Modal';
import { getMyTasksNoFilter, postTaskRefuse, type ITask } from '../../../api/apiTasks';
import NearestTaskVolunteer from '../../../components/NearestTask/NearestTaskVolunteer';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react'
import { UserContext } from '../../../core/UserContext';


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

  ///// используем контекст токена
  const { token } = useContext(TokenContext);
  const { currentUser } = useContext(UserContext);
 ////// используем контекст

  async function getMyDeliveries() {
    const current: IDelivery[] = [];
    const past: IDelivery[] = [];
   
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
           result['мои активные доставки'].forEach(i => { current.push(i) });
           result['мои завершенные доставки'].filter(i => {
             let timeDiff = Math.abs(+new Date() - +new Date(i.date));
             let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
             if(diffDays <= 5) return i
           }).forEach(i => { past.push(i) });
  
           current.map(del => {
             if (del.curator.photo && !del.curator.photo.includes('https')) {
               del.curator.photo = del.curator.photo.replace('http', 'https')
             }
           })
           past.map(del => {
            if (del.curator.photo && !del.curator.photo.includes('https')) {
              del.curator.photo = del.curator.photo.replace('http', 'https')
            }
           })
        
           setMyCurrent(current);
           setMyPast(past)
         }
         localStorage.setItem(`vol_current_for_calendar_tab`, JSON.stringify(current))
         localStorage.setItem(`vol_past_for_calendar_tab`, JSON.stringify(current))
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
          let allMySubmitedFeedbacksForCompletedDeliveries: number[] = []
          let allMySubmitedFeedbacksForCompletedTasks: number[] = [];
   
          result.filter(i=>i.user ==currentUser?.id).forEach(i => {
            if (typeof i.delivery == 'number' && i.type == 'completed_delivery') {
              allMySubmitedFeedbacksForCompletedDeliveries.push(i.delivery)
            } else if (typeof i.task == 'number' && i.type == 'completed_task') {
              allMySubmitedFeedbacksForCompletedTasks.push(i.task)
            }
          })
          setCompletedDeliveryFeedbacks(allMySubmitedFeedbacksForCompletedDeliveries)
          setCompletedTaskFeedbacks(allMySubmitedFeedbacksForCompletedTasks)
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
          result.map(task => {
            if (task.curator.photo && !task.curator.photo.includes('https')) {
             task.curator.photo = task.curator.photo.replace('http', 'https')
           }
          })
           let filtered = result.filter(task => {
            let timeDiff = Math.abs(+new Date() - +new Date(task.end_date));
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(diffDays <= 5) return task
          })
          setAllMyTasks(filtered)
          localStorage.setItem(`vol_tasks_for_calendar_tab`, JSON.stringify(filtered))
        }
      }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
  }

  useEffect(() => {
    getMyDeliveries();
  }, [cancelDeliverySuccess])

  useEffect(() => {
    getAllMyFeedbacks()
  }, [isFeedbackSubmitedModalOpen])

    useEffect(() => {
    getAllMyTasks()
  }, [cancelTaskSuccess])


 ////функция чтобы волонтер отменил взятую доставку
async function cancelTakenDelivery(delivery:IDelivery) {
  const id: number = delivery.id;
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, id, delivery);
     if (result) {
      const deliveryDate = new Date(Date.parse(delivery.date) + 180*60000);
       const date = deliveryDate.getUTCDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours();
       const minutes = deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
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
       const taskDate = new Date(Date.parse(task.start_date) + 180* 60000);
       const date = taskDate.getUTCDate();
       const month = getMonthCorrectEndingName(taskDate);
       const hours = taskDate.getUTCHours() < 10 ? '0' + taskDate.getUTCHours() : taskDate.getUTCHours();
       const minutes = taskDate.getUTCMinutes() < 10 ? '0' + taskDate.getUTCMinutes() : taskDate.getUTCMinutes();    
       const finalString = `\"${task.name.slice(0, 1).toLocaleUpperCase()+task.name.slice(1)}\", ${date} ${month}, ${hours}:${minutes}`;
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
      <div className="mb-4 flex flex-col h-full items-center overflow-x-hidden " >
        {/* <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}
        <div className='flex flex-col h-full mb-20 overflow-auto w-full max-w-[500px]'>
          {myCurrent.length > 0 ?
              (myCurrent.sort((a, b) =>{return +new Date(a.date) - +new Date(b.date)}).map((i) => {
                const currentStatus = i.in_execution == true ? "active" : "nearest";
                return(
                <div key={i.id}>
                    <NearestDeliveryVolunteer delivery={i} status={currentStatus} cancelFunc={cancelTakenDelivery}  />
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
                  <NearestTaskVolunteer task={task} taskFilter={taskFilter} cancelFunc={cancelTakenTask} feedbackSubmited={true} />
                </div>
                )
            })
          ) : ""}
          
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
            allMyTasks.filter(i => i.is_completed).sort((a, b)=>{return +new Date(a.start_date) - +new Date(b.start_date)}).map(task => (
                  completedTaskFeedbacks.includes(task.id) ? (
                <div key={task.id}>
                  <NearestTaskVolunteer task={task} taskFilter='completed' cancelFunc={cancelTakenTask} feedbackSubmited={true}/>
                </div>
                ): (
              <div key={task.id}>
                  <NearestTaskVolunteer task={task} taskFilter='completed' cancelFunc={cancelTakenTask} feedbackSubmited={false}/>
                </div>
                )
              )
          )) : ""}
          {myCurrent.length == 0 && allMyTasks.length == 0 ? (
          <div className='flex flex-col h-full mt-[50%] items-center justify-center overflow-y-hidden'>
            <LogoNoTaskYet className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
            <p className=' text-light-gray-black dark:text-light-gray-1 '>Пока нет запланированных<br/>добрых дел</p>
        </div>
        ): ""}
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