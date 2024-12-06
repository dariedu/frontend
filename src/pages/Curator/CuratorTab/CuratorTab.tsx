import React, { useState, useContext, useEffect } from 'react';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';
import { TokenContext } from '../../../core/TokenContext';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react';
import { getTasksCurator, type ITask } from '../../../api/apiTasks';
import NearestTaskCurator from '../../../components/NearestTask/NearestTaskCurator';
import { getMyFeedbacks, type TMyFeedback } from '../../../api/feedbackApi';
import { UserContext } from '../../../core/UserContext';

const CuratorTab: React.FC = () => {

   const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>([])
   const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>([])
   const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<TCuratorDelivery[]>([])
   const [curtorTasks, setCurtorTasks] = useState<ITask[]>([]);  
   const [completedTaskFeedbacks, setCompletedTaskFeedbacks] = useState<number[]>([]) ///все отзывы по таскам
   const [completedDeliveryFeedbacks, setCompletedDeliveryFeedbacks] = useState<number[]>([]); ////тут все мои отзывы

   ///// используем контекст токена
   const {token} = useContext(TokenContext);
   const {currentUser} = useContext(UserContext);
  ////// используем контекст

//// 1. запрашиваем кураторские доставки и берем активные и в процессе исполнения
async function getMyCuratorDeliveries() {
  const activeDeliveries: TCuratorDelivery[] = [];
  const inProcessDeliveries: TCuratorDelivery[] = [];
  const myCompletedDeliveries: TCuratorDelivery[] = [];
  if (token) {
    try {
     let result: ICuratorDeliveries = await getCuratorDeliveries(token);
    if (result) { 
      result['активные доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
      setCuratorActiveDeliveries(activeDeliveries)/// запоминаем результат
     ////////////////////////
      result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i) });
      setCuratorInProcessDeliveries(inProcessDeliveries)/// запоминаем результат
      /////////////////////
      result['завершенные доставки'].forEach((i: TCuratorDelivery) => { myCompletedDeliveries.push(i) })
      setCuratorCompletedDeliveries(myCompletedDeliveries)
    }
}catch (err) {
  console.log(err, "getMyCuratorDeliveries CuratorPage fail")
}
    }
  }
  
  async function getMyCuratorTasks() {
    if (token) {
      try {
        let result = await getTasksCurator(token);
        if (result) {
         let filtered = result.filter(task => {
            if (task.is_completed) {
            let timeDiff = Math.abs(+new Date() - +new Date(task.end_date));
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(diffDays <= 5) return task
            } else {
              return task
            }
         })
        setCurtorTasks(filtered)
        } 
      } catch (err) {
        console.log(err)
      }
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
    useEffect(() => {
      getMyCuratorDeliveries()
      getMyCuratorTasks()
      getAllMyFeedbacks()
 }, [])

  
 
  return (
    <div className="flex-col bg-light-gray-1 dark:bg-light-gray-black h-screen pb-20 overflow-y-auto w-full max-w-[500px]">
      {curatorInProcessDeliveries && curatorInProcessDeliveries.length >0 && (
        curatorInProcessDeliveries.sort((a, b) => { return +(new Date(a.id_delivery)) - +(new Date(b.id_delivery)) }).map((del, index) => {
            return(<div key={index}>
              <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='active' />
            </div>)
        })
      )}
      {curatorActiveDeliveries && curatorActiveDeliveries.length >0 && (
        curatorActiveDeliveries.sort((a, b) => { return +(new Date(a.id_delivery)) - +(new Date(b.id_delivery)) }).map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='nearest' />
          </div>)
        })
      )}
      {curatorCompletedDeliveries && curatorCompletedDeliveries.length > 0 && (
       curatorCompletedDeliveries.sort((a, b) => { return +(new Date(a.id_delivery)) - +(new Date(b.id_delivery)) }).map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='completed' feedbackSubmited={completedDeliveryFeedbacks.includes(del.id_delivery)? true : false}/>
          </div>)
        })
      )}
         {curtorTasks && curtorTasks.length > 0 &&
        curtorTasks.map((task, index) => {
          const submited = completedTaskFeedbacks.includes(task.id) ? true : false;
          return (  <div key={index}>
            <NearestTaskCurator
             task={task}
             taskFilter={task.is_completed ? "completed" : (+new Date() - +new Date(task.start_date) <= 0) ? 'nearest' : 'active'}
             feedbackSubmited={submited}
       />
          </div>
          )
        }
        )
       }
      {curatorCompletedDeliveries.length == 0 && curatorActiveDeliveries.length == 0 && curatorInProcessDeliveries.length == 0 && curtorTasks.length == 0 && (
        <div className='flex flex-col w-[350px] items-center mt-10 h-[400px] justify-center ml-4'>
        <LogoNoTaskYet className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
      <p className='dark:text-light-gray-1'>Скоро тут появятся ваши доставки<br/>и добрые дела</p>
    </div>
      )
      }
    </div>
  );
};

export default CuratorTab;
