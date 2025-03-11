import { getVolunteerDeliveries, getDeliveryListNotConfirmed, type IDelivery, type IVolunteerDeliveries, type TNotConfirmedDeliveries } from '../../api/apiDeliveries';
import { getMyTasks, getTaskListNotConfirmed, type ITask, type TTasksNotConfirmed } from '../../api/apiTasks';
import {getPromotionNotConfirmed,  getMyPromotions, IPromotion, TPromoNotConfirm} from '../../api/apiPromotions'


// const eventDate: Date = new Date(Date.parse(promotion.start_date) + 180*60000);
// eventDate.getUTCHours()

  function checkHaveNotification(allNotConfirmedToday: IDelivery[], allNotConfirmedTomorrow: IDelivery[],
    allTasksNotConfirmedToday:ITask[], allTasksNotConfirmedTomorrow:ITask[], allPromoNotConfirmedToday:IPromotion[], allPromoNotConfirmedTomorrow:IPromotion[], setHaveNotifications:React.Dispatch<React.SetStateAction<boolean>>) {
    if (allNotConfirmedToday.length > 0 || allNotConfirmedTomorrow.length > 0
      || allTasksNotConfirmedToday.length > 0 || allTasksNotConfirmedTomorrow.length > 0 ||
      allPromoNotConfirmedToday.length > 0 || allPromoNotConfirmedTomorrow.length > 0
    ) {
      setHaveNotifications(true)
    } else {
      setHaveNotifications(false)
    }
  }
 
//// берем все доставки волонтера, ищем те, которые еще не подтверждены,
// сортируем их на сегодня и завтра для уведомлений по подтверждению или отказу от доставки
async function getMyDeliveries(
  token: string,
  allNotConfirmed: number[]|null, 
  setAllNotConfirmedToday: React.Dispatch<React.SetStateAction<IDelivery[]>>,
  setAllNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<IDelivery[]>>,
) {
  const current: IDelivery[] = [];
  try {
    if (token) {
       
       let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
      if (result) {
        const now = new Date()
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const day = now.getUTCDate();
        const hour = now.getUTCHours();
        const min = now.getUTCMinutes();

        const todayGrinvich = new Date(year, month, day, hour, min);
        const todayMoscow = new Date(Date.parse(todayGrinvich.toUTCString()) + 180 * 60000);
        // console.log(todayGrinvich, "todayGrinvich")
        // console.log(todayMoscow , "todayMoscow")

         result['мои активные доставки'].forEach(i => { current.push(i) });
        const filtered = current.filter(del => {
          if (allNotConfirmed) {
               return allNotConfirmed.includes(del.id)
           }
       
         })
           
         const filteredToday = filtered.filter(del => {
           const deliveryDate = new Date(Date.parse(del.date) + 180 * 60000);
           const yearD = deliveryDate.getUTCFullYear();
           const monthD = deliveryDate.getUTCMonth();
           const dayD = deliveryDate.getUTCDate();
           const hourD = deliveryDate.getUTCHours();
           const minD = deliveryDate.getUTCMinutes();

          //  console.log(deliveryDate, "deliveryDate grinvich", new Date(yearD, monthD, dayD, hourD, minD), "deliveryDate Moscow time")
           const midnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 23, 59);
          return new Date(yearD, monthD, dayD, hourD, minD) >= todayMoscow && new Date(yearD, monthD, dayD, hourD, minD) <= midnight
         })
        // console.log(filteredToday, "filteredToday")
         setAllNotConfirmedToday(filteredToday)


        if (todayMoscow >= new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 18, 0)) {
          const filteredTomorrow= filtered.filter(del => {
            const deliveryDate = new Date(Date.parse(del.date) + 180 * 60000);
            const yearD = deliveryDate.getUTCFullYear();
            const monthD = deliveryDate.getUTCMonth();
            const dayD = deliveryDate.getUTCDate();
            const hourD = deliveryDate.getUTCHours();
            const minD = deliveryDate.getUTCMinutes();
          const tomorrow = new Date(
            todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 0, 0)
            const tomorrowMidnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 23, 59)
           return new Date(yearD, monthD, dayD, hourD, minD) >= tomorrow && new Date(yearD, monthD, dayD, hourD, minD) <= tomorrowMidnight
         })
        //  console.log(filteredTomorrow, "filteredTomorrow")
         setAllNotConfirmedTomorrow(filteredTomorrow)
       }}
          }
         
  } catch (err) {
    console.log(err, "NavigationBar getMyDeliveries has failed")
  }
}


