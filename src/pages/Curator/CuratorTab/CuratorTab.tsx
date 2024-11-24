import React, { useState, useContext, useEffect } from 'react';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';
import { TokenContext } from '../../../core/TokenContext';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react';

const CuratorTab: React.FC = () => {

   const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>([])
   const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>([])
  const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<TCuratorDelivery[]>([])
  
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
 
    useEffect(() => {
   getMyCuratorDeliveries()
 }, [])


  return (
    <div className="flex-col bg-light-gray-1 dark:bg-light-gray-black h-screen overflow-y-auto">
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
      {curatorCompletedDeliveries && curatorCompletedDeliveries.length >0 && (
       curatorCompletedDeliveries.sort((a, b) => { return +(new Date(a.id_delivery)) - +(new Date(b.id_delivery)) }).map((del, index) => {
          return (<div key={index}>
            <NearestDeliveryCurator curatorDelivery={del} deliveryFilter='completed' />
          </div>)
        })
      )}
      {curatorCompletedDeliveries.length == 0 && curatorActiveDeliveries.length == 0 && curatorInProcessDeliveries.length == 0 && (
        <div className='flex flex-col w-[350px] items-center mt-10 h-[400px] justify-center ml-4'>
        <LogoNoTaskYet className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
      <p className='dark:text-light-gray-1'>Скоро тут появятся ваши доставки</p>
    </div>
      )
      }
 
    </div>
  );
};

export default CuratorTab;
