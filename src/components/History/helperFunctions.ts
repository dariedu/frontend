import { getCuratorDeliveries, ICuratorDeliveries, TCuratorDelivery } from '../../api/apiDeliveries';
import {getDeliveryById } from '../../api/apiDeliveries';
import {
  getVolunteerDeliveries,
  type IVolunteerDeliveries,
  type IDelivery,
} from '../../api/apiDeliveries';
import { getMyTasks, type ITask } from '../../api/apiTasks';
import {
  getMyPastOrActivePromotions,
  type IPromotion,
} from '../../api/apiPromotions';
import {
  // getBallCorrectEndingName,
  // getMetroCorrectName,
  getMonthCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import { TPromotionCategory } from '../../api/apiPromotions';

   ///////доставки куратора
  async function getMyCuratorDeliveries(token:string|null, isVolunteer:boolean, setCuratorCompletedDeliveries:React.Dispatch<React.SetStateAction<number[]>>){
    const myCompletedDeliveries: number[] = [];
    if (token  && !isVolunteer) {
      try {
       let result: ICuratorDeliveries = await getCuratorDeliveries(token);
      if (result) { 
        result['завершенные доставки'].forEach((i: TCuratorDelivery) => { myCompletedDeliveries.push(i.id_delivery) })
        setCuratorCompletedDeliveries(myCompletedDeliveries)
      }
  }catch (err) {
    console.log(err, "getMyCuratorDeliveries CuratorPage fail")
  }
      }
}


async function requestMyDelivery(token:string|null, isVolunteer:boolean, curatorCompletedDeliveries:number[], setCuratorPastDeliveries:React.Dispatch<React.SetStateAction<IDelivery[]>>) { 
    const delArr: IDelivery[] = [];
    if (token && !isVolunteer) {
      Promise.allSettled(curatorCompletedDeliveries.map(id => getDeliveryById(token, id)))
      .then(responses => responses.forEach((result, num) => {
        if (result.status == "fulfilled") {
          delArr.push(result.value)
        }
        if (result.status == "rejected") {
          console.log(`${num} delivery was not fetched`)
        }
      })).finally(() => {setCuratorPastDeliveries(delArr)}
      )
     }
}
  
  ///////доставки волонтера

  async function getMyPastDeliveries(token:string|null, setMyPastDeliveries:React.Dispatch<React.SetStateAction<IDelivery[]>>, setMistakeDelivery:React.Dispatch<React.SetStateAction<boolean>>) {
    let myPastDeliveries: IDelivery[] = [];
    try {
      if (token) {
        let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
        if (result) {
          result['мои завершенные доставки'].forEach((past: IDelivery) => {
            myPastDeliveries.push(past);
          });
          setMyPastDeliveries(myPastDeliveries);
        }
      }
    } catch (err) {
      setMistakeDelivery(true);
      console.log(err, 'HistoryVolunteer getMyPastDeliveries fail');
    }
}

// ITask[] 
  async function getMyPastTasks(token:string|null, setMyPastTasks:React.Dispatch<React.SetStateAction<ITask[]>>, setMistakeTask:React.Dispatch<React.SetStateAction<boolean>>) {
    try {
      if (token) {
        let result: ITask[] = await getMyTasks(token, false, true);
        if (result) {
          let filtered = result.filter(task => task.is_completed)/// доп проверка данных, если с сервера прийдет ошибочно все активные таски
          setMyPastTasks(filtered);
        }
      }
    } catch (err) {
      setMistakeTask(true);
      console.log(err, 'HistoryVolunteer getMyPastTasks fail');
    }
  }
  
//IPromotion[]
    async function getMyPastPromotions(token:string|null, setMyPastPromotions:React.Dispatch<React.SetStateAction<IPromotion[]>>, setMistakePromotion:React.Dispatch<React.SetStateAction<boolean>>) {
      try {
        if (token) {
          let result: IPromotion[] = await getMyPastOrActivePromotions(
            token,
            false,
          );
          if (result) {
            setMyPastPromotions(result);
          }
        }
      } catch (err) {
        setMistakePromotion(true);
        console.log(err, 'HistoryVolunteer getMyPastPromotions fail');
      }
}
    
  const filterCategoryOptions: TPromotionCategory[] = [
    {
      id: 1,
      name: 'доставка',
    },
    {
      id: 2,
      name: 'доброе дело',
    },
    {
      id: 3,
      name: 'поощрение',
    },
];
  
type IAllMyPast = {
  id: string;
  category: TPromotionCategory;
  startDateString: string;
  dayMonthYearString: string;
  name: string;
  points: number;
  plus: boolean;
  date?: string;
  subway?: string;
};



 function combineAllPast(myPastPromotions:IPromotion[],myPastDeliveries:IDelivery[], curatorPastDeliveries:IDelivery[], myPastTasks:ITask[], setAllMyPastCombined:React.Dispatch<React.SetStateAction<IAllMyPast[]>>) {
    let all: IAllMyPast[] = [];

    if (myPastDeliveries.length > 0) {
      myPastDeliveries.forEach(past => {
        const deliverytDate = new Date(Date.parse(past.date) + 180 * 60000);
        const day = deliverytDate.getUTCDate();
        const month = deliverytDate.toLocaleDateString('RU', {
          month: 'short',
        });
        const hours = deliverytDate
          ? String(deliverytDate.getUTCHours()).padStart(2, '0')
          : '--';
        const minutes = deliverytDate
          ? String(deliverytDate.getUTCMinutes()).padStart(2, '0')
          : '--';

        let delivery: IAllMyPast = {
          id: past.id + past.date,
          category: {
            id: 1,
            name: 'доставка',
          },
          startDateString: past.date,
          dayMonthYearString: `${day} ${getMonthCorrectEndingName(deliverytDate)} ${deliverytDate.getUTCFullYear()}`,
          name: 'Доставка',
          points: past.price,
          date: `${day} ${month} ${hours}:${minutes}`,
          subway: past.location.subway,
          plus: true,
        };
        all.push(delivery);
      });
    }
    if (curatorPastDeliveries.length > 0) {
      curatorPastDeliveries.forEach(past => {
        const deliverytDate = new Date(Date.parse(past.date) + 180 * 60000);
        const day = deliverytDate.getUTCDate();
        const month = deliverytDate.toLocaleDateString('RU', {
          month: 'short',
        });
        const hours = deliverytDate
          ? String(deliverytDate.getUTCHours()).padStart(2, '0')
          : '--';
        const minutes = deliverytDate
          ? String(deliverytDate.getUTCMinutes()).padStart(2, '0')
          : '--';

        let delivery: IAllMyPast = {
          id: past.id + past.date,
          category: {
            id: 1,
            name: 'доставка',
          },
          startDateString: past.date,
          dayMonthYearString: `${day} ${getMonthCorrectEndingName(deliverytDate)} ${deliverytDate.getUTCFullYear()}`,
          name: 'Курирование доставки',
          points: past.price,
          date: `${day} ${month} ${hours}:${minutes}`,
          subway: past.location.subway,
          plus: true,
        };
        all.push(delivery);
      });
    }

    if (myPastTasks.length > 0) {
      myPastTasks.forEach(past => {
        const taskStartDate = new Date(Date.parse(past.start_date) + 180 * 60000);
        const startDay = taskStartDate.getUTCDate();
        let task: IAllMyPast = {
          id: past.id + past.start_date,
          category: {
            id: 2,
            name: 'доброе дело',
          },
          startDateString: past.start_date,
          dayMonthYearString: `${startDay} ${getMonthCorrectEndingName(taskStartDate)} ${taskStartDate.getUTCFullYear()}`,
          name:
            past.category.name.slice(0, 1).toUpperCase() +
            past.category.name.slice(1),
          points: past.volunteer_price,
          plus: true,
        };
        all.push(task);
      });
    }
    if (myPastPromotions.length > 0) {
      myPastPromotions.forEach(past => {
        const promotionStartDate = new Date(Date.parse(past.start_date) + 180 * 60000);
        const startDay = promotionStartDate.getUTCDate();
        let task: IAllMyPast = {
          id: past.id + past.start_date,
          category: {
            id: 3,
            name: 'поощрение',
          },
          startDateString: past.start_date,
          dayMonthYearString: `${startDay} ${getMonthCorrectEndingName(promotionStartDate)} ${promotionStartDate.getUTCFullYear()}`,
          name: past.name.slice(0, 1).toUpperCase() + past.name.slice(1),
          points: past.price,
          plus: false,
        };
        all.push(task);
      });
    }

    function compare(a: IAllMyPast, b: IAllMyPast) {
      var dateA = new Date(Date.parse(a.startDateString) + 180 * 60000)
      var dateB = new Date(Date.parse(b.startDateString) + 180 * 60000)
      return +dateB - +dateA;
    }

    let sorted = all.sort(compare);
    setAllMyPastCombined(sorted);
  }
export {getMyCuratorDeliveries, requestMyDelivery, getMyPastDeliveries, getMyPastTasks, getMyPastPromotions, combineAllPast, type IAllMyPast, filterCategoryOptions }