import React from 'react';
import TabBar from '../../components/TabBar/TabBar';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

interface ICuratorPageProps {
  userRole: 'curator' | 'volunteer';
}

const CuratorPage: React.FC<ICuratorPageProps> = ({ userRole }) => {
  const variant = userRole === 'curator' ? 'mainScreen' : 'volunteerForm';

  return (
    <>
      <NavigationBar variant={variant} />{' '}
      {/* <NavigationBar variant="mainScreen" /> */}
      <TabBar userRole={userRole} />
    </>
  );
};

export default CuratorPage;
