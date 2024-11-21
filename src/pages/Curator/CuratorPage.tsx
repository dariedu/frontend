import React from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
//import { DeliveryContext } from '../../core/DeliveryContext';

const CuratorPage: React.FC = () => {
  // const { fetchAllDeliveries, isLoading } = useContext(DeliveryContext);

  // useEffect(() => {
  //   fetchAllDeliveries(); // Загружаем данные о доставках только при посещении страницы куратора
  // }, []);

  // if (isLoading) {
  //   return <div>Загрузка доставок...</div>;
  // }

  return (
    <>
      <NavigationBar variant="mainScreen" title="Куратор" isVolunteer={false} />
      <TabBar userRole="curator" />
    </>
  );
};

export default CuratorPage;
