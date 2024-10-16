import React from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const CuratorPage: React.FC = () => {
  return (
    <>
      {/* Передаем необходимые пропсы в NavigationBar */}
      <NavigationBar variant="mainScreen" title="Куратор" />
      <TabBar userRole="curator" />
    </>
  );
};

export default CuratorPage;
