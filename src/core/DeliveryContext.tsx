import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { type IDelivery } from '../api/apiDeliveries';
import { getAllDeliveries } from '../api/apiDeliveries';
import { UserContext } from './UserContext';

interface IDeliveryContext {
  deliveries: IDelivery[];
  isLoading: boolean;
  error: string | null;
  filteredDeliveries: IDelivery[];
  setFilteredDeliveriesByDate: (deliveries: IDelivery[]) => void;
  fetchDeliveries: () => Promise<void>;
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [],
  isLoading: false,
  error: null,
  filteredDeliveries: [],
  setFilteredDeliveriesByDate: () => {},
  fetchDeliveries: async () => {},
};

export const DeliveryContext = createContext<IDeliveryContext>(
  defaultDeliveryContext,
);

export const DeliveryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    token,
    isLoading: isUserLoading,
    error: userError,
  } = useContext(UserContext);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllDeliveries('false', 'false', token!);
      setDeliveries(response);
    } catch (e: any) {
      console.error('Ошибка получения доставок с сервера', e);
      setError('Ошибка получения доставок с сервера');
      setDeliveries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const setFilteredDeliveriesByDate = (deliveries: IDelivery[]) => {
    setFilteredDeliveries(deliveries);
  };

  useEffect(() => {
    if (!isUserLoading && token) {
      fetchDeliveries();
    }
  }, [isUserLoading, token]);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        isLoading,
        error,
        filteredDeliveries,
        setFilteredDeliveriesByDate,
        fetchDeliveries,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
