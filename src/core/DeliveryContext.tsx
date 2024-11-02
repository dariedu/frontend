import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import {getAllDeliveries, type IDelivery} from '../api/apiDeliveries';
import { UserContext } from './UserContext';

interface IDeliveryContext {
  deliveries: IDelivery[];
  isLoading: boolean;
  error: string | null;
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [],
  isLoading: false,
  error: null,
};

///создаю контекст
export const DeliveryContext = createContext<IDeliveryContext>(
  defaultDeliveryContext,
);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
 const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////////////
const userValue = useContext(UserContext);
const token = userValue.token;
  ////// используем контекст

  const fetchAllDeliveries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (token) {
        // Передаем токен в getUsers
        const response = await getAllDeliveries(token);
        
        if (response) {
          setDeliveries(response);
          console.log(response)
        } else {
          console.error('Ошибка получения доставок с сервера DaliveryContext');
          setError('Ошибка получения доставок с сервера DaliveryContext');
        }
      }
    } catch (err) {
      console.log(err, "DeliveryContext")
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllDeliveries();
  }, [token]);


  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        isLoading,
        error
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
