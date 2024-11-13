import React, { useState, useContext, useEffect } from 'react';
//import Search from '../../../components/Search/Search';
//import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { UserContext } from '../../../core/UserContext';
//import { IUser } from '../../../core/types';
//import { Modal } from '../../../components/ui/Modal/Modal';
import { getRouteSheets, type IRouteSheet } from '../../../api/routeSheetApi';
//import { DeliveryContext } from '../../../core/DeliveryContext';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries, getDeliveryById, IDelivery } from '../../../api/apiDeliveries';

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

  const [activeDeliveries, setActiveDeliveries] = useState<TCuratorDelivery[]>([]);
  const [inProcessDeliveries, setInProcessDeliveries] = useState<TCuratorDelivery[]>([]);

  console.log(activeDeliveries, inProcessDeliveries, 'active and in process')
  ////// используем контекст юзера, чтобы вывести количество доступных баллов
   //const { deliveries } = useContext(DeliveryContext);
    const userValue = useContext(UserContext);
    const token = userValue.token;
   ////// используем контекст
 // console.log(deliveries, 'curator deliveries')
  //console.log(deliveries, "deliveries all")

  async function getMyRounteSheets() {
    //const current: IRouteSheet[] = [];
    try {
       if (token) {
         let result: IRouteSheet[] = await  getRouteSheets(token);
         if (result) { 
     console.log(result)
         }
    }
    } catch (err) {
      console.log(err, "getMyRounteSheets CuratorPage fail")
    }
  }

  async function getMyCuratorDeliveries() {
    const activeDeliveries: TCuratorDelivery[] = [];
    const inProcessDeliveries: TCuratorDelivery[] = [];
    try {
       if (token) {
         let result: ICuratorDeliveries = await getCuratorDeliveries(token);
         if (result) { 
           result['количество активных доставок'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
           result['выполняются доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
           setActiveDeliveries(activeDeliveries)
           setInProcessDeliveries(inProcessDeliveries) 
         }
    }
    } catch (err) {
      console.log(err, "getMyCuratorDeliveries CuratorPage fail")
    }
  }

  async function getDelivery(id:number) {

    try {
       if (token) {
         let result: IDelivery = await getDeliveryById(token, id);
         if (result) { 
          console.log(result,  'getDelivery(id)')
         }
    }
    } catch (err) {
      console.log(err, "getMyCuratorDeliveries CuratorPage fail")
    }
  }

  useEffect(() => {
    getMyRounteSheets();
    getMyCuratorDeliveries()
    getDelivery(6)
  }, [])
  


  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
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
