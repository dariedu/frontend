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
  ICuratorDeliveries,
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
  const [hasFetchedCurator, setHasFetchedCurator] = useState<boolean>(false);

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
          //console.log(response);
        } else {
          console.error('Ошибка получения доставок с сервера DaliveryContext');
          setError('Ошибка получения доставок с сервера DaliveryContext');
        }
      }
    } catch (err) {
      console.log(err, 'DeliveryContext');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCuratorDeliveries = useCallback(async () => {
    if (!token || hasFetchedCurator) return;
    setIsLoading(true);
    setError(null);

    try {
      const response: ICuratorDeliveries = await getCuratorDeliveries(token);

      // Преобразование данных из API в формат IDelivery
      const deliveriesFromResponse: IDelivery[] = [
        ...response['выполняются доставки'],
        ...response['активные доставки'],
      ].map(item => ({
        id: item.id_delivery,
        date: '', // Замените на корректное значение даты
        curator: {
          id: 0,
          tg_id: 0,
          tg_username: '',
          last_name: '',
          name: '',
          surname: '',
          phone: '',
          photo: '',
          photo_view: null,
        },
        price: 0, // Укажите корректную цену
        is_free: false,
        is_active: true,
        location: {
          id: 0,
          address: '',
          link: '',
          subway: '',
          description: '',
          city: {
            id: 0,
            city: '',
          },
        },
        is_completed: false,
        in_execution: true,
        volunteers_needed: 0,
        volunteers_taken: 0,
        delivery_assignments: [],
      }));

      setDeliveries(deliveriesFromResponse);
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
    fetchCuratorDeliveries;
  }, [token, fetchCuratorDeliveries]);

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
