import React from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import TabBar from '../../components/TabBar/TabBar';

const VolunteerPage: React.FC = () => {

  return (
    <div>
      <NavigationBar variant="mainScreen" title="Волонтёр" isVolunteer={true} />
      <TabBar userRole="volunteer" />
    </div>
  );
};

export default VolunteerPage;
