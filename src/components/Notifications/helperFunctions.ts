import { ITask } from "../../api/apiTasks"
import { IDelivery } from "../../api/apiDeliveries"
import { IPromotion } from "../../api/apiPromotions"
import { TNotificationInfo } from "./Notifications"
import { getMonthCorrectEndingName, getMetroCorrectName } from "../helperFunctions/helperFunctions"
import { postDeliveryCancel, postDeliveryConfirm } from "../../api/apiDeliveries"
import { postTaskRefuse, postTaskConfirm } from "../../api/apiTasks"
import { postPromotionCancel, postPromotionConfirm} from "../../api/apiPromotions";

// objType: "task" | "delivery" | "promo"
// nameOrMetro: string
// addressOrInfo: string
// stringStart: string
// id: string
// timeString:string

function combineAllNotConfirmed(
  allNotConfirmedToday: IDelivery[],
  allNotConfirmedTomorrow: IDelivery[],
  allTasksNotConfirmedToday: ITask[],
  allTasksNotConfirmedTomorrow: ITask[],
  allPromoNotConfirmedToday:IPromotion[],
  allPromoNotConfirmedTomorrow: IPromotion[],
  setAllMyNotificationsToday: React.Dispatch<React.SetStateAction<TNotificationInfo[]>>,
  setAllMyNotificationsTomorrow: React.Dispatch<React.SetStateAction<TNotificationInfo[]>>
) {

  const allForToday: TNotificationInfo[] = [];
  const allForTomorrow: TNotificationInfo[] = [];
  
  if (allNotConfirmedToday.length > 0) {
    allNotConfirmedToday.forEach(item => {

      const deliveryDate = new Date(Date.parse(item.date) + 180 * 60000);
      const obj: TNotificationInfo = {
        objType: "delivery",
        nameOrMetro: item.location.subway,
        addressOrInfo: item.location.address,
        stringStart: `${deliveryDate.getUTCDate()}
        ${getMonthCorrectEndingName(deliveryDate)} в
        ${deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours()}:${deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes()}`,
        id: item.id,
        idString: `delivrtry${item.id}`,
        timeString: item.date,
        oneDay:true
    };

      allForToday.push(obj)
    })
  }
  
  if (allNotConfirmedTomorrow.length > 0) {
    allNotConfirmedTomorrow.forEach(item => {
      const deliveryDate = new Date(Date.parse(item.date) + 180 * 60000);
      const obj: TNotificationInfo = {
        objType: "delivery",
        nameOrMetro: item.location.subway,
        addressOrInfo: item.location.address,
        stringStart: `${deliveryDate.getUTCDate()}
        ${getMonthCorrectEndingName(deliveryDate)} в
        ${deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours()}:${deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes()}`,
        id: item.id,
        idString: `delivrtry${item.id}`,
        timeString: item.date,
        oneDay:true
    };
      allForTomorrow.push(obj)
    })
  }

  if (allTasksNotConfirmedToday.length > 0) {

    
    allTasksNotConfirmedToday.forEach(task => {

      const taskStartDate = new Date(Date.parse(task.start_date) + 180*60000);
      const startDay = taskStartDate.getUTCDate();
      const startMonth = getMonthCorrectEndingName(taskStartDate);
      
      const hours = taskStartDate ? String(taskStartDate.getUTCHours()).padStart(2, '0') : '--';
      const minutes = taskStartDate ? String(taskStartDate.getUTCMinutes()).padStart(2, '0') : '--';
      
      const taskEndDate = new Date(Date.parse(task.end_date) + 180* 60000);
      const endDay = taskEndDate.getUTCDate();
      const endMonth = getMonthCorrectEndingName(taskEndDate)
      let dateString: string;
      let  taskOneDay = false;
      if (startDay == endDay && startMonth == endMonth) {
        taskOneDay = true;
        dateString = `${startDay} ${getMonthCorrectEndingName(taskEndDate)} в ${hours}:${minutes}`
      } else {
        taskOneDay = false;
         if (startMonth == endMonth) {
            dateString = `${startDay} - ${endDay} ${endMonth}`
         } else {
            dateString = `${startDay} ${startMonth} - ${endDay} ${endMonth}`
         }
      }


      const obj:TNotificationInfo = {
        objType: "task",
        nameOrMetro: task.name,
        addressOrInfo: task.description ? task.description.slice(0, 100)+"..." : task.category ? String(task.category) : '',
        stringStart: dateString,
        id: task.id,
        idString: `task${task.id}`,
        timeString: task.start_date,
        oneDay: taskOneDay
      }
      allForToday.push(obj)
    })
  }
  if (allTasksNotConfirmedTomorrow.length > 0) {
    allTasksNotConfirmedTomorrow.forEach(task => {

      const taskStartDate = new Date(Date.parse(task.start_date) + 180*60000);
      const startDay = taskStartDate.getUTCDate();
      const startMonth = getMonthCorrectEndingName(taskStartDate);
      
      const hours = taskStartDate ? String(taskStartDate.getUTCHours()).padStart(2, '0') : '--';
      const minutes = taskStartDate ? String(taskStartDate.getUTCMinutes()).padStart(2, '0') : '--';
      
      const taskEndDate = new Date(Date.parse(task.end_date) + 180* 60000);
      const endDay = taskEndDate.getUTCDate();
      const endMonth = getMonthCorrectEndingName(taskEndDate)
      let dateString: string;
      let  taskOneDay = false;
      if (startDay == endDay && startMonth == endMonth) {
        taskOneDay = true;
        dateString = `${startDay} ${getMonthCorrectEndingName(taskEndDate)} в ${hours}:${minutes}`
      } else {
        taskOneDay = false;
         if (startMonth == endMonth) {
            dateString = `${startDay} - ${endDay} ${endMonth}`
         } else {
            dateString = `${startDay} ${startMonth} - ${endDay} ${endMonth}`
         }
      }


      const obj:TNotificationInfo = {
        objType: "task",
        nameOrMetro: task.name,
        addressOrInfo: task.description ?  task.description.slice(0, 100)+"..." : task.category ? String(task.category) : '',
        stringStart: dateString,
        id: task.id,
        idString: `task${task.id}`,
        timeString: task.start_date,
        oneDay: taskOneDay
      }
      
      allForTomorrow.push(obj)
    })
  }
  if (allPromoNotConfirmedToday.length > 0) {
    allPromoNotConfirmedToday.forEach(promotion => {

      const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180*60000);
      const obj:TNotificationInfo = {
        objType: "promo",
        nameOrMetro: promotion.name,
        addressOrInfo: promotion.address ? promotion.address: promotion.category ? String(promotion.category) : '',
        stringStart: promotion.is_permanent
          ? 'В любое время'
            : `${eventDate.getUTCDate()}
        ${getMonthCorrectEndingName(eventDate)} в
        ${eventDate.getUTCHours() < 10 ? '0' + eventDate.getUTCHours() : eventDate.getUTCHours()}:${eventDate.getUTCMinutes() < 10 ? '0' + eventDate.getUTCMinutes() : eventDate.getUTCMinutes()}`,
        id: promotion.id,
        idString: `promo${promotion.id}`,
        timeString: promotion.start_date,
        oneDay: promotion.is_permanent ? false : true
      }
      allForToday.push(obj)
    })
  }
  if (allPromoNotConfirmedTomorrow.length > 0) {
    allPromoNotConfirmedTomorrow.forEach(promotion => {
      const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180*60000);
      const obj:TNotificationInfo = {
        objType: "promo",
        nameOrMetro: promotion.name,
        addressOrInfo: promotion.address ? promotion.address: promotion.category ? String(promotion.category) : '',
        stringStart: promotion.is_permanent
          ? 'В любое время'
            : `${eventDate.getUTCDate()}
        ${getMonthCorrectEndingName(eventDate)} в
        ${eventDate.getUTCHours() < 10 ? '0' + eventDate.getUTCHours() : eventDate.getUTCHours()}:${eventDate.getUTCMinutes() < 10 ? '0' + eventDate.getUTCMinutes() : eventDate.getUTCMinutes()}`,
        id: promotion.id,
        idString: `promo${promotion.id}`,
        timeString: promotion.start_date,
        oneDay: promotion.is_permanent ? false : true
      }
      allForTomorrow.push(obj)
    })
  } 
  setAllMyNotificationsToday(allForToday)
  setAllMyNotificationsTomorrow(allForTomorrow)
}


 ////функция чтобы волонтер отменил взятую доставку
 async function cancelTakenDelivery(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:IDelivery[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<IDelivery[]>>, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, item.id);
     if (result) {
       let filtered:IDelivery[] = allNotConfirmed.filter(i => {return i.id != item.id })
       setAllNotConfirmed(filtered)
       setCancelSuccessString(`Участие в доставке м. ${getMetroCorrectName(item.nameOrMetro)}, ${item.stringStart} успешно отменено`);  
       setCancelSuccess(true)
       setNotifDay(null)
  }
}
} catch (err) {
  setCancelFail(true);
  setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
  console.log(err, "Notifications cancelTakenDelivery has failed")
  setNotifDay(null)
}
  }

   ////функция чтобы волонтер отменил взятое доброе дело
