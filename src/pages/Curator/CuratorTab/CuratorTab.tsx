import React, { useState, useContext, useEffect } from 'react';
//import Search from '../../../components/Search/Search';
//import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { UserContext } from '../../../core/UserContext';
//import { IUser } from '../../../core/types';
//import { Modal } from '../../../components/ui/Modal/Modal';
import { getRouteSheets, type IRouteSheet } from '../../../api/routeSheetApi';
//import { DeliveryContext } from '../../../core/DeliveryContext';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries, getDeliveryById, IDelivery } from '../../../api/apiDeliveries';
import NearestDeliveryCurator from '../../../components/NearestDelivery/NearestDeliveryCurator';



const Curator: React.FC = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  // const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  // const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  // const handleUserClick = (user: IUser) => {
  //   setSelectedUserId(user.id); // Передаем ID выбранного пользователя
  //   setProfileModalOpen(true); // Открыть модальное окно
  // };

  // const closeProfile = () => {
  //   setSelectedUserId(null);
  //   setProfileModalOpen(false); // Закрыть модальное окно
  // };

  const [routeSheetsMy, setRouteSheetsMy] = useState<IRouteSheet[]>([]);

  /////три объекта дл доставок из активных НЕ В ПРОЦЕССЕ выполнения
  const [myCurrentActiveDelivery1, setMyCurrentActiveDelivery1] = useState<IDelivery>() ///основной объект активной доставки
  const [myCurrentActiveDelivery2, setMyCurrentActiveDelivery2] = useState<IDelivery>() ////запасной объект активной доставки
  const [myCurrentActiveDelivery3, setMyCurrentActiveDelivery3] = useState<IDelivery>() ////запасной объект активной доставки

/////три объекта дл доставок из активных в процессе выполнения
  const [myInProcessDelivery1, setMyInProcessDelivery1] = useState<IDelivery>() ///основной объект активной в процессе выполнения доставки
  const [myInProcessDelivery2, setMyInProcessDelivery2] = useState<IDelivery>() ////запасной объект активной в процессе выполнения доставки
  const [myInProcessDelivery3, setMyInProcessDelivery3] = useState<IDelivery>() ////запасной объект активной в процессе выполнения доставки
   

  ////// используем контекст юзера
    const userValue = useContext(UserContext);
    const token = userValue.token;
   ////// используем контекст


  async function getMyRounteSheets() {
    try {
       if (token) {
         let result: IRouteSheet[] = await  getRouteSheets(token);
         if (result) { 
           setRouteSheetsMy(result)
         }
    }
    } catch (err) {
      console.log(err, "getMyRounteSheets CuratorPage fail")
    }
  }


  async function getDelivery(id: number, setStateAction: React.Dispatch<React.SetStateAction<IDelivery|undefined>>, listOfVolunteers:number[]) {
    try {
       if (token) {
         let result: IDelivery = await getDeliveryById(token, id);
         if (result) { 
           result.delivery_assignments=listOfVolunteers
          setStateAction(result)
         }
    }
    } catch (err) {
      console.log(err, "getMyCuratorDeliveries CuratorPage fail")
    }
  }
//// запрашиваем все активные но еще НЕ В ПРОЦЕССЕ исполнения заявки на случай если их больше одной
  async function requestEachMyActiveDelivery(deliveries: TCuratorDelivery[]) {
    if (deliveries[0]) {
     await getDelivery(deliveries[0].id_delivery, setMyCurrentActiveDelivery1, deliveries[0].delivery_assignments) 
    }
    if (deliveries[1]) {
      await getDelivery(deliveries[1].id_delivery, setMyCurrentActiveDelivery2, deliveries[1].delivery_assignments)
    }
    if (deliveries[2]) {
    await getDelivery(deliveries[2].id_delivery, setMyCurrentActiveDelivery3, deliveries[2].delivery_assignments)
    }
  };
  //// запрашиваем все активные в процессе исполнения заявки на случай если их больше одной
  async function requestEachMyActiveInProcessDelivery(deliveries: TCuratorDelivery[]) {
    if (deliveries[0]) {
      await getDelivery(deliveries[0].id_delivery, setMyInProcessDelivery1, deliveries[0].delivery_assignments)
    }
    if (deliveries[1]) {
      await getDelivery(deliveries[1].id_delivery, setMyInProcessDelivery2, deliveries[1].delivery_assignments)
    }
    if (deliveries[2]) {
    await getDelivery(deliveries[2].id_delivery, setMyInProcessDelivery3, deliveries[2].delivery_assignments)
     }
  };


