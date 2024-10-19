import React, { createContext, useState, ReactNode, useContext } from 'react';
import { type IDelivery } from '../api/apiDeliveries';
import { getAllDeliveries } from '../api/apiDeliveries';
import { UserContext } from './UserContext';

interface IDeliveryContext {
  deliveries: IDelivery[];
  isLoading: boolean;
  filteredDeliveries: IDelivery[]; // Добавляем фильтрованные доставки
  setFilteredDeliveriesByDate: (deliveries: IDelivery[]) => void; // Добавляем функцию для фильтрации
  fetchDeliveries: () => Promise<void>;
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [],
  isLoading: true,
  filteredDeliveries: [], // По умолчанию пустой массив
  setFilteredDeliveriesByDate: () => {}, // По умолчанию пустая функция
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
  const [isLoading, setIsLoading] = useState(true);

  const token: string | null = useContext(UserContext)?.token;

  const fetchDeliveries = async () => {
    if (!token) {
      console.error('Токен недоступен');
      return;
    }

    try {
      let response = await getAllDeliveries('false', 'false', token);
      setDeliveries(response);
      setIsLoading(false);
    } catch (e) {
      console.error('Ошибка получения доставок с сервера', e);
    }
  };

  const setFilteredDeliveriesByDate = (deliveries: IDelivery[]) => {
    setFilteredDeliveries(deliveries); // Сохраняем отфильтрованные доставки
  };

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        isLoading,
        filteredDeliveries, // Добавляем в контекст
        setFilteredDeliveriesByDate, // Добавляем функцию для фильтрации в контекст
        fetchDeliveries,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
