import React, { useState, useContext, useEffect } from 'react';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';
import { TokenContext } from '../../../core/TokenContext';
import { getTasksCurator, type ITask } from '../../../api/apiTasks';
import NearestTaskCurator from '../../../components/NearestTask/NearestTaskCurator';
import { getMyFeedbacks, type TMyFeedback } from '../../../api/feedbackApi';
import { UserContext } from '../../../core/UserContext';
import Bread from './../../../assets/icons/bread.svg?react'

const CuratorTab: React.FC = () => {

   const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_active_del_for_curator_tab`) !== null && localStorage.getItem(`curator_active_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_active_del_for_curator_tab`) as string) : [])
   const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_inProcess_del_for_curator_tab`) !== null && localStorage.getItem(`curator_inProcess_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_inProcess_del_for_curator_tab`) as string) : [])
   const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_completed_del_for_curator_tab`) !== null && localStorage.getItem(`curator_completed_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_completed_del_for_curator_tab`) as string) : [])
   const [curtorTasks, setCurtorTasks] = useState<ITask[]>(localStorage.getItem(`curator_tasks_for_curator_tab`) !== null && localStorage.getItem(`curator_tasks_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_tasks_for_curator_tab`) as string) : []);  
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
      localStorage.setItem(`curator_active_del_for_curator_tab`, JSON.stringify(activeDeliveries))
     ////////////////////////
      result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i) });
      setCuratorInProcessDeliveries(inProcessDeliveries)/// запоминаем результат
      localStorage.setItem(`curator_inProcess_del_for_curator_tab`, JSON.stringify(inProcessDeliveries))
      /////////////////////
      result['завершенные доставки'].forEach((i: TCuratorDelivery) => { myCompletedDeliveries.push(i) })
      setCuratorCompletedDeliveries(myCompletedDeliveries)
      localStorage.setItem(`curator_completed_del_for_curator_tab`, JSON.stringify(myCompletedDeliveries))
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
          localStorage.setItem(`curator_tasks_for_curator_tab`, JSON.stringify(filtered))
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

        result.filter(i=>i.user == currentUser?.id).forEach(i => {
          if (typeof i.delivery == 'number' && i.type == 'completed_delivery_curator') {
            allMySubmitedFeedbacksForCompletedDeliveries.push(i.delivery)
          } else if (typeof i.task == 'number' && i.type == 'completed_task_curator') {
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
    <div className="flex-col bg-light-gray-1 dark:bg-light-gray-black h-fit pb-20 overflow-y-auto w-full max-w-[500px]">
      {curatorInProcessDeliveries && curatorInProcessDeliveries.length >0 && (
        curatorInProcessDeliveries.map((del, index) => {
            return(<div key={index}>
              <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='active' />
            </div>)
        })
      )}
      {curatorActiveDeliveries && curatorActiveDeliveries.length >0 && (
        curatorActiveDeliveries.map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='nearest' />
          </div>)
        })
      )}
         {curtorTasks && curtorTasks.length > 0 &&
        curtorTasks.filter(i =>!i.is_completed).map((task, index) => {
          const submited = completedTaskFeedbacks.includes(task.id) ? true : false;
          return (  <div key={index}>
            <NearestTaskCurator
             task={task}
             taskFilter={+new Date() - +new Date(task.start_date) <= 0 ? 'nearest' : 'active'}
             feedbackSubmited={submited}
       />
          </div>
          )
        }
        )
      }
      {curatorCompletedDeliveries && curatorCompletedDeliveries.length > 0 && (
       curatorCompletedDeliveries.map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='completed' feedbackSubmited={completedDeliveryFeedbacks.includes(del.id_delivery)? true : false}/>
          </div>)
        })
      )}  
      {curtorTasks && curtorTasks.length > 0 &&
        curtorTasks.filter(i=>i.is_completed).map((task, index) => {
          const submited = completedTaskFeedbacks.includes(task.id) ? true : false;
          return (  <div key={index}>
            <NearestTaskCurator
             task={task}
             taskFilter={"completed"}
             feedbackSubmited={submited}
       />
          </div>
          )
        }
        )
      }
      {curatorCompletedDeliveries.length == 0 && curatorActiveDeliveries.length == 0 && curatorInProcessDeliveries.length == 0 && curtorTasks.length == 0 && (
      <div className='flex flex-col h-full mt-[50%] items-center justify-center overflow-y-hidden'>
        <Bread className='fill-[#000000] dark:fill-[#F8F8F8] mb-4'/>
      <p className='text-light-gray-black dark:text-light-gray-1 w-64'>Скоро тут появятся ваши доставки<br/>и добрые дела</p>
    </div>
      )} 
    </div>
  );
};

export default CuratorTab;
