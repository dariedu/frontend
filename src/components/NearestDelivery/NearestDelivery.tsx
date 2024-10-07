import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
  getPersonCorrectEndingName,
} from '../helperFunctions/helperFunctions';

interface IDelivery {
  id: number;
  date: string;
  curator: {
    id: number;
    tg_id: number;
    tg_username: string;
    last_name: string;
    name: string;
    avatar: string;
  };
  price: number;
  is_free: boolean;
  is_active: boolean;
  is_completed: boolean;
  in_execution: boolean;
  volunteers_needed: number;
  volunteers_taken: number;
  delivery_assignments: string[];
  route_sheet: number;
  location: {
    id: number;
    city: {
      id: number;
      city: string;
    };
    address: string;
    link: string;
    subway: string;
    media_files: null | string;
    description: string;
  };
}

export const delivery1: IDelivery = {
  id: 1,
  date: '2024-10-17T12:00:00Z',
  curator: {
    id: 9,
    tg_id: 333,
    tg_username: '@mgdata',
    last_name: 'Фомина',
    name: 'Анна',
    avatar: '../src/assets/icons/pictureTest.jpg',
  },
  price: 5,
  is_free: true,
  is_active: true,
  is_completed: false,
  in_execution: false,
  volunteers_needed: 1,
  volunteers_taken: 3,
  delivery_assignments: [],
  route_sheet: 1,
  location: {
    id: 1,
    city: {
      id: 1,
      city: 'Москва',
    },
    address:
      'поселение Внуковское, ул. Авиаконстраукора Петькина, д.15 к1. строение 15 кв. 222',
    link: 'null',
    subway: 'Белорусская',
    media_files: null,
    description: 'Доставка милой бабуле',
  },
};

interface INearestDeliveryProps {
  delivery: IDelivery;
  volunteer: boolean;
  deliveryFilter: TDeliveryFilter;
  booked: boolean;
}

type TDeliveryFilter = "nearest" | "active";


const NearestDelivery: React.FC<INearestDeliveryProps> = ({delivery=delivery1, volunteer=true, deliveryFilter='nearest', booked=false}) => {
let deliveryDate = new Date(delivery.date)
  let curatorTelegramNik = delivery.curator.tg_username.includes("@") ? delivery.curator.tg_username.slice(1) : delivery.curator.tg_username;


  return (
    <>
      <div className="w-[362px] py-8 px-4 h-fit rounded-2xl flex flex-col mt-1 shadow-lg">
        <div className="flex justify-between w-full">
          {deliveryFilter == 'nearest' ? (
            <button
              className="btn-S-GreenDefault"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Ближайшая
            </button>
          ) : (
            <button
              className="btn-S-GreenDefault"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Активная
            </button>
          )}
          <div className="flex items-center">
            <p className="font-gerbera-sub2 text-light-gray-3 ">Доставка </p>
            <img src="../src/assets/icons/arrow_right.png" />
          </div>
        </div>
        {/* /////////////////////// */}
        <div className="flex w-fit">
          <img src="../src/assets/icons/metro_station.svg" />
          <div className="flex flex-col justify-start items-start pl-2 w-max-[290px] pt-[20px]">
            <h1 className="font-gerbera-h3 text-light-gray-8">
              Ст. {delivery.location.subway}
            </h1>
            <p className="font-gerbera-sub1 tetx-light-gray-5 text-left h-fit w-max-[290px]">
              {delivery.location.address}
            </p>
          </div>
        </div>
        {/* /////////////////////// */}
        {volunteer ? (
          <div className="flex justify-between items-center mt-[14px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-black ">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-black">
                {`${deliveryDate.getDate()}
                ${getMonthCorrectEndingName(deliveryDate)} в
                ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-black ">
                Начисление баллов
              </p>
              <p className="font-gerbera-h3 text-light-brand-green ">
                {'+'}
                {delivery.price} {getBallCorrectEndingName(delivery.price)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-[20px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-5 ">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {`${deliveryDate.getDate()}
                  ${getMonthCorrectEndingName(deliveryDate)} в
                  ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-5">Записались</p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {delivery.volunteers_taken == 0
                  ? 'Пока никто'
                  : `${delivery.volunteers_taken + ' ' + getPersonCorrectEndingName(delivery.volunteers_taken)}`}
              </p>
            </div>
          </div>
        )}

        {volunteer ? (
          <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4">
            <div className="flex">
              <img
                className="h-[32px] w-[32px] rounded-full"
                src={delivery.curator.avatar}
              />
              <div className="felx flex-col justify-center items-start ml-4">
                <h1 className="font-gerbera-h3 text-light-gray-8-text text-start">
                  {delivery.curator.name}
                </h1>
                <p className="font-gerbera-sub2 text-light-gray-2 text-start">
                  Куратор
                </p>
              </div>
            </div>
            <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
              <img
                src="../src/assets/icons/small_sms.svg"
                className="w-[36px] h-[35px]"
              />
            </a>
          </div>
        ) : (
          ''
        )}
        <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex flex-col items-start justify-center px-4">
          <h1 className="font-gerbera-h3 text-light-gray-8-text">
            Пункты маршрута
          </h1>
          <p className="font-gerbera-sub1 text-light-gray-5 mt-[6px]">
            Пункт выдачи откуда забирать{' '}
          </p>
        </div>
        {booked ? (
          <button
            className="btn-B-GrayDefault mt-[20px]"
            onClick={e => {
              e.preventDefault();
            }}
          >
            Отказаться
          </button>
        ) : (
          <button
            className="btn-B-GreenDefault mt-[20px]"
            onClick={e => {
              e.preventDefault();
            }}
          >
            Записаться
          </button>
        )}

        {/* /////////////////////// */}
      </div>
    </>
  );
};

export default NearestDelivery;
{
  delivery1;
}
