import { ITask } from "../../api/apiTasks"
import { IDelivery } from "../../api/apiDeliveries"
import { IPromotion } from "../../api/apiPromotions"
import { TNotificationInfo } from "./Notifications"
import { getMonthCorrectEndingName } from "../helperFunctions/helperFunctions"
import { postDeliveryCancel } from "../../api/apiDeliveries"
import { postTaskRefuse } from "../../api/apiTasks"
import { postPromotionCancel } from "../../api/apiPromotions";

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
        timeString: item.date
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
        timeString: item.date
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
       if (startDay == endDay && startMonth == endMonth) {
        dateString = `${startDay} ${getMonthCorrectEndingName(taskEndDate)} в ${hours}:${minutes}`
       } else {
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
        timeString:task.start_date
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
       if (startDay == endDay && startMonth == endMonth) {
        dateString = `${startDay} ${getMonthCorrectEndingName(taskEndDate)} в ${hours}:${minutes}`
       } else {
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
        timeString:task.start_date
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
        timeString:promotion.start_date
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
        timeString:promotion.start_date
      }
      allForTomorrow.push(obj)
    })
  } 
  setAllMyNotificationsToday(allForToday)
  setAllMyNotificationsTomorrow(allForTomorrow)
}




 ////функция чтобы волонтер отменил взятую доставку
 async function cancelTakenDelivery(item:TNotificationInfo, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, item.id);
     if (result) {
       setCancelSuccessString(`Участие в доставке м. ${item.nameOrMetro}, ${item.stringStart} успешно отменено`);  
       setCancelSuccess(true)
  }
}
} catch (err) {
  setCancelFail(true);
  setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
  console.log(err, "CalendarTabVolunteer cancelTakenDelivery has failed")
}
  }

   ////функция чтобы волонтер отменил взятое доброе дело
async function cancelTakenTask(item:TNotificationInfo, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
  const id: number = item.id;
try {
   if (token) {
     let result: ITask = await postTaskRefuse(id, token);
     if (result) {
      setCancelSuccessString(`Участие в добром деле ${item.stringStart} успешно отменено`);  
       setCancelSuccess(true)
  }
}
} catch (err) {
  setCancelFail(true)
  setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
  console.log(err, "CalendarTabVolunteer cancelTakenTask has failed")
}
}
  
  async function cancelPromotion(item:TNotificationInfo, token:string, setCancelSuccess:React.Dispatch<React.SetStateAction<boolean>>, setCancelSuccessString:React.Dispatch<React.SetStateAction<string>>, setCancelFail:React.Dispatch<React.SetStateAction<boolean>>, setCancelFailString:React.Dispatch<React.SetStateAction<string>>) {
    try {
      if (token) {
        const response = await postPromotionCancel(item.id, token);
        if (response) {
          setCancelSuccess(true)
          setCancelSuccessString(`Ваша бронь ${item.nameOrMetro} успешно отменена`) }
      }
    } catch (err) {
      setCancelFailString("Упс, что-то пошло не так, попробуйте позже.")
      setCancelFail(true)
      setCancelSuccess(false)
    } 
  }

export {combineAllNotConfirmed, cancelTakenDelivery, cancelTakenTask, cancelPromotion }