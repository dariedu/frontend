import React, { createContext, useState, ReactNode, useContext } from 'react';
import { type IDelivery } from '../api/apiDeliveries';
import { delivery1 } from '../components/DetailedInfoDeliveryTask/DetailedInfoDeliveryTask';
import { getAllDeliveries } from '../api/apiDeliveries';
import { UserContext } from './UserContext';

interface IDeliveryContext {
  deliveries: IDelivery[];
  isLoading: boolean;
  fetchDeliveries: () => Promise<void>; // добавляем fetchDeliveries в интерфейс
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [delivery1],
  isLoading: true,
  fetchDeliveries: async () => {}, // по умолчанию пустая функция
};

export const DeliveryContext = createContext<IDeliveryContext>(
  defaultDeliveryContext,
);

export const DeliveryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token: string | null = useContext(UserContext)?.token;

  const fetchDeliveries = async () => {
    if (!token) {
      console.error('Токен недоступен');
      return;
    }

    try {
      let response = await getAllDeliveries('false', 'false', token); // передаем токен
      setDeliveries(response);
      setIsLoading(false);
    } catch (e) {
      console.error('Ошибка получения доставок с сервера', e);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{ deliveries, isLoading, fetchDeliveries }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
