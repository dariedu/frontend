import React, { useState } from 'react';
import { type IDelivery } from '../../../../api/apiDeliveries';
import { getBallCorrectEndingName } from '../../../helperFunctions/helperFunctions';
import { DetailedInfoDelivery } from '../../../DetailedInfoDeliveryTask/DetailedInfoDeliveryTask';
import { Modal } from '../../Modal/Modal';
import metroIcon from '../../../../assets/icons/metro_station.svg';
import onlineIcon from '../../../../assets/icons/onlineIcon.svg';

type TCardTaskProps = {
  delivery: IDelivery;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
};

const CardTask: React.FC<TCardTaskProps> = ({ delivery, switchTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Проверка на наличие даты и других необходимых данных
  const deliveryDate = delivery?.date ? new Date(delivery.date) : null;
  const hours = deliveryDate
    ? String(deliveryDate.getHours()).padStart(2, '0')
    : '--';
  const minutes = deliveryDate
    ? String(deliveryDate.getMinutes()).padStart(2, '0')
    : '--';

  // Выбор иконки в зависимости от типа доставки
  const icon = delivery?.location?.subway ? metroIcon : onlineIcon;

  return (
    <>
      <div
        className="p-4 bg-light-gray-1 rounded-[16px] shadow w-[240px] h-[118px] mb-4 flex flex-col justify-between"
        onClick={() => setIsOpen(true)}
      >
        {/* Заголовок и подзаголовок */}
        <div className="flex items-center">
          <div className="flex items-start justify-center">
            <img src={icon} alt="task-icon" className="w-10 h-10" />
            <div className="flex flex-col items-start ml-2">
              <p className="font-gerbera-h3 text-light-gray-black w-40 h-[18px] overflow-hidden text-start">
                {delivery?.location?.subway
                  ? delivery.location.subway
                      .replace(/м\.\s|м\.|м\s/, '')
                      .charAt(0)
                      .toUpperCase() +
                    delivery.location.subway
                      .replace(/м\.\s|м\.|м\s/, '')
                      .slice(1)
                  : 'Онлайн'}
              </p>
              <p className="text-light-gray-black font-gerbera-sub1">
                {delivery?.location?.address || 'Адрес не указан'}
              </p>
            </div>
          </div>
        </div>

        {/* Время доставки и количество баллов */}
        <div className="flex items-center gap-[4px] mt-2">
          <div className="flex items-center justify-center bg-light-gray-white w-[54px] h-[28px] rounded-full">
            <span className="text-black font-gerbera-sub2">{`${hours}:${minutes}`}</span>
          </div>
          <div className="flex items-center justify-center bg-light-brand-green min-w-[75px] h-[28px] rounded-full">
            <span className="text-light-gray-white font-gerbera-sub2">
              + {delivery?.price || 0}{' '}
              {getBallCorrectEndingName(delivery?.price || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Модальное окно с подробной информацией */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        {delivery ? (
          <DetailedInfoDelivery
            delivery={delivery}
            switchTab={switchTab}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            getDelivery={function (): {} {
              throw new Error('Function not implemented.');
            }}
            stringForModal={''}
            takeDeliverySuccess={false}
            setTakeDeliverySuccess={function (): void {
              throw new Error('Function not implemented.');
            }}
            canBook={false}
          />
        ) : (
          <p>Детальная информация недоступна</p>
        )}
      </Modal>
    </>
  );
};

export default CardTask;
