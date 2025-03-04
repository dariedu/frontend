import { getVolunteerDeliveries, getDeliveryListNotConfirmed, type IDelivery, type IVolunteerDeliveries, type TNotConfirmedDeliveries } from '../../api/apiDeliveries';
import { getMyTasks, getTaskListNotConfirmed, type ITask, type TTasksNotConfirmed } from '../../api/apiTasks';
import {getPromotionNotConfirmed,  getMyPromotions, IPromotion, TPromoNotConfirm} from '../../api/apiPromotions'

 
//// берем все доставки волонтера, ищем те, которые еще не подтверждены,
// сортируем их на сегодня и завтра для уведомлений по подтверждению или отказу от доставки
async function getMyDeliveries(
  token: string,
  allNotConfirmed: number[], 
  setAllNotConfirmedToday: React.Dispatch<React.SetStateAction<IDelivery[]>>,
  setAllNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<IDelivery[]>>,
) {
  const current: IDelivery[] = [];
  try {
    if (token) {
       
       let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
      if (result) {
        const today = new Date();
        
         result['мои активные доставки'].forEach(i => { current.push(i) });
         const filtered = current.filter(del => {
         return allNotConfirmed.includes(del.id)
         })
           
         const filteredToday = filtered.filter(del => {
         const deliveryDate = new Date(del.date)
        
         const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59);
          return deliveryDate >= today && deliveryDate <= midnight
         })
        console.log(filteredToday, "filteredToday")
         setAllNotConfirmedToday(filteredToday)


        if (new Date(today) >= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0)) {
             const filteredTomorrow= filtered.filter(del => {
          const deliveryDate = new Date(del.date)
          const tomorrow = new Date(
            today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0)
            const tomorrowMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59)
           return deliveryDate >= tomorrow && deliveryDate <= tomorrowMidnight
         })
         console.log(filteredTomorrow, "filteredTomorrow")
         setAllNotConfirmedTomorrow(filteredTomorrow)
       }}
          }
         
  } catch (err) {
    console.log(err, "NavigationBar getMyDeliveries has failed")
  }
}


async function getListNotConfirmed(token: string, setAllNotConfirmed: React.Dispatch<React.SetStateAction<number[]>>) {
  const arr: number[] = [];
  try {
    if (token) {
      let result: TNotConfirmedDeliveries[] = await getDeliveryListNotConfirmed(token);
      if (result) {
        result.forEach(i => arr.push(i.delivery))
        setAllNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getListNotConfirmed has failed")
  }
}

///////////////
// 
async function getTasksListNotConfirmed(token: string, setAllTasksNotConfirmed: React.Dispatch<React.SetStateAction<number[]>>) {
  const arr: number[] = [];
  try {
    if (token) {

      let result:TTasksNotConfirmed[]  = await getTaskListNotConfirmed(token);
      if (result) {
        result.forEach((i:TTasksNotConfirmed)=> arr.push(i.task))
        setAllTasksNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getListNotConfirmed has failed")
  }
}


async function getAllMyTasks(token: string,
  allTasksNotConfirmed: number[], 
  setAllTasksNotConfirmedToday: React.Dispatch<React.SetStateAction<ITask[]>>,
  setAllTasksNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<ITask[]>>,
) {
  try {
    if (token) {
     const today = new Date();
      let result: ITask[] = await getMyTasks(token, true, false);// запрашиваем ативные незаконченные таски
      if (result) {
        const filtered = result.filter(del => {
          return allTasksNotConfirmed.includes(del.id)
          })
          // console.log(result, "tasks result")
          const tasksFilteredToday = filtered.filter(task => {
          const taskStartDate = new Date(task.start_date)
          const taskEndDate = new Date(task.end_date)
     
          const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59);
           return taskStartDate >= today && taskStartDate <= midnight || (taskStartDate < today && taskEndDate >= today) 
          })
           console.log(tasksFilteredToday, "tasksFilteredToday")
          setAllTasksNotConfirmedToday(tasksFilteredToday)
        if (new Date(today) >= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0)) {
          const tasksFilteredTomorrow = filtered.filter(task => {
            const taskStartDate = new Date(task.start_date)

            const tomorrow = new Date(
              today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 1)
            const tomorrowMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59)
            return taskStartDate >= tomorrow && taskStartDate <= tomorrowMidnight
          })
          console.log(tasksFilteredTomorrow, "filteredTomorrowTasks")
          setAllTasksNotConfirmedTomorrow(tasksFilteredTomorrow)
        }
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getMyTasks has failed")
  }
}


async function getPromoListNotConfirmed(token: string, setAllPromoNotConfirmed: React.Dispatch<React.SetStateAction<number[]>>) {
  const arr: number[] = [];
  try {
    if (token) {
      let result:TPromoNotConfirm[] = await getPromotionNotConfirmed(token);
      if (result) {
        result.forEach((i:TPromoNotConfirm)=> arr.push(i.promotion))
        setAllPromoNotConfirmed(arr)
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getPromoListNotConfirmed has failed")
  }
}

async function getAllMyPromo(token: string,
  allPromoNotConfirmed: number[],
  setAllPromoNotConfirmedToday:React.Dispatch<React.SetStateAction<IPromotion[]>>,
  setAllPromoNotConfirmedTomorrow:React.Dispatch<React.SetStateAction<IPromotion[]>>
) {
  try {
    if (token) {
      const today = new Date();
      let result: IPromotion[] = await getMyPromotions(token);// запрашиваем ативные незаконченные промоушены
      if (result) {
        const filtered = result.filter(promo => {
          return allPromoNotConfirmed.includes(promo.id)
          })

          const promoFilteredToday = filtered.filter(promo => {
          const promoStartDate = new Date(promo.start_date)
          const promoEndDate =  promo.end_date ? new Date(promo.end_date) : null
          const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59);
            return promoStartDate >= today && promoStartDate <= midnight || (promoStartDate < today && (promoEndDate ? promoEndDate >= today : promo.is_permanent)) 
          })
           console.log(promoFilteredToday, "promoFilteredToday")
        setAllPromoNotConfirmedToday(promoFilteredToday)
        
        if (new Date(today) >= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0)) {
            const promoFilteredTomorrow = filtered.filter(promo => {
            const promoStartDate = new Date(promo.start_date)

            const tomorrow = new Date(
            today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 1)
            const tomorrowMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59)
            return promoStartDate >= tomorrow && promoStartDate <= tomorrowMidnight
          })
        console.log(promoFilteredTomorrow, "promoFilteredTomorrow")
          setAllPromoNotConfirmedTomorrow(promoFilteredTomorrow)
        }
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getMyTasks has failed")
  }
}


export {getAllMyTasks, getMyDeliveries, getListNotConfirmed,  getTasksListNotConfirmed, getPromoListNotConfirmed, getAllMyPromo}