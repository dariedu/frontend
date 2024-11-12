import React, {useEffect, useContext, useState} from 'react';
import { getVolunteerDeliveries, type IVolunteerDeliveries, type IDelivery } from '../../api/apiDeliveries';
import { UserContext } from '../../core/UserContext';
import { getMyTasks, type ITask } from '../../api/apiTasks';
import { getBallCorrectEndingName, getMetroCorrectName, getMonthCorrectEndingName } from '../helperFunctions/helperFunctions';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import LogoNoTaskYet from './../../assets/icons/LogoNoTaskYet.svg?react';
import { getMyPastOrActivePromotions, type IPromotion } from '../../api/apiPromotions';

 interface IHistoryProps {
   onClose: React.Dispatch<React.SetStateAction<boolean>>,
   isVolunteer:boolean
 }


const History: React.FC<IHistoryProps> = ({
  onClose,
  isVolunteer
}) => {
  type IAllMyPast = {
    id:number,
    startDateString: string,
    dayMonthYearString:string,
    name: string
    points: number
    plus:boolean
    date?: string
    subway?: string
  }
  

  const {token} = useContext(UserContext);  //// берем токен из юзер контекст
  const [myPastDeliveries, setMyPastDeliveries] = useState<IDelivery[]>([]);
  const [myPastTasks, setMyPastTasks] = useState<ITask[]>([]);
  const [myPastPromotions, setMyPastPromotions] = useState<IPromotion[]>([]);
  const [allMyPastCombined, setAllMyPastCombined] = useState<IAllMyPast[]>([]);
  
 
  // console.log(allMyPastCombined, "allMyPastCombined")

  async function getMyPastDeliveries() { 
    let myPastDeliveries: IDelivery[] = [];
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
           
           result['мои завершенные доставки'].forEach((past:IDelivery) => {
             myPastDeliveries.push(past)
           })
           setMyPastDeliveries(myPastDeliveries)
         }
    }
    } catch (err) {
      console.log(err, "HistoryVolunteer getMyPastDeliveries fail")
    }
  }
  
  async function getMyPastTasks() { 
    try {
       if (token) {
         let result: ITask[] = await  getMyTasks(token, false, true );
         if (result) {
           setMyPastTasks(result)
         }
    }
    } catch (err) {
      console.log(err, "HistoryVolunteer getMyPastTasks fail")
    }
  }
  async function getMyPastPromotions() {
    try {
      if (token) {
        let result: IPromotion[] = await getMyPastOrActivePromotions(token, false);
        if (result) {
          setMyPastPromotions(result)
        }
      }
    } catch (err) {
      console.log(err, "HistoryVolunteer getMyPastPromotions fail")
    }
  }



  function combineAllPast() {

    let all: IAllMyPast[] = [];

    if (myPastDeliveries.length > 0) {
      myPastDeliveries.forEach(past => {
      const deliverytDate = new Date(past.date);
      const day = deliverytDate.getDate();
      const month = deliverytDate.toLocaleDateString("RU", {month:"short"});
      const hours = deliverytDate ? String(deliverytDate.getHours()).padStart(2, '0') : '--';
      const minutes = deliverytDate ? String(deliverytDate.getMinutes()).padStart(2, '0') : '--';

        let delivery: IAllMyPast = {
        id:past.id,
        startDateString: past.date,
        dayMonthYearString:`${day} ${getMonthCorrectEndingName(deliverytDate)} ${deliverytDate.getFullYear()}`,
        name: isVolunteer ? 'Доставка': 'Курирование доставки',
        points: past.price,
        date: `${day} ${month} ${hours}:${minutes}`,
        subway: past.location.subway,
        plus:true
      }
      all.push(delivery)
    })
    };

    if (myPastTasks.length > 0) {
      myPastTasks.forEach(past => {
        const taskStartDate = new Date(past.start_date);
        const startDay = taskStartDate.getDate();
        let task: IAllMyPast = {
          id:past.id,
          startDateString: past.start_date,
          dayMonthYearString:`${startDay} ${getMonthCorrectEndingName(taskStartDate)} ${taskStartDate.getFullYear()}`,
          name: past.category.name.slice(0,1).toUpperCase()+past.category.name.slice(1),
          points: past.volunteer_price,
          plus: true
        }
        all.push(task)
      })
    }
    if (myPastPromotions.length > 0) {
      myPastPromotions.forEach(past => {
        const promotionStartDate = new Date(past.start_date);
        const startDay = promotionStartDate.getDate();
        let task: IAllMyPast = {
          id:past.id,
          startDateString: past.start_date,
          dayMonthYearString:`${startDay} ${getMonthCorrectEndingName(promotionStartDate)} ${promotionStartDate.getFullYear()}`,
          name: past.name.slice(0,1).toUpperCase()+past.name.slice(1),
          points: past.price,
          plus: false
        }
        all.push(task)
      })
    }
    

    function compare(a:IAllMyPast, b:IAllMyPast) {
      var dateA = new Date(a.startDateString);
      var dateB = new Date(b.startDateString);
      return +dateB - +dateA;
    }

    let sorted = all.sort(compare)
    setAllMyPastCombined(sorted)
  }

  
  useEffect(() => {
    getMyPastDeliveries();
    getMyPastTasks();
    getMyPastPromotions()
  }, [])

  useEffect(() => {
    combineAllPast()
  },[myPastDeliveries, myPastTasks])
  
  
  return (
    <div className="bg-light-gray-1 dark:bg-light-gray-black rounded-[16px] w-[360px] h-full flex flex-col items-center justify-start overflow-x-hidden">
       
      <div className="flex items-center mb-[4px] bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-[360px] rounded-b-2xl h-[60px]">
        <button onClick={()=>onClose(false)} className="mr-2">
          <RightArrowIcon className='rotate-180 w-9 h-9 mr-[8px] dark:fill-light-gray-1 fill-light-gray-black' />
        </button>
        <h2 className='text-light-gray-black dark:text-light-gray-1'>История</h2>
      </div>
      <div className='flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden'>
      {allMyPastCombined.length > 0 ? (
        allMyPastCombined.map((past, index) => {

          return (
            <>
              {index == 0 ?(
                <div className='w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6'>{past.dayMonthYearString}</div> 
              ) : allMyPastCombined[index].dayMonthYearString == allMyPastCombined[index - 1].dayMonthYearString ? ("") : (
                <div className='w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6'>{past.dayMonthYearString}</div> 
              )}
            
              <div className="text-light-gray-6 h-fit w-[328px] bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6" key={past.id}>
            <div className='flex justify-between mb-[6px]'>
              <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">{past.name}</p>
                  <p className={past.plus ? "font-gerbera-sub2 text-light-brand-green" : "font-gerbera-sub2 text-light-error-red"}>{past.plus? "+ " : "- "}{past.points} {getBallCorrectEndingName(past.points)}</p>
                </div>
            {past.date? (<p className="font-gerbera-sub1 text-light-gray-5 mb-1 dark:text-light-gray-2">{past.date}</p>): ("")}
            {past.subway ? (<p className="font-gerbera-sub1  text-light-gray-5 dark:text-light-gray-2">Ст. м. {getMetroCorrectName(past.subway)}</p>) : ""}
          </div>
            </>
            
          )
          
        })
      ) : (<div className='flex flex-col items-center justify-center h-screen'>
        <LogoNoTaskYet className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
        <p className='font-gerbera-h2 text-light-gray-black dark:text-light-gray-1 mt-7 text-center'>Пока нет завершенных<br/>добрых дел</p>
    </div>)}
</div>
          
    </div>
  );
};

export default History;
