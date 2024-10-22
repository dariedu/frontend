import React, { useContext, useEffect } from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { DeliveryContext } from '../../core/DeliveryContext';

const CuratorPage: React.FC = () => {
  const { fetchDeliveries, isLoading } = useContext(DeliveryContext);

  useEffect(() => {
    fetchDeliveries(); // Загружаем данные о доставках только при посещении страницы куратора
  }, []);

  if (isLoading) {
    return <div>Загрузка доставок...</div>;
  }

  return (
    <>
      <NavigationBar variant="mainScreen" title="Куратор" />
      <TabBar userRole="curator" />
    </>
  );
};

export default CuratorPage;
