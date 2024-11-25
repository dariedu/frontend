import React from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';


const CuratorPage: React.FC = () => {
  return (
    <>
      <NavigationBar variant="mainScreen" title="Куратор" isVolunteer={false} />
      <TabBar userRole="curator" />
    </>
  );
};

export default CuratorPage;
