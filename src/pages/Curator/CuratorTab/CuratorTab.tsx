import React, { useState, useContext, useEffect } from 'react';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';
import { TokenContext } from '../../../core/TokenContext';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react';
import { getTasksCurator, type ITask } from '../../../api/apiTasks';
import NearestTaskCurator from '../../../components/NearestTask/NearestTaskCurator';

const CuratorTab: React.FC = () => {

   const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>([])
   const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>([])
   const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<TCuratorDelivery[]>([])
   const [curtorTasks, setCurtorTasks] = useState<ITask[]>([]);  


   ///// используем контекст токена
   const tokenContext = useContext(TokenContext);
   const token = tokenContext.token;
  ////// используем контекст


//// 1. запрашиваем кураторские доставки и берем активные и в процессе исполнения
async function getMyCuratorDeliveries() {
  const activeDeliveries: TCuratorDelivery[] = [];
  const inProcessDeliveries: TCuratorDelivery[] = [];
  const myCompletedDeliveries: TCuratorDelivery[] = []
  try {
     if (token) {
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
  }
  } catch (err) {
    console.log(err, "getMyCuratorDeliveries CuratorPage fail")
  }
  }
  
  async function getMyCuratorTasks() {
    if (token) {
      try {
        let result = await getTasksCurator(token);
        if (result) {
        setCurtorTasks(result)
        } 
      } catch (err) {
        console.log(err)
      }
    }
  }

  // async function getMyCompletedTasks() {
  //   if (token) {
  //     try {
  //       let result = await getMyTasks(token, false, true);
  //       if (result) {
  //         console.log(result)
  //       //setCurtorTasks(result)
  //       } 
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  // }
 
    useEffect(() => {
      getMyCuratorDeliveries()
      getMyCuratorTasks()
      //getMyCompletedTasks() 
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
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='completed' />
          </div>)
        })
      )}
         {curtorTasks && curtorTasks.length > 0 &&
        curtorTasks.map((task, index) => (
          <div key={index}>
             <NearestTaskCurator
              task={task}
              taskFilter={task.is_completed ? "completed" : (+new Date() - +new Date(task.start_date) <= 0) ? 'nearest' : 'active'}
        />
          </div>
        ))
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
