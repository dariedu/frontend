import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../core/UserContext';
import { type IRouteSheet, type TRouteSheetIndividual, getRouteSheetById } from '../../../api/routeSheetApi';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries, getDeliveryById, IDelivery } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';


const CuratorTab: React.FC = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  interface IDeliveryWithRouteSheets extends IDelivery {
    delivery_routeSheets?: IRouteSheet[]
  }

  const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>([])
  const [myCurrentActiveDeliveries, setMyCurrentActiveDeliveries] = useState<IDeliveryWithRouteSheets[]>([]) ///основной объект активной доставки
  const [activeDeliveriesAssignmentsSuccess, setActiveDeliveriesAssignmentsSuccess] = useState(false);
  const [activeRouteSheetWithDeliveryId, setActiveRouteSheetWithDeliveryId] = useState<TRouteSheetIndividual[]>([])
  const [assignRouteSheetsToFullDeliveryObjectActiveSuccess, setAssignRouteSheetsToFullDeliveryObjectActiveSuccess] = useState(false);
  // ////////////////////////////
  const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>([])
  const [myInProcessDeliveries, setMyInProcessDeliveries] = useState<IDeliveryWithRouteSheets[]>([]) ///основной объект активной в процессе выполнения доставки
  const [inProcessDeliveriesAssignmentsSuccess, setInProcessDeliveriesAssignmentsSuccess] = useState(false)
  const [inProcessRouteSheetWithDeliveryId, setInProcessRouteSheetWithDeliveryId] = useState<TRouteSheetIndividual[]>([])
  const [assignRouteSheetsToFullDeliveryObjectInProcessSuccess, setAssignRouteSheetsToFullDeliveryObjectInProcessSuccess] = useState(false);
  
  
   ////// используем контекст юзера
    const userValue = useContext(UserContext);
    const token = userValue.token;
   ////// используем контекст

  // На этой странице мы запрашиваем все доставки куратора, после чего запрашиваем полный объект доставок записанных на куратора
  // в полный объект доставки добавляем необходимую информацию о записавшихся волонтерах
  // и в полный объект доставки добавляем полные объекты маршрутных листов
  // таким образом у нас получаеся полный объект всех активных доставок и доставок в процессе, которые мы отправляем дальше в NearestDelivery

  
//// 1. запрашиваем кураторские доставки и берем активные и в процессе исполнения
async function getMyCuratorDeliveries() {
  const activeDeliveries: TCuratorDelivery[] = [];
  const inProcessDeliveries: TCuratorDelivery[] = [];
  try {
     if (token) {
       let result: ICuratorDeliveries = await getCuratorDeliveries(token);
       if (result) { 
         result['активные доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
         requestEachMyDelivery(activeDeliveries, setMyCurrentActiveDeliveries)/// запрашиваем полный объект доставки
         requestEachMyActiveRouteSheet(activeDeliveries, setActiveRouteSheetWithDeliveryId)
         setCuratorActiveDeliveries(activeDeliveries)/// запоминаем результат
        ////////////////////////
         result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i) });
         requestEachMyDelivery(inProcessDeliveries, setMyInProcessDeliveries)/// запрашиваем полный объект доставки
         requestEachMyActiveRouteSheet(inProcessDeliveries, setInProcessRouteSheetWithDeliveryId)
         setCuratorInProcessDeliveries(inProcessDeliveries)/// запоминаем результат
         /////////////////////
       }
  }
  } catch (err) {
    console.log(err, "getMyCuratorDeliveries CuratorPage fail")
  }
}
 
    useEffect(() => {
   getMyCuratorDeliveries()
 }, [])
  /////////////////////////////////////////////
    //// 2. запрашиваем полные объекты доставок
  function requestEachMyDelivery(deliveries: TCuratorDelivery[], setStateAction:React.Dispatch<React.SetStateAction<IDeliveryWithRouteSheets[]>> ) { 
    if (token) {
  let requestedDeliveries: IDelivery[] = [];
  Promise.allSettled(deliveries.map(delivery => getDeliveryById(token, delivery.id_delivery)))
    .then(responses => responses.forEach((result, num) => {
      if (result.status == "fulfilled") {
        requestedDeliveries.push(result.value)
      }
      if (result.status == "rejected") {
       console.log(`${num} delivery was not fetched`)
      }
    })).finally(() => { setStateAction(requestedDeliveries)}
    )
 }
  }

/////3. переносим deliveryAssignments (записавшихся волонтеров на доставку) в полный объект доставки
  function assignVolunteersToFullDeliveryObjectInProcess() {
    if (curatorInProcessDeliveries.length > 0 && myInProcessDeliveries.length > 0) {
      myInProcessDeliveries.forEach((deliveryInProcess) => {
        for (let i = 0; i < curatorInProcessDeliveries.length; i++){
          if (deliveryInProcess.id == curatorInProcessDeliveries[i].id_delivery) {
            deliveryInProcess.delivery_assignments = curatorInProcessDeliveries[i].volunteers
            setInProcessDeliveriesAssignmentsSuccess(true)
          }
        }
      })
    }
  }
