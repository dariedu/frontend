import React from 'react';
import { type IPromotion } from './../../api/apiPromotions.ts';
import { getBallCorrectEndingName, getMonthCorrectEndingName } from '../helperFunctions/helperFunctions';

const defaultEvent: IPromotion = {
  id: 11,
  volunteers_count: 5,
  category: 'Мероприятие',
  name: 'Концерт в Филармонии',
  price: 119,
  description:
    '12 Международный фестиваль  Будущее джаза Концерт в Москве Концертный зал им Чайковского. Программа – блестящая! Виолончельный концерт Дворжака и пьесы для виолончели с оркестром Чайковского и Сен-Санса, «Испанское каприччио» Римского-Корсакова',
  start_date: new Date('2024-08-23T21:16:38Z'),
  quantity: 10,
  available_quantity: 10,
  for_curators_only: false,
  is_active: true,
  file: '',
  is_permanent: false,
  end_date: new Date('2024-10-23T03:01:38Z'),
  city: 'Москва',
  users: [0],
  ticket:
    'Мск, ул. Бобруйская д.6 к.2  вход с правой стороны от здания. Кодовое слово "Добро"',
  address: 'Мск, ул. Бобруйская д.6 к.2',
  picture: './src/assets/icons/pictureTest.jpg',
};

interface IDefaultInfoProps {
  promotion?: IPromotion;
}

 

const DetailedInfo: React.FC<IDefaultInfoProps> = ({
  promotion = defaultEvent,
}) => {

  return (
    <div className="w-[360px] flex flex-col h-fit rounded-t-2xl px-4 pt-[41px] pb-8 mt- bg-light-gray-white">
      <div className="flex align-middle justify-between">
        <div className="flex">
          {/* <div className="w-9 h-9 bg-light-brand-green rounded-full flex items-center justify-center">
            {promotion.price}
          </div> */}
          <div className="flex flex-col ml-[14px] justify-center items-start">
            <h1 className="w-[162px] h-fit font-gerbera-h3 m-0 p-0">
              {promotion.name}
            </h1>
            <p className="w-[162px] font-gerbera-sub1 text-light-gray-4 text-start">
              {promotion.address}
            </p>
          </div>
        </div>
        <p className="font-gerbera-sub2 text-light-gray-3">{promotion.category}</p>
      </div>

      <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start p-4 mt-[14px]">
        <h3 className="font-gerbera-h3 text-light-gray-black">
         Как получитьбилет?
        </h3>
        <p className="w-[296px] h-fit font-gerbera-sub1 text-start mt-[10px]">
          {promotion.ticket}
        </p>
      </div>

      {/* {promotion.file != undefined ? (
        <div className="flex w-[215px] h-[24px] justify-start mt-[14px] items-center">
          <img
            src="./src/assets/icons/catppuccin_pdf.svg"
            className="w-4 h-4"
          />
          <a
            href={promotion.file}
            className="font-gerbera-sub2 text-light-gray-4 stroke-none ml-[14px]"
          >
            билет в формате PDF
          </a>
        </div>
      ) : (
        ''
      )} */}
      <div className="flex justify-between items-center mt-[14px]">
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
          <p className="font-gerbera-sub2 text-light-gray-black ">
            Время начала
          </p>
          <p className="font-gerbera-h3 text-light-gray-black">
            {promotion.is_permanent
              ? 'В любое время'
                : `${promotion.start_date.getDate()}
            ${getMonthCorrectEndingName(promotion.start_date)} в
            ${promotion.start_date.getHours() < 10 ? '0' + promotion.start_date.getHours() : promotion.start_date.getHours()}:${promotion.start_date.getMinutes() < 10 ? '0' + promotion.start_date.getMinutes() : promotion.start_date.getMinutes()}`
          }  
            
          </p>
        </div>
        <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px]">
          <p className="font-gerbera-sub2 text-light-gray-black ">
            Списание баллов
          </p>
          <p className="font-gerbera-h3 text-light-brand-green ">
            {promotion.price} {getBallCorrectEndingName(promotion.price)} 
          </p>
        </div>
      </div>
      <div className="w-[328px] h-fit p-4 bg-light-gray-1 rounded-2xl mt-[14px] flex flex-col justify-center items-start">
        <h3 className="font-gerbera-h3 text-light-gray-black">Описание</h3>
        <p className="font-gerbera-sub1 text-light-gray-4 h-full text-start mt-[10px]">
          {promotion.description}
        </p>
      </div>
      {promotion.picture.length > 0 ? (
        <img
          className="w-[328px] h-[205px] rounded-2xl mt-[14px]"
          src={promotion.picture}
        />
      ) : (
        ''
      )}
      <div className="flex justify-between items-center mt-[14px]">
        <button
          onClick={e => {
            e.preventDefault();
          }}
          className="btn-M-GreenDefault"
        >
          Забронировать
        </button>
        <button
          onClick={e => {
            e.preventDefault();
          }}
          className="btn-M-WhiteDefault"
        >
          Отменить
        </button>
      </div>
    </div>
  );
};


export default DetailedInfo;
