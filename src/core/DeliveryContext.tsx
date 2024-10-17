import React, { createContext, useState, ReactNode } from 'react';
import { type IDelivery } from '../api/apiDeliveries';
import { delivery1 } from '../components/DetailedInfoDeliveryTask/DetailedInfoDeliveryTask';
import { getAllDeliveries } from '../api/apiDeliveries';

interface IDeliveryContext {
  deliveries: IDelivery[],
  isLoading: boolean
}

const defaultDeliveryContext: IDeliveryContext = {
  deliveries: [delivery1],
  isLoading: true
}

export const DeliveryContext = createContext<IDeliveryContext>(defaultDeliveryContext);

export const DeliveryProvider:React.FC<{children:ReactNode}> = ({children}) =>{
const [deliveries, setDeliveries] = useState<IDelivery[]|[]>([])
const [isLoading, setIsLoading]= useState(true)
  
  
  const fetchDeliveries = async () => {
    try {
      let response = await getAllDeliveries(false, false);
      setDeliveries(response);
      setIsLoading(false)

    } catch (e) {
      console.error("Ошибка получения доставок с сервера", e)
    }
  }
  
  fetchDeliveries()
  
  return (
    <DeliveryContext.Provider value={{ deliveries, isLoading }}>
   {children}
    </DeliveryContext.Provider>
  )
}