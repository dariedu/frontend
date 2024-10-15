import React from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

const CuratorPage: React.FC = () => {
  const tgId = 205758925; // ID пользователя

  return (
    <>
      {/* Передаем необходимые пропсы в NavigationBar */}
      <NavigationBar variant="mainScreen" title="Куратор" tgId={tgId} />
      <TabBar userRole="curator" />
    </>
  );
};

export default CuratorPage;
