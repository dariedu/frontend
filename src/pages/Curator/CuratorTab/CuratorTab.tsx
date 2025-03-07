import React, { useState, useContext, useEffect } from 'react';
import {  TCuratorDelivery, type TDeliveryListConfirmedForCurator  } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDeliveryCurator/NearestDeliveryCurator';
import { TokenContext } from '../../../core/TokenContext';
import { type ITask } from '../../../api/apiTasks';
import NearestTaskCurator from '../../../components/NearestTask/NearestTaskCurator';

import { UserContext } from '../../../core/UserContext';
import Bread from './../../../assets/icons/bread.svg?react'
import {requestDeliveryConfirmedList, getMyCuratorDeliveries, getMyCuratorTasks, getAllMyFeedbacks } from './helperFunctions';


const CuratorTab: React.FC = () => {

   const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_active_del_for_curator_tab`) !== null && localStorage.getItem(`curator_active_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_active_del_for_curator_tab`) as string) : [])
   const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_inProcess_del_for_curator_tab`) !== null && localStorage.getItem(`curator_inProcess_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_inProcess_del_for_curator_tab`) as string) : [])
   const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<TCuratorDelivery[]>(localStorage.getItem(`curator_completed_del_for_curator_tab`) !== null && localStorage.getItem(`curator_completed_del_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_completed_del_for_curator_tab`) as string) : [])
   const [curtorTasks, setCurtorTasks] = useState<ITask[]>(localStorage.getItem(`curator_tasks_for_curator_tab`) !== null && localStorage.getItem(`curator_tasks_for_curator_tab`) !== undefined ? JSON.parse(localStorage.getItem(`curator_tasks_for_curator_tab`) as string) : []);  
   const [completedTaskFeedbacks, setCompletedTaskFeedbacks] = useState<number[]>([]) ///все отзывы по таскам
   const [completedDeliveryFeedbacks, setCompletedDeliveryFeedbacks] = useState<number[]>([]); ////тут все мои отзывы
   const [arrayListOfConfirmedVol, setArrayListOfConfirmedVol] = useState<TDeliveryListConfirmedForCurator[]|null>(null)
   ///// используем контекст токена
   const {token} = useContext(TokenContext);
   const {currentUser} = useContext(UserContext);
  ////// используем контекст

    useEffect(() => {
      getMyCuratorDeliveries(token,setCuratorActiveDeliveries, setCuratorInProcessDeliveries, setCuratorCompletedDeliveries )
      getMyCuratorTasks(token,  setCurtorTasks)
      getAllMyFeedbacks(token, currentUser, setCompletedDeliveryFeedbacks, setCompletedTaskFeedbacks)
      requestDeliveryConfirmedList(token, setArrayListOfConfirmedVol)
 }, [])

 
  return (
    <div className="flex-col bg-light-gray-1 dark:bg-light-gray-black h-fit pb-20 overflow-y-auto w-full max-w-[500px]">
      {curatorInProcessDeliveries && curatorInProcessDeliveries.length >0 && (
        curatorInProcessDeliveries.map((del, index) => {
            return(<div key={index}>
              <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='active' arrayListOfConfirmedVol={arrayListOfConfirmedVol} />
            </div>)
        })
      )}
      {curatorActiveDeliveries && curatorActiveDeliveries.length >0 && (
        curatorActiveDeliveries.map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='nearest'  arrayListOfConfirmedVol={arrayListOfConfirmedVol}/>
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
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='completed' feedbackSubmited={completedDeliveryFeedbacks.includes(del.id_delivery)? true : false}  arrayListOfConfirmedVol={arrayListOfConfirmedVol}/>
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