/////переносим deliveryAssignments  (записавшихся волонтеров на доставку) в полный объект доставки
  function assignVolunteersToFullDeliveryObjectActive() {
    if (curatorActiveDeliveries.length > 0 && myCurrentActiveDeliveries.length > 0) {
      myCurrentActiveDeliveries.forEach((delivery) => {
        for (let i = 0; i < curatorActiveDeliveries.length; i++){
          if (delivery.id == curatorActiveDeliveries[i].id_delivery) {
            delivery.delivery_assignments = curatorActiveDeliveries[i].volunteers
            setActiveDeliveriesAssignmentsSuccess(true)
          }
        }
      })
    }
  }
/////переносим deliveryAssignments (записавшихся волонтеров на доставку) в полный объект доставки
  useEffect(() => {
    assignVolunteersToFullDeliveryObjectInProcess()
 }, [myInProcessDeliveries,curatorInProcessDeliveries]);

 /////переносим deliveryAssignments  (записавшихся волонтеров на доставку) в полный объект доставки
 useEffect(() => {
   assignVolunteersToFullDeliveryObjectActive()
 }, [myCurrentActiveDeliveries, curatorActiveDeliveries]);
  
  /////////////////////////////////////////////////////////////
  //// 4. запрашиваем все маршрутные листы по отдельности
  function requestEachMyActiveRouteSheet(deliveries: TCuratorDelivery[], setStateAction:React.Dispatch<React.SetStateAction<TRouteSheetIndividual[]>>) {
    let routeSheets: TRouteSheetIndividual[] = [];
    if (token) {
      deliveries.forEach(d => {
        let oneDeliveryRouteSheets = d.id_route_sheet;
        let routesArr: IRouteSheet[] = [];
        Promise.allSettled(oneDeliveryRouteSheets.map(routeS => getRouteSheetById(token, routeS)))
          .then(responses => responses.forEach((result, num) => {
            if (result.status == "fulfilled") {
              routesArr.push(result.value)
            }
            if (result.status == "rejected") {
              console.log(`${num} delivery was not fetched`)
            }
          })).finally(() => { routeSheets.push({ deliveryId: d.id_delivery, routeSheets: routesArr }); setStateAction(routeSheets)}
          )
      })
    }
  }
///// 5.  записываем все маршрутные листы в соотвевтвующею доставку
  function assignRouteSheetsToFullDeliveryObjectActive() {
    if (myCurrentActiveDeliveries.length > 0 && activeRouteSheetWithDeliveryId.length > 0 ) {
      myCurrentActiveDeliveries.forEach((delivery) => {
        for (let i = 0; i < activeRouteSheetWithDeliveryId.length; i++){
          if (delivery.id == activeRouteSheetWithDeliveryId[i].deliveryId) {
            delivery.delivery_routeSheets = activeRouteSheetWithDeliveryId[i].routeSheets
            setAssignRouteSheetsToFullDeliveryObjectActiveSuccess(true)
          }
        }
      })
    }
  }

 /////переносим deliveruAssignments в полный объект доставки
 useEffect(() => {
  assignRouteSheetsToFullDeliveryObjectActive()
 }, [myCurrentActiveDeliveries, activeRouteSheetWithDeliveryId]);
  
 function assignRouteSheetsToFullDeliveryObjectInProcess() {
  if (myInProcessDeliveries.length > 0 && inProcessRouteSheetWithDeliveryId.length > 0 ) {
    myInProcessDeliveries.forEach((delivery) => {
      for (let i = 0; i < inProcessRouteSheetWithDeliveryId.length; i++){
        if (delivery.id == inProcessRouteSheetWithDeliveryId[i].deliveryId) {
          delivery.delivery_routeSheets = inProcessRouteSheetWithDeliveryId[i].routeSheets
          setAssignRouteSheetsToFullDeliveryObjectInProcessSuccess(true)
        }
      }
    })
  }
}
/////переносим полный объект маршрутных листов в полный объект доставки
useEffect(() => {
  assignRouteSheetsToFullDeliveryObjectInProcess()
}, [myInProcessDeliveries, inProcessRouteSheetWithDeliveryId]);
  
  ///// 6. отправляю полный обхъект доставок в NearestDeliveryCurator с соответствующим статусом 

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1  dark:bg-light-gray-black ">
      {myInProcessDeliveries.length > 0 && inProcessDeliveriesAssignmentsSuccess && assignRouteSheetsToFullDeliveryObjectInProcessSuccess ?(
        myInProcessDeliveries.sort((a, b) => { return +(new Date(a.date)) - +(new Date(b.date)) }).map((del, index) => {
            return(<div key={index}>
              <NearestDeliveryCurator delivery={del} deliveryFilter='active' />
            </div>)
        })
      ) : ("")}
      {myCurrentActiveDeliveries.length > 0 && activeDeliveriesAssignmentsSuccess && assignRouteSheetsToFullDeliveryObjectActiveSuccess ? (
        myCurrentActiveDeliveries.sort((a, b) => { return +(new Date(a.date)) - +(new Date(b.date)) }).map((del, index) => {
            return (<div key={index}>
            <NearestDeliveryCurator delivery={del} deliveryFilter='nearest' />
          </div>)
        })
      ) : ("")}
 
    </div>
  );
};

export default CuratorTab;
