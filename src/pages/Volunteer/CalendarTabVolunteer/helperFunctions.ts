
import { ITask, getMyTasksNoFilter, postTaskRefuse} from "../../../api/apiTasks";
import { IDelivery, IVolunteerDeliveries, getVolunteerDeliveries, postDeliveryCancel, postDeliveryConfirm } from "../../../api/apiDeliveries";
import { TMyFeedback, getMyFeedbacks } from "../../../api/feedbackApi";
import { IUser } from "../../../core/types";
import { getMonthCorrectEndingName, getMetroCorrectName } from '../../../components/helperFunctions/helperFunctions';

async function getMyDeliveries(token:string|null, setMyCurrent:React.Dispatch<React.SetStateAction<IDelivery[]>>, setMyPast:React.Dispatch<React.SetStateAction<IDelivery[]>>) {
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
       localStorage.setItem(`vol_past_for_calendar_tab`, JSON.stringify(past))
  }
  } catch (err) {
    console.log(err, "CalendarTabVolunteer getMyDeliveries has failed")
  }
}


async function getAllMyFeedbacks(token:string|null,currentUser:IUser|null, setCompletedDeliveryFeedbacks:React.Dispatch<React.SetStateAction<number[]>>, setCompletedTaskFeedbacks:React.Dispatch<React.SetStateAction<number[]>>) {
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
      console.log("CalendarTabVolunteer getAllMyFeedbacks has failed")
  }
}
}


async function getAllMyTasks(token:string|null, setAllMyTasks:React.Dispatch<React.SetStateAction<ITask[]>> ) {
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
    console.log(err, "CalendarTabVolunteer getMyTasks fail")
  }
}


////функция чтобы волонтер отменил взятую доставку
async function cancelTakenDelivery(delivery:IDelivery, token: string | null, setCancelDeliverySuccessString: React.Dispatch<React.SetStateAction<string>>,setCancelId: React.Dispatch<React.SetStateAction<number|undefined>>, setCancelDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelDeliveryFail:React.Dispatch<React.SetStateAction<boolean>> ) {
  const id: number = delivery.id;
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, id);
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


//   ////функция чтобы волонтер подтвердил взятую доставку
async function confirmDelivery(delivery:IDelivery, token:string|null, setConfirmedSuccess:React.Dispatch<React.SetStateAction<boolean>>, setConfirmedSuccessString:React.Dispatch<React.SetStateAction<string>>, setConfirmFailed:React.Dispatch<React.SetStateAction<boolean>>, setConfirmFailedString:React.Dispatch<React.SetStateAction<string>>) {
  try {
     if (token) {
       let result: IDelivery = await postDeliveryConfirm(token, delivery.id);
       if (result) {
       const deliveryDate = new Date(Date.parse(delivery.date) + 180*60000);
       const date = deliveryDate.getUTCDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours();
       const minutes = deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
       setConfirmedSuccessString(finalString);  
       setConfirmedSuccess(true)
       }
    }
  } catch (err) {
    setConfirmFailed(true);
    setConfirmFailedString("Упс, что-то пошло не так, попробуйте позже.")
    console.log(err, "NearestDeliveryVolunteer confirmDelivery has failed")

  }
    }
  

  
////функция чтобы волонтер отменил взятое доброе дело
async function cancelTakenTask(task: ITask, token: string | null, setCancelTaskId: React.Dispatch<React.SetStateAction<number|undefined>>, setCancelTaskSuccessString: React.Dispatch<React.SetStateAction<string>>, setCancelTaskSuccess: React.Dispatch<React.SetStateAction<boolean>>, setCancelDeliveryFail: React.Dispatch<React.SetStateAction<boolean>> ) {
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
  console.log(err, "CalendarTabVolunteer cancelTakenTask has failed")
}
}
  


export {getMyDeliveries, getAllMyFeedbacks, getAllMyTasks, cancelTakenDelivery, cancelTakenTask, confirmDelivery}