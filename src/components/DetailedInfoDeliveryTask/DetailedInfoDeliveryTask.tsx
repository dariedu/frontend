import React, { useState} from 'react';
import {
  getMonthCorrectEndingName,
  getBallCorrectEndingName,
  getMetroCorrectName,
} from '../helperFunctions/helperFunctions';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { IDelivery } from '../../api/apiDeliveries';
//import { ITask } from '../../api/apiTasks';
//import { UserContext } from '../../core/UserContext';



type TDetailedInfoDelivery = {
  delivery: IDelivery
  canBook:boolean
  isOpen: boolean
  switchTab: React.Dispatch<React.SetStateAction<string>>
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  getDelivery: (delivery: IDelivery) =>{}
  stringForModal: string
  takeDeliverySuccess: boolean
  setTakeDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>
};

const DetailedInfoDelivery: React.FC<TDetailedInfoDelivery> = ({
  delivery,
  canBook,
  isOpen,
  onOpenChange,
  switchTab,
  getDelivery,
  stringForModal,
  takeDeliverySuccess,
  setTakeDeliverySuccess
}) => {

  //const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);

  const deliveryDate = new Date(delivery.date);

  let curatorTelegramNik = delivery.curator.tg_username;
  if (delivery.curator.tg_username && delivery.curator.tg_username.length != 0) {
    curatorTelegramNik = delivery.curator.tg_username.includes('@') ? delivery.curator.tg_username.slice(1) :delivery.curator.tg_username;
  }
  



  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <>
          <div
            className="w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between w-full">
              <div className="flex items-start">
                <div className="flex w-fit items-start">
                  <img src="../src/assets/icons/metro_station.svg" />
                  <div className="flex flex-col justify-center items-start pl-2 w-max-[290px]">
                    <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                      {getMetroCorrectName(delivery.location.subway)}
                    </h1>
                    <p className="font-gerbera-sub1 tetx-light-gray-5 text-left h-fit w-[230px] dark:text-light-gray-3">
                      {delivery.location.address}
                    </p>
                  </div>
                </div>
                <p className="font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4">
                  Доставка{' '}
                </p>
              </div>
            </div>

            {/* /////////////////////// */}
            <div className="flex justify-between items-center mt-[14px]">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
                <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                  Время начала
                </p>
                <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
                  {`${deliveryDate.getDate()}
              ${getMonthCorrectEndingName(deliveryDate)} в
              ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
                </p>
              </div>
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
                <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                  Начисление баллов
                </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                  {'+'}
                  {delivery.price} {getBallCorrectEndingName(delivery.price)}
                </p>
              </div>
            </div>
            {/* /////////////////////// */}
            <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
              <div className="flex">
                {/* <img
                  className="h-[32px] w-[32px] rounded-full"
                  src={delivery.curator.photo}
                /> */}
                <div className="felx flex-col justify-center items-start ml-4">
                  <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                    {delivery.curator.name}
                  </h1>
                  <p className="font-gerbera-sub2 text-light-gray-2 text-start dark:text-light-gray-3">
                    Куратор
                  </p>
                </div>
              </div>
              <a
                href={'https://t.me/' + curatorTelegramNik}
                target="_blank"
              >
                <img
                  src="../src/assets/icons/small_sms.svg"
                  className="w-[36px] h-[35px]"
                />
              </a>
            </div>
            {/* /////////////////////// */}
            {delivery.location.description &&
            delivery.location.description.length != 0 ? (
              <div className="w-[330px] min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex flex-col h-fit items-start justify-start p-4">
                <p className="font-gerbera-h3 text-light-gray-8-text text-start">
                  Подробности
                </p>
                <p className="font-gerbera-sub1 text-light-gray-5 mt-[6px] text-start">
                  {delivery.location.description}
                </p>
              </div>
            ) : (
              ''
            )}

            {/* ///////!delivery.is_free || ///////// */}
            {!canBook? (
              <button
                className="btn-B-WhiteDefault  mt-[20px] dark:bg-light-gray-6 dark:text-light-brand-green"
                onClick={e => {
                  e.preventDefault();
                  onOpenChange(false);
                }}
              >
                Вы уже записались
              </button>
            ) : !delivery.is_free ? (
              <button
              className="btn-B-GreenInactive  mt-[20px] dark:bg-light-gray-6 dark:text-light-brand-green"
              onClick={e => {
                e.preventDefault();
                onOpenChange(false);
              }}
            >
              Нет мест
            </button>
            ) : (
              <button
                className="btn-B-GreenDefault  mt-[20px]"
                onClick={e => {
                  e.preventDefault();
                  getDelivery(delivery)
                }}
              >
                Записаться
              </button>
            )}
          </div>
        </>
      </Modal>
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* Добавить опцию что-то пошло не так, попробуйте позже */}
      {/* заменить кнопку записаться на вы уже записались!!!! в основном окне */}
      <ConfirmModal
        isOpen={takeDeliverySuccess}
        onOpenChange={setTakeDeliverySuccess}
        onConfirm={() => {
          setTakeDeliverySuccess(false);
        }}
        onCancel={() => {
          switchTab('tab2');
          setTakeDeliverySuccess(false);
        }}
        title={`Доставка ${stringForModal} в календаре `}
        description=""
        confirmText="Ок"
        cancelText="В календарь"
        isSingleButton={false}
      />
    </>
  );
};

interface ITask {
  id: number;
  category: string;
  name: string;
  price: number;
  description?: string;
  start_date: Date;
  end_date: Date;
  volunteers_needed: number;
  volunteers_taken: number;
  is_active: boolean;
  is_completed: boolean;
  city: string;
  curator: {
    id: number;
    tg_id: number;
    tg_username: string;
    last_name: string;
    name: string;
    avatar: string;
  };
  volunteers: number[];
  location: {
    id: number;
    city: {
      id: number;
      city: string;
    };
    address?: string;
    subway?: string;
    media_files: null | string;
  };
}

export const task1: ITask = {
  id: 1,
  category: 'Уборка территории',
  name: 'Уборка',
  price: 5,
  description:
    'если есть описание задания, какой бы длинны оно не было оно будет отображаться в вполном виде задания, если его нет, то поле будет невидимым если есть описание задания, какой бы длинны оно не было оно будет отображаться в вполном виде задания, если его нет, то поле будет невидимым если есть описание задания, какой бы длинны оно не было оно будет отображаться в вполном виде задания, если его нет, то поле будет невидимым если есть описание задания, какой бы длинны оно не было оно будет отображаться в вполном виде задания, если его нет, то поле будет невидимым',
  start_date: new Date('2024-10-15T15:00:00Z'),
  end_date: new Date('2024-10-16T15:00:00Z'),
  volunteers_needed: 5,
  volunteers_taken: 3,
  is_active: true,
  is_completed: false,
  city: 'Москва',
  curator: {
    id: 9,
    tg_id: 333,
    tg_username: '@mgdata',
    last_name: 'Фомина',
    name: 'Анна',
    avatar: '../src/assets/icons/pictureTest.jpg',
  },
  volunteers: [],
  location: {
    id: 1,
    city: {
      id: 1,
      city: 'Москва',
    },
    address: 'jlvdsjkljjklf ;lfe,NF AONFG FFKV DLKN7896',
    subway: '',
    media_files: null,
  },
};

type TDetailedInfoTaskProps = {
  task?: ITask;
  isOpen: boolean;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const DetailedInfoTask: React.FC<TDetailedInfoTaskProps> = ({
  task = task1,
  isOpen,
  onOpenChange,
  switchTab,
}) => {
  const [isOpenModalAddToCalendar, setIsOpenModalAddToCalendar] =
    useState(false);
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const taskDate = new Date(task.start_date);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <div
          className="w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between w-full">
            <div
              className={
                task.location.address && task.location.address.length != 0
                  ? 'flex items-start'
                  : 'flex items-center'
              }
            >
              <img
                src={
                  task.location.subway && task.location.subway.length != 0
                    ? '../src/assets/icons/metro_station.svg'
                    : '../src/assets/icons/onlineIcon.svg'
                }
              />
              <div className="flex flex-col justify-center items-start pl-2 max-w-[170px]">
                <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                  {task.location.subway && task.location.subway.length != 0
                    ? task.location.subway
                    : 'Онлайн'}
                </h1>
                {task.location.address && task.location.address.length != 0 ? (
                  <p className="font-gerbera-sub1 text-light-gray-5 text-left h-fit max-w-[170px] dark:text-light-gray-3">
                    {task.location.address}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
            <p className="font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 w-fit">
              {task.category}
            </p>
          </div>
          {/* /////////////////////// */}
          <div className="flex justify-between items-center mt-[14px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
                {`${taskDate.getDate()}
              ${getMonthCorrectEndingName(taskDate)} в
              ${taskDate.getHours() < 10 ? '0' + taskDate.getHours() : taskDate.getHours()}:${taskDate.getMinutes() < 10 ? '0' + taskDate.getMinutes() : taskDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                Начисление баллов
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                {'+'}
                {task.price} {getBallCorrectEndingName(task.price)}
              </p>
            </div>
          </div>

          <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4">
            <div className="flex">
              <img
                className="h-[32px] w-[32px] rounded-full"
                src={task.curator.avatar}
              />
              <div className="felx flex-col justify-center items-start ml-4">
                <h1 className="font-gerbera-h3 text-light-gray-8-text text-start">
                  {task.curator.name}
                </h1>
                <p className="font-gerbera-sub2 text-light-gray-2 text-start">
                  Куратор
                </p>
              </div>
            </div>
            <a
              href={'https://t.me/' + task.curator.tg_username}
              target="_blank"
            >
              <img
                src="../src/assets/icons/small_sms.svg"
                className="w-[36px] h-[35px]"
              />
            </a>
          </div>

          {task.description && task.description.length != 0 ? (
            <div className="w-[330px] h-fit min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between p-4">
              <div className="flex flex-col justify-start items-start font-gerbera-h3 text-light-gray-8-text">
                Подробности
                <p className="font-gerbera-sub2 text-light-gray-2 text-start pt-2">
                  {task.description}
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
          {isAddedToCalendar ? (
            <button
              className="btn-B-GreenDefault  mt-[20px]"
              onClick={e => {
                e.preventDefault();
                onOpenChange(false);
              }}
            >
              Вы уже записались, закрыть
            </button>
          ) : (
            <button
              className="btn-B-GreenDefault  mt-[20px]"
              onClick={e => {
                e.preventDefault();
                setIsOpenModalAddToCalendar(true);
              }}
            >
              Записаться
            </button>
          )}
        </div>
      </Modal>
      <ConfirmModal
        isOpen={isOpenModalAddToCalendar}
        onOpenChange={setIsOpenModalAddToCalendar}
        onConfirm={() => {
          setIsOpenModalAddToCalendar(false);
          setIsAddedToCalendar(true);
          onOpenChange(false)
        }}
        onCancel={() => {
          switchTab('tab2');
          setIsOpenModalAddToCalendar(false);
        }}
        title="Доставка в календаре"
        description=""
        confirmText="Ок"
        cancelText="В календарь"
        isSingleButton={false}
      />
    </>
  );
};

export { DetailedInfoDelivery, DetailedInfoTask };