async function getListNotConfirmed(token: string|null, setAllNotConfirmed: React.Dispatch<React.SetStateAction<number[]|null>>) {
  const arr: number[] = [];
  try {
    if (token) {
      let result: TNotConfirmedDeliveries[] = await getDeliveryListNotConfirmed(token);
      if (result) {
        result.forEach(i => arr.push(i.delivery))
        console.log(result, " getListNotConfirmed Deliveries navigation bar")
        setAllNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getListNotConfirmed Deliveries has failed")
  }
}

///////////////
// 
async function getTasksListNotConfirmed(token: string|null, setAllTasksNotConfirmed: React.Dispatch<React.SetStateAction<number[]|null>>) {
  const arr: number[] = [];
  try {
    if (token) {

      let result:TTasksNotConfirmed[]  = await getTaskListNotConfirmed(token);
      if (result) {
        result.forEach((i: TTasksNotConfirmed) => arr.push(i.task))
        console.log(result, " getTaskListNotConfirmed navigation bar")
        setAllTasksNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getListNotConfirmed has failed")
  }
}


async function getAllMyTasks(token: string|null,
  allTasksNotConfirmed: number[]|null, 
  setAllTasksNotConfirmedToday: React.Dispatch<React.SetStateAction<ITask[]>>,
  setAllTasksNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<ITask[]>>,
) {
  try {
    if (token) {
  
      let result: ITask[] = await getMyTasks(token, true, false);// запрашиваем ативные незаконченные таски
      if (result) {

        const now = new Date()
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const day = now.getUTCDate();
        const hour = now.getUTCHours();
        const min = now.getUTCMinutes();

        const todayGrinvich = new Date(year, month, day, hour, min);
        const todayMoscow = new Date(Date.parse(todayGrinvich.toUTCString()) + 180 * 60000);

        const filtered = result.filter(task => {
          if (allTasksNotConfirmed) {
            return allTasksNotConfirmed.includes(task.id)
          }
        })
        
        const tasksFilteredToday = filtered.filter(task => {

          const taskStartDate  = new Date(Date.parse(task.start_date) + 180 * 60000);
          const yearTs = taskStartDate.getUTCFullYear();
          const monthTs = taskStartDate.getUTCMonth();
          const dayTs = taskStartDate.getUTCDate();
          const hourTs = taskStartDate.getUTCHours();
          const minTs = taskStartDate.getUTCMinutes();
            

          const taskEndDate  = new Date(Date.parse(task.end_date) + 180 * 60000);
          const yearTe = taskEndDate.getUTCFullYear();
          const monthTe = taskEndDate.getUTCMonth();
          const dayTe = taskEndDate.getUTCDate();
          const hourTe = taskEndDate.getUTCHours();
          const minTe = taskEndDate.getUTCMinutes();


            // console.log(taskStartDate, " taskStartDate")
            // console.log(taskEndDate," taskEndDate")
     
            const midnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 23, 59);
          return new Date(yearTs, monthTs, dayTs, hourTs, minTs) >= todayMoscow && new Date(yearTs, monthTs, dayTs, hourTs, minTs) <= midnight || (new Date(yearTs, monthTs, dayTs, hourTs, minTs) < todayMoscow && new Date(yearTe, monthTe, dayTe, hourTe, minTe) >= todayMoscow) 
          })
          //  console.log(tasksFilteredToday, "tasksFilteredToday")
        setAllTasksNotConfirmedToday(tasksFilteredToday);


        if (todayMoscow >= new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 18, 0)) {
          const tasksFilteredTomorrow = filtered.filter(task => {
              const taskStartDate  = new Date(Date.parse(task.start_date) + 180 * 60000);
              const yearTs = taskStartDate.getUTCFullYear();
              const monthTs = taskStartDate.getUTCMonth();
              const dayTs = taskStartDate.getUTCDate();
              const hourTs = taskStartDate.getUTCHours();
              const minTs = taskStartDate.getUTCMinutes();
                
              const tomorrow = new Date(
                todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 0, 0)
                const tomorrowMidnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 23, 59)
            // return taskStartDate >= tomorrow && taskStartDate <= tomorrowMidnight
            return new Date(yearTs, monthTs, dayTs, hourTs, minTs) >= tomorrow && new Date(yearTs, monthTs, dayTs, hourTs, minTs) <= tomorrowMidnight;
          })
          // console.log(tasksFilteredTomorrow, "filteredTomorrowTasks")
          setAllTasksNotConfirmedTomorrow(tasksFilteredTomorrow)
        }
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getMyTasks has failed")
  }
}


async function getPromoListNotConfirmed(token: string|null, setAllPromoNotConfirmed: React.Dispatch<React.SetStateAction<number[]|null>>) {
  const arr: number[] = [];
  try {
    if (token) {
      let result:TPromoNotConfirm[] = await getPromotionNotConfirmed(token);
      if (result) {
        console.log(result, " getPromoListNotConfirmed navigation bar")
        result.forEach((i:TPromoNotConfirm)=> arr.push(i.promotion))
        setAllPromoNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getPromoListNotConfirmed has failed")
  }
}

async function getAllMyPromo(token: string,
  allPromoNotConfirmed: number[]|null,
  setAllPromoNotConfirmedToday:React.Dispatch<React.SetStateAction<IPromotion[]>>,
  setAllPromoNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<IPromotion[]>>
) {
  try {
    if (token) {
   
      let result: IPromotion[] = await getMyPromotions(token);// запрашиваем ативные незаконченные промоушены
      if (result) {

        const now = new Date()
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const day = now.getUTCDate();
        const hour = now.getUTCHours();
        const min = now.getUTCMinutes();

        const todayGrinvich = new Date(year, month, day, hour, min);
        const todayMoscow = new Date(Date.parse(todayGrinvich.toUTCString()) + 180 * 60000);
       
        const filtered = result.filter(promo => {
          if (allPromoNotConfirmed) {
            return allPromoNotConfirmed.includes(promo.id)
          }
          })

        const promoFilteredToday = filtered.filter(promo => {  
            // const promoStartDate = new Date(promo.start_date)
            const promoStartDate  = new Date(Date.parse(promo.start_date) + 180 * 60000);
            const yearPs = promoStartDate.getUTCFullYear();
            const monthPs = promoStartDate.getUTCMonth();
            const dayPs = promoStartDate.getUTCDate();
            const hourPs = promoStartDate.getUTCHours();
            const minPs = promoStartDate.getUTCMinutes();
              
            const promoEndDate = promo.end_date ? new Date(Date.parse(promo.end_date) + 180 * 60000) : null;
            // const taskEndDate  = new Date(Date.parse(task.end_date) + 180 * 60000);
            const yearPe = promoEndDate?.getUTCFullYear();
            const monthPe = promoEndDate?.getUTCMonth();
            const dayPe = promoEndDate?.getUTCDate();
            const hourPe = promoEndDate?.getUTCHours();
            const minPe = promoEndDate?.getUTCMinutes();
  

          const midnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 23, 59);
          // return promoStartDate >= today && promoStartDate <= midnight || (promoStartDate < today && (promoEndDate ? promoEndDate >= today : promo.is_permanent)) 
          return new Date(yearPs, monthPs, dayPs, hourPs, minPs) >= todayMoscow && new Date(yearPs, monthPs, dayPs, hourPs, minPs) <= midnight || (new Date(yearPs, monthPs, dayPs, hourPs, minPs) < todayMoscow && ((yearPe && monthPe && dayPe && hourPe && minPe) ? new Date(yearPe, monthPe, dayPe, hourPe, minPe) >= todayMoscow : promo.is_permanent)) 
          })
          //  console.log(promoFilteredToday, "promoFilteredToday")
        setAllPromoNotConfirmedToday(promoFilteredToday)
        
        if (todayMoscow >= new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate(), 18, 0)) {
          const promoFilteredTomorrow = filtered.filter(promo => {
              
            const promoStartDate  = new Date(Date.parse(promo.start_date) + 180 * 60000);
            const yearPs = promoStartDate.getUTCFullYear();
            const monthPs = promoStartDate.getUTCMonth();
            const dayPs = promoStartDate.getUTCDate();
            const hourPs = promoStartDate.getUTCHours();
            const minPs = promoStartDate.getUTCMinutes();

            const tomorrow = new Date(
              todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 0, 0)
            const tomorrowMidnight = new Date(todayMoscow.getUTCFullYear(), todayMoscow.getUTCMonth(), todayMoscow.getUTCDate() + 1, 23, 59);

            // return promoStartDate >= tomorrow && promoStartDate <= tomorrowMidnight
            return new Date(yearPs, monthPs, dayPs, hourPs, minPs) >= tomorrow && new Date(yearPs, monthPs, dayPs, hourPs, minPs) <= tomorrowMidnight
          })
        // console.log(promoFilteredTomorrow, "promoFilteredTomorrow")
          setAllPromoNotConfirmedTomorrow(promoFilteredTomorrow)
        }
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getMyTasks has failed")
  }
}


export {checkHaveNotification, getAllMyTasks, getMyDeliveries, getListNotConfirmed,  getTasksListNotConfirmed, getPromoListNotConfirmed, getAllMyPromo}