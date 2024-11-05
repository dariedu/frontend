import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  getAllDeliveries,
  getCuratorDeliveries,
  type IDelivery,
} from '../api/apiDeliveries';
import { UserContext } from './UserContext';
import { isSameDay, parseISO, isAfter } from 'date-fns';

interface IDeliveryContext {
  deliveries: IDelivery[];
  nearestDelivery: IDelivery | null;
  isLoading: boolean;
  error: string | null;
  fetchAllDeliveries: () => Promise<void>;
  fetchCuratorDeliveries: () => Promise<void>;
  updateDeliveryStatus: (id: number, isActive: boolean) => void;
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [],
  nearestDelivery: null,
  isLoading: false,
  error: null,
  fetchAllDeliveries: async () => {},
  fetchCuratorDeliveries: async () => {},
  updateDeliveryStatus: () => {},
};

export const DeliveryContext = createContext<IDeliveryContext>(
  defaultDeliveryContext,
);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedCurator, setHasFetchedCurator] = useState<boolean>(false);
  const [hasFetchedAll, setHasFetchedAll] = useState<boolean>(false);

  const userValue = useContext(UserContext);
  const token = userValue.token;

  const fetchAllDeliveries = useCallback(async () => {
    if (!token || hasFetchedAll) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllDeliveries(token);
      setDeliveries(response ?? []); // Устанавливаем пустой массив, если ответ `null` или `undefined`
      setHasFetchedAll(true);
    } catch (err) {
      console.error('Failed to fetch all deliveries:', err);
      setError('Failed to fetch deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [token, hasFetchedAll]);

  const fetchCuratorDeliveries = useCallback(async () => {
    if (!token || hasFetchedCurator) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCuratorDeliveries(token);
      setDeliveries(response ?? []); // Устанавливаем пустой массив, если ответ `null` или `undefined`
      setHasFetchedCurator(true);
    } catch (err) {
      console.error('Failed to fetch curator deliveries:', err);
      setError('Failed to fetch deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [token, hasFetchedCurator]);

  const updateDeliveryStatus = useCallback((id: number, isActive: boolean) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === id ? { ...delivery, is_active: isActive } : delivery,
      ),
    );
  }, []);

  const nearestDelivery = useMemo(() => {
    if (!Array.isArray(deliveries) || deliveries.length === 0) return null;
    const today = new Date();
    return (
      deliveries
        .filter(
          d =>
            isAfter(parseISO(d.date), today) ||
            isSameDay(parseISO(d.date), today),
        )
        .sort(
          (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
        )[0] || null
    );
  }, [deliveries]);

  useEffect(() => {
    fetchAllDeliveries();
    fetchCuratorDeliveries();
  }, [token]);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        nearestDelivery,
        isLoading,
        error,
        fetchAllDeliveries,
        fetchCuratorDeliveries,
        updateDeliveryStatus,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
