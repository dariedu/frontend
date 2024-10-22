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
    <div className="page-container">
      <div className="page-content">
        <NavigationBar variant="mainScreen" title="Куратор" />
      </div>
      <div className="">
        <TabBar userRole="curator" />
      </div>
    </div>
  );
};

export default CuratorPage;
