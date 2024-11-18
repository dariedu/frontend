import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../core/UserContext';
import { type IRouteSheet, type TRouteSheetIndividual, getRouteSheetById } from '../../../api/routeSheetApi';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries, getDeliveryById, IDelivery } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';



const Curator: React.FC = () => {
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
  //const [routeSheetsMy, setRouteSheetsMy] = useState<IRouteSheet[]>([]);
  const [curatorActiveDeliveries, setCuratorActiveDeliveries] = useState<TCuratorDelivery[]>([])
  const [myCurrentActiveDeliveries, setMyCurrentActiveDeliveries] = useState<IDeliveryWithRouteSheets[]>([]) ///основной объект активной доставки
  const [activeDeliveriesAssignmentsSuccess, setActiveDeliveriesAssignmentsSuccess] = useState(false);
  const [activeRouteSheetWithDeliveryId, setActiveRouteSheetWithDeliveryId] = useState<TRouteSheetIndividual[]>([])
  const[assignRouteSheetsToFullDeliveryObjectActiveSuccess, setAssignRouteSheetsToFullDeliveryObjectActiveSuccess] = useState(false);
  // ////////////////////////////
  const [curatorInProcessDeliveries, setCuratorInProcessDeliveries] = useState<TCuratorDelivery[]>([])
  const [myInProcessDeliveries, setMyInProcessDeliveries] = useState<IDeliveryWithRouteSheets[]>([]) ///основной объект активной в процессе выполнения доставки
  const [inProcessDeliveriesAssignmentsSuccess, setInProcessDeliveriesAssignmentsSuccess] = useState(false)
  const [inProcessRouteSheetWithDeliveryId, setInProcessRouteSheetWithDeliveryId] = useState<TRouteSheetIndividual[]>([])
  ////// используем контекст юзера
    const userValue = useContext(UserContext);
    const token = userValue.token;
   ////// используем контекст


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
  
useEffect(()=> {console.log(activeRouteSheetWithDeliveryId, "activeRouteSheetWithDeliveryId")}, [activeRouteSheetWithDeliveryId])
//// запрашиваем кураторские доставки и берем активные и в процессе исполнения
async function getMyCuratorDeliveries() {
  const activeDeliveries: TCuratorDelivery[] = [];
  const inProcessDeliveries: TCuratorDelivery[] = [];
  try {
     if (token) {
       let result: ICuratorDeliveries = await getCuratorDeliveries(token);
       if (result) { 
         result['активные доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
         requestEachMyNearestDelivery(activeDeliveries)/// запрашиваем полный объект доставки
         requestEachMyActiveRouteSheet(activeDeliveries, setActiveRouteSheetWithDeliveryId)
         setCuratorActiveDeliveries(activeDeliveries)/// запоминаем результат
        ////////////////////////
         result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i) });
         requestEachMyInProcessDelivery(inProcessDeliveries)/// запрашиваем полный объект доставки
         setCuratorInProcessDeliveries(inProcessDeliveries)/// запоминаем результат
         requestEachMyActiveRouteSheet(inProcessDeliveries, setInProcessRouteSheetWithDeliveryId)
        //requestEachMyRouteSheet(inProcessDeliveries)
         /////////////////////
         console.log(result, 'getMyCuratorDeliveries()')
       }
  }
  } catch (err) {
    console.log(err, "getMyCuratorDeliveries CuratorPage fail")
  }
}


 
    useEffect(() => {
      //getMyRounteSheets()
   getMyCuratorDeliveries()
 }, [])
  
    
  function requestEachMyNearestDelivery(deliveries: TCuratorDelivery[]) { 
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
    })).finally(() => { setMyCurrentActiveDeliveries(requestedDeliveries)}
    )
 }
  }
      
  function requestEachMyInProcessDelivery(deliveries: TCuratorDelivery[]) { 
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
    })).finally(() => { setMyInProcessDeliveries(requestedDeliveries)}
    )
 }
  }


/////переносим deliveruAssignments в полный объект доставки
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
/////переносим deliveruAssignments в полный объект доставки
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
/////переносим deliveruAssignments в полный объект доставки
  useEffect(() => {
    assignVolunteersToFullDeliveryObjectInProcess()
 }, [myInProcessDeliveries,curatorInProcessDeliveries]);

 /////переносим deliveruAssignments в полный объект доставки
 useEffect(() => {
   assignVolunteersToFullDeliveryObjectActive()
 }, [myCurrentActiveDeliveries, curatorActiveDeliveries]);
  
  
  /////переносим deliveruAssignments в полный объект доставки
  // function assignRouteSheetsToFullDeliveryObjectInProcess() {
  //   if (curatorInProcessDeliveries.length > 0 && myInProcessDeliveries.length > 0) {
  //     myInProcessDeliveries.forEach((deliveryInProcess) => {
  //       for (let i = 0; i < curatorInProcessDeliveries.length; i++){
  //         if (deliveryInProcess.id == curatorInProcessDeliveries[i].id_delivery) {
  //           deliveryInProcess.delivery_assignments = curatorInProcessDeliveries[i].volunteers
  //           setInProcessDeliveriesAssignmentsSuccess(true)
  //         }
  //       }
  //     })
  //   }
  // }


/////переносим deliveruAssignments в полный объект доставки
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
//   useEffect(() => {
//     assignVolunteersToFullDeliveryObjectInProcess()
//  }, [myInProcessDeliveries,curatorInProcessDeliveries]);

 /////переносим deliveruAssignments в полный объект доставки
 useEffect(() => {
  assignRouteSheetsToFullDeliveryObjectActive()
 }, [myCurrentActiveDeliveries, activeRouteSheetWithDeliveryId]);
  
  


  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1  dark:bg-light-gray-black ">

      {myInProcessDeliveries.length > 0 && inProcessDeliveriesAssignmentsSuccess ?(
        myInProcessDeliveries.sort((a, b) => { return +(new Date(a.date)) - +(new Date(b.date)) }).map((del, index) => {
          //let routeSheets = inProcessRouteSheetWithDeliveryId[index].routeSheets; 
          // for (let y = 0; y < inProcessRouteSheetWithDeliveryId.length; y++){
          //   if (inProcessRouteSheetWithDeliveryId[y].deliveryId = del.id) {
          //     routeSheets = inProcessRouteSheetWithDeliveryId[y].routeSheets
          //   }
          // }
          
            return(<div key={index}>
              <NearestDeliveryCurator delivery={del} deliveryFilter='active' />
            </div>)
        })
      ) : ("")}
      {myCurrentActiveDeliveries.length > 0 && activeDeliveriesAssignmentsSuccess && assignRouteSheetsToFullDeliveryObjectActiveSuccess? (
        myCurrentActiveDeliveries.sort((a, b) => { return +(new Date(a.date)) - +(new Date(b.date)) }).map((del, index) => {
            return (<div key={index}>
            <NearestDeliveryCurator delivery={del} deliveryFilter='nearest' />
          </div>)
        })
      ) : ("")}
    </div>
  );
};

export default Curator;