async function cancelTakenTask(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:ITask[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<ITask[]>>, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
try {
   if (token) {
     let result: ITask = await postTaskRefuse(item.id, token);
     if (result) {
      let filtered:ITask[] = allNotConfirmed.filter(i => {return i.id != item.id })
      setAllNotConfirmed(filtered)
      setCancelSuccessString(`Участие в добром деле ${item.stringStart} успешно отменено`);  
       setCancelSuccess(true)
       setNotifDay(null)
  }
}
} catch (err) {
  setCancelFail(true)
  setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
  console.log(err, "Notifications cancelTakenTask has failed")
  setNotifDay(null)
}
}
  
  async function cancelPromotion(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:IPromotion[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<IPromotion[]>>, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
    try {
      if (token) {
        const response = await postPromotionCancel(item.id, token);
        if (response) {
          let filtered:IPromotion[] = allNotConfirmed.filter(i => {return i.id != item.id })
          setAllNotConfirmed(filtered)
          setCancelSuccess(true)
          setCancelSuccessString(`Ваша бронь ${item.nameOrMetro} успешно отменена`)
          setNotifDay(null)
        }

      }
    } catch (err) {
      setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
      console.log(err, "Notifications cancelPromotion has failed")
      setCancelFail(true)
      setCancelSuccess(false)
      setNotifDay(null)
    } 
}
  
////функция чтобы волонтер отменил взятую доставку
async function confirmDelivery(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:IDelivery[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<IDelivery[]>>, token:string, setConfirmedSuccess:React.Dispatch<React.SetStateAction<boolean>>, setConfirmedSuccessString:React.Dispatch<React.SetStateAction<string>>, setConfirmFailed:React.Dispatch<React.SetStateAction<boolean>>, setConfirmFailedString:React.Dispatch<React.SetStateAction<string>>) {
  try {
     if (token) {
       let result: IDelivery = await postDeliveryConfirm(token, item.id);
       if (result) {
        let filtered:IDelivery[] = allNotConfirmed.filter(i => {return i.id != item.id })
        setAllNotConfirmed(filtered)
        setConfirmedSuccessString(`Участие в доставке м. ${getMetroCorrectName(item.nameOrMetro)}, ${item.stringStart} успешно подтверждено`);  
         setConfirmedSuccess(true)
         setNotifDay(null)
    }
  }
  } catch (err) {
    setConfirmFailed(true);
    setConfirmFailedString("Упс, что-то пошло не так, попробуйте позже.")
    console.log(err, "Notifications confirmDelivery has failed")
    setNotifDay(null)
  }
    }
  
     ////функция чтобы волонтер отменил взятое доброе дело
  async function confirmTask(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:ITask[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<ITask[]>>, token:string, setConfirmedSuccess:React.Dispatch<React.SetStateAction<boolean>>, setConfirmedSuccessString:React.Dispatch<React.SetStateAction<string>>, setConfirmFailed:React.Dispatch<React.SetStateAction<boolean>>, setConfirmFailedString:React.Dispatch<React.SetStateAction<string>>) {
  try {
    if (token) {
     
       let result: ITask = await postTaskConfirm(item.id, token);
      if (result) {
        let filtered:ITask[] = allNotConfirmed.filter(i => {return i.id != item.id })
        setAllNotConfirmed(filtered)
        setConfirmedSuccessString(`Участие в добром деле ${item.stringStart} успешно подтверждено`);  
        setConfirmedSuccess(true)
        setNotifDay(null)
    }
  }
  } catch (err) {
    setConfirmFailed(true)
    setConfirmFailedString("Упс, что-то пошло не так, попробуйте позже.")
    console.log(err, "Notifications  confirmTask has failed")
    setNotifDay(null)
  }
  }

    async function confirmPromotion(item:TNotificationInfo, setNotifDay:React.Dispatch<React.SetStateAction<'today'|"tomorrow"|null>>, allNotConfirmed:IPromotion[], setAllNotConfirmed:React.Dispatch<React.SetStateAction<IPromotion[]>>, token:string, setConfirmedSuccess:React.Dispatch<React.SetStateAction<boolean>>, setConfirmedSuccessString:React.Dispatch<React.SetStateAction<string>>, setConfirmFailed:React.Dispatch<React.SetStateAction<boolean>>, setConfirmFailedString:React.Dispatch<React.SetStateAction<string>>) {
      try {
        if (token) {
          const response = await postPromotionConfirm(item.id, token);
          if (response) {
            let filtered:IPromotion[] = allNotConfirmed.filter(i => {return i.id != item.id })
            setAllNotConfirmed(filtered)
            setConfirmedSuccessString(`Ваша бронь ${item.nameOrMetro} успешно подтверждена`) }
          setConfirmedSuccess(true)
          setNotifDay(null)
            
        }
      } catch (err) {
        setConfirmFailedString("Упс, что-то пошло не так, попробуйте позже.")
        console.log(err, "Notifications confirmPromotion has failed")
        setConfirmFailed(true)
        setNotifDay(null)
      } 
    }

export {combineAllNotConfirmed, cancelTakenDelivery, cancelTakenTask, cancelPromotion, confirmDelivery, confirmTask, confirmPromotion }