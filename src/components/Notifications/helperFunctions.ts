import { ITask } from "../../api/apiTasks"
import { IDelivery } from "../../api/apiDeliveries"
import { IPromotion } from "../../api/apiPromotions"
import { TNotificationInfo } from "./Notifications"
import { getMonthCorrectEndingName } from "../helperFunctions/helperFunctions"

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
      const obj:TNotificationInfo = {
        objType: "delivery",
        nameOrMetro: item.location.subway,
        addressOrInfo: item.location.address,
        stringStart: `${new Date(item.date).getHours()} : ${new Date(item.date).getMinutes()}`,
        id: `delivrtry${item.id}`,
        timeString:item.date
      }
      allForToday.push(obj)
    })
  }
  
  if (allNotConfirmedTomorrow.length > 0) {
    allNotConfirmedTomorrow.forEach(item => {
      const obj:TNotificationInfo = {
        objType: "delivery",
        nameOrMetro: item.location.subway,
        addressOrInfo: item.location.address,
        stringStart: `${new Date(item.date).getHours()} : ${new Date(item.date).getMinutes()}`,
        id: `delivrtry${item.id}`,
        timeString:item.date
      }
      allForTomorrow.push(obj)
    })
  }
  if (allTasksNotConfirmedToday.length > 0) {
    allTasksNotConfirmedToday.forEach(item => {
      const obj:TNotificationInfo = {
        objType: "task",
        nameOrMetro: item.name,
        addressOrInfo: item.description ? item.description.slice(0, 20) : item.category ? String(item.category) : '',
        stringStart: `${new Date(item.start_date).getDate()} ${ getMonthCorrectEndingName(new Date(item.start_date)), new Date(item.start_date).getHours()} : ${new Date(item.start_date).getMinutes()}`,
        id: `task${item.id}`,
        timeString:item.start_date
      }
      allForToday.push(obj)
    })
  }
  if (allTasksNotConfirmedTomorrow.length > 0) {
    allTasksNotConfirmedTomorrow.forEach(item => {
      const obj:TNotificationInfo = {
        objType: "task",
        nameOrMetro: item.name,
        addressOrInfo: item.description ? item.description.slice(0, 20) : item.category ? String(item.category) : '',
        stringStart: `${new Date(item.start_date).getDate()} ${ getMonthCorrectEndingName(new Date(item.start_date)), new Date(item.start_date).getHours()} : ${new Date(item.start_date).getMinutes()}`,
        id: `task${item.id}`,
        timeString:item.start_date
      }
      allForTomorrow.push(obj)
    })
  }
  if (allPromoNotConfirmedToday.length > 0) {
    allPromoNotConfirmedToday.forEach(item => {
      const obj:TNotificationInfo = {
        objType: "promo",
        nameOrMetro: item.name,
        addressOrInfo: item.address ? item.address: item.category ? String(item.category) : '',
        stringStart: item.is_permanent ? `Воспользоваться можно в любое время с момента подтверждения` : `${new Date(item.start_date).getDate()} ${ getMonthCorrectEndingName(new Date(item.start_date)), new Date(item.start_date).getHours()} : ${new Date(item.start_date).getMinutes()}`,
        id: `promo${item.id}`,
        timeString:item.start_date
      }
      allForToday.push(obj)
    })
  }
  if (allPromoNotConfirmedTomorrow.length > 0) {
    allPromoNotConfirmedTomorrow.forEach(item => {
      const obj:TNotificationInfo = {
        objType: "promo",
        nameOrMetro: item.name,
        addressOrInfo: item.address ? item.address: item.category ? String(item.category) : '',
        stringStart: item.is_permanent ? `Воспользоваться можно в любое время с момента подтверждения` : `${new Date(item.start_date).getDate()} ${ getMonthCorrectEndingName(new Date(item.start_date)), new Date(item.start_date).getHours()} : ${new Date(item.start_date).getMinutes()}`,
        id: `promo${item.id}`,
        timeString:item.start_date
      }
      allForTomorrow.push(obj)
    })
  } 
  setAllMyNotificationsToday(allForToday)
  setAllMyNotificationsTomorrow(allForTomorrow)
}

export {combineAllNotConfirmed }