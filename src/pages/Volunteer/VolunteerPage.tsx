import React, {useContext} from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import TabBar from '../../components/TabBar/TabBar';
import { DeliveryContext } from '../../core/DeliveryContext';

const VolunteerPage: React.FC = () => {
 const { deliveries, isLoading } = useContext(DeliveryContext);


  if (isLoading) {
    return <div>Загрузка доставок...</div>;
  }

  return (
    <div>
      <NavigationBar variant="mainScreen" title="Волонтёр" />
      <TabBar userRole="volunteer" />
      <div>
        {deliveries.map(delivery => (
          <div key={delivery.id}>{delivery.location.address}</div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerPage;
