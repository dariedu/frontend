import { IBeneficiar } from './beneficiarsApi';

// Тип данных для адреса
type TAddress = {
  id: number;
  beneficiary?: IBeneficiar[];
  address: string;
  link?: string | null;
  location?: number | null;
  route_sheet?: number | null;
};

// Тип данных для запроса на создание адреса
type TAddressRequest = {
  address: string;
  link?: string | null;
  location?: number | null;
  route_sheet?: number | null;
};

// Экспортируем типы
export type { TAddress, TAddressRequest };