//// запрашиваем кураторские доставки и берем активные и в процессе исполнения
  async function getMyCuratorDeliveries() {
    const activeDeliveries: TCuratorDelivery[] = [];
    const inProcessDeliveries: TCuratorDelivery[] = [];
    try {
       if (token) {
         let result: ICuratorDeliveries = await getCuratorDeliveries(token);
         if (result) { 
           console.log(result, "result")
           result['активные доставки'].forEach(i=> i.delivery_assignments = [42, 39])
           result['активные доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
           requestEachMyActiveDelivery(activeDeliveries) 
          ////////////////////////
           result['выполняются доставки'].forEach(i=> i.delivery_assignments = [42, 39])
           result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i)});
           requestEachMyActiveInProcessDelivery(inProcessDeliveries)
           /////////////////////
         }
    }
    } catch (err) {
      // let deliveries =  {
      //   "выполняются доставки": [{
      //   id_delivery: 4,
      //   id_route_sheet:[1],
      //   delivery_assignments:[42, 39]
      //   }],
      //   "активные доставки": [{
      //     id_delivery: 6,
      //     id_route_sheet:[5, 4, 3],
      //     delivery_assignments:[42, 39]
      //     }]
      // }
      requestEachMyActiveDelivery([{
        id_delivery: 6,
        id_route_sheet:[5, 4, 3],
        delivery_assignments:[42, 39]
      }]) 
      requestEachMyActiveInProcessDelivery([{
        id_delivery: 4,
        id_route_sheet:[1],
        delivery_assignments:[42, 39]
        }])
      //console.log(err, "getMyCuratorDeliveries CuratorPage fail")
    }
  }

  useEffect(() => {
    getMyRounteSheets();
    getMyCuratorDeliveries()
  }, [])
  


  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1  dark:bg-light-gray-black ">
      {/* {myCurrentActiveDeliveries.map((i, index) => (<p key={index}>{i.id +" " + i.location.address}</p>))} */}
      {myCurrentActiveDelivery1 !== undefined ? (
        <NearestDeliveryCurator delivery={myCurrentActiveDelivery1} deliveryFilter='nearest' />
      ) : ("")}
      {myCurrentActiveDelivery2 !== undefined ? (
  <NearestDeliveryCurator delivery={myCurrentActiveDelivery2} deliveryFilter='nearest' />
      ) : ("")}
      {myCurrentActiveDelivery3 !== undefined ? (
   <NearestDeliveryCurator delivery={myCurrentActiveDelivery3} deliveryFilter='nearest' /> 
      ) : ("")}
       {myInProcessDelivery1!== undefined ? (
   <NearestDeliveryCurator delivery={myInProcessDelivery1} deliveryFilter='active' routeSheetsList={routeSheetsMy} /> 
      ) : ("")}
      {myInProcessDelivery2 !== undefined ? (
         <NearestDeliveryCurator delivery={myInProcessDelivery2} deliveryFilter='active' routeSheetsList={routeSheetsMy} /> 
  
      ) : ("")}
      {myInProcessDelivery3 !== undefined ? (
    <NearestDeliveryCurator delivery={myInProcessDelivery3} deliveryFilter='active' routeSheetsList={routeSheetsMy}/> 
): ("")}
      {/* <Search
        users={[currentUser]}
        onUserClick={handleUserClick}
        showSearchInput={true}
        showInfoSection={false}
      /> */}

      {/* <Modal isOpen={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
        {selectedUserId && (
          <ProfileUser currentUserId={selectedUserId} onClose={closeProfile} />
        )}
      </Modal> */}
    </div>
  );
};

export default Curator;
