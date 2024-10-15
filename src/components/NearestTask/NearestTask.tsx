import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
  getVolunteerCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import DeliveryFeedback from '../DeliveryFeedback/DeliveryFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
//import RouteSheets from '../RouteSheets/RouteSheets';

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
    address: 'есть ли адрес',
    subway: 'Белорусская',
    media_files: null,
  },
};

interface INearestTaskProps {
  task?: ITask;
  volunteer?: boolean;
  taskFilter?: TTaskFilter;
}

type TTaskFilter = 'nearest' | 'active' | 'completed';

const NearestTask: React.FC<INearestTaskProps> = ({
  task = task1,
  volunteer = true,
  taskFilter = 'active',
  //booked = false,
}) => {
  const deliveryDate = new Date(task.start_date);
  const currentDate = new Date();

  const [fullView, setFullView] = useState(false); ////раскрываем доставку, чтобы увидеть детали
  const [fullViewCurator, setFullViewCurator] = useState(false);
  // const [currentStatus, setCurrentStatus] = useState<TTaskFilter>(taskFilter); /// статус доставки 'nearest' | 'active' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке волонтера
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] =
    useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =
    useState(false); ////// открываем модальное окно, чтобы подтвердить доставку

  const [isConfirmDeliveryModalOpen, setIsConfirmDeliveryModalOpen] =
    useState(false); ///// модальное окно для подтверждения доставки
  const [isDeliveryConfirmedModalOpen, setIsDeliveryConfirmedModalOpen] =
    useState(false); ///// модальное окно для подтверждения подтверждения доставки

  const [isCancelDeliveryModalOpen, setIsCancelDeliveryModalOpen] =
    useState(false); //// модальное окно для отмены доставки
  const [isDeliveryCancelledModalOpen, setIsDeliveryCancelledModalOpen] =
    useState(false); //// модальное окно для подтверждения отмены доставки

  const lessThenTwoHours =
    (deliveryDate.valueOf() - currentDate.valueOf()) / 60000 <= 120;

  let curatorTelegramNik = task.curator.tg_username.includes('@')
    ? task.curator.tg_username.slice(1)
    : task.curator.tg_username;

  function onSelectVolunteer(
    volunteerName: string,
    volunteerAvatar: string,
  ): void {
    console.log(volunteerName + ' ' + volunteerAvatar);
  }
  return (
    <>
      <div
        className={`${taskFilter == 'active' && volunteer ? '' : taskFilter == 'active' && !volunteer ? (fullViewCurator == true ? 'hidden' : '') : ''} w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
      >
        <div className="flex justify-between w-full">
          {taskFilter == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшее
            </p>
          ) : taskFilter == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активное
            </p>
          ) : taskFilter == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center">
              Завершённое
            </p>
          ) : (
            ''
          )}

          <div className="flex items-center">
            <p
              className={
                !volunteer && taskFilter == 'nearest'
                  ? 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2'
                  : 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2 cursor-pointer'
              }
              onClick={() => {
                volunteer
                  ? fullView == true
                    ? setFullView(false)
                    : setFullView(true)
                  : taskFilter == 'nearest'
                    ? ''
                    : fullViewCurator == true
                      ? setFullViewCurator(false)
                      : setFullViewCurator(true);
              }}
            >
              {task.category}{' '}
            </p>
            {volunteer ? (
              taskFilter == 'nearest' || taskFilter == 'completed' ? (
                <img
                  src="../src/assets/icons/arrow_down.png"
                  className={`${!fullView ? 'rotate-180' : ''} cursor-pointer`}
                  onClick={() => {
                    fullView == true ? setFullView(false) : setFullView(true);
                  }}
                />
              ) : taskFilter == 'active' ? (
                <img
                  src="../src/assets/icons/arrow_down.png"
                  className={`${!fullView ? 'rotate-180' : ''} cursor-pointer`}
                  onClick={() => {
                    fullView == true ? setFullView(false) : setFullView(true);
                  }}
                />
              ) : (
                ''
              )
            ) : taskFilter == 'active' ? (
              <img
                src="../src/assets/icons/arrow_right.png"
                className=" cursor-pointer"
                onClick={() => {
                  fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
                }}
              />
            ) : taskFilter == 'completed' ? (
              <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullViewCurator ? 'rotate-180' : ''} cursor-pointer`}
                onClick={() => {
                  fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
                }}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        {/* /////////////////////// */}
        {volunteer ? (

           <div className="flex w-fit mt-[10px]">
            <img
                src={
                  task.location.subway && task.location.subway.length != 0
                    ? '../src/assets/icons/metro_station.svg'
                    : '../src/assets/icons/onlineIcon.svg'
                }
              />
            <div className="flex flex-col justify-center items-start pl-2 max-w-[170px]">
            <h1 className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
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
        ) : (
          ''
        )}
        {/* /////////////////////// */}
        {volunteer ? (
          taskFilter == 'completed' ? (
            ''
          ) : (
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
                  {task.price} {getBallCorrectEndingName(task.price)}
                </p>
              </div>
            </div>
          )
        ) : taskFilter == 'active' ? (
          ''
        ) : taskFilter == 'nearest' ? (
          <div className="flex justify-between items-center mt-[20px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
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
                {task.volunteers_taken == 0
                  ? '0 из' + `${task.volunteers_needed}`
                  : `${task.volunteers_taken + ' из ' + `${task.volunteers_needed}` + ' ' + getVolunteerCorrectEndingName(task.volunteers_needed)}`}
              </p>
            </div>
          </div>
        ) : (
          ''
        )}

        {volunteer ? (
          taskFilter == 'completed' ? (
            fullView ? (
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
                <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
                  <img
                    src="../src/assets/icons/small_sms.svg"
                    className="w-[36px] h-[35px]"
                  />
                </a>
              </div>
            ) : (
              ''
            )
          ) : (taskFilter == 'active' || taskFilter == 'nearest') &&
            fullView ? (
            <>
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
                <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
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
            </>
          ) : (
            ''
          )
        ) : (
          ''
        )}

        {fullView ? (
          taskFilter == 'nearest' ? (
            lessThenTwoHours ? (
              <div className="w-[329px] flex justify-between">
                <button
                  className="btn-M-GreenDefault  mt-[20px]"
                  onClick={e => {
                    e.preventDefault();
                    setIsConfirmDeliveryModalOpen(true);
                  }}
                >
                  Подтвердить
                </button>
                <button
                  className="btn-M-WhiteDefault  mt-[20px]"
                  onClick={e => {
                    e.preventDefault();
                    setIsCancelDeliveryModalOpen(true);
                  }}
                >
                  Отказаться
                </button>
              </div>
            ) : (
              <button
                className="btn-B-GrayDefault  mt-[20px]"
                onClick={e => {
                  e.preventDefault();
                  setIsCancelDeliveryModalOpen(true);
                }}
              >
                Отказаться
              </button>
            )
          ) : taskFilter == 'completed' ? (
            <button
              className="btn-B-GreenDefault  mt-[20px]"
              onClick={e => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Поделиться впечатлениями
            </button>
          ) : (
            ''
          )
        ) : !volunteer ? (
          taskFilter == 'active' || taskFilter == 'completed' ? (
            ''
          ) : (
            <button
              className="btn-B-WhiteDefault mt-[20px]"
              onClick={() => setFullViewCurator(true)}
            >
              Список записавшихся волонтёров
            </button>
          )
        ) : (
          ''
        )}
        {!volunteer ? (
          taskFilter == 'completed' && fullViewCurator ? (
            <button
              className="btn-B-GreenDefault  mt-[20px]"
              onClick={e => {
                e.preventDefault();
                setIsCuratorFeedbackModalOpen(true);
              }}
            >
              Поделиться впечатлениями
            </button>
          ) : (
            ''
          )
        ) : (
          ''
        )}

        {/* /////////////////////// */}
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <DeliveryFeedback
          onOpenChange={setIsModalOpen}
          onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)}
          volunteer={true}
          delivery={false}
        />
      </Modal>
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <DeliveryFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)}
          volunteer={false}
          delivery={false}
        />
      </Modal>
      <ConfirmModal
        isOpen={isFeedbackSubmitedModalOpen}
        onOpenChange={setIsFeedbackSubmitedModalOpen}
        onConfirm={() => setIsFeedbackSubmitedModalOpen(false)}
        title={
          <p>
            Спасибо, что поделились!
            <br /> Это важно.
          </p>
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={isConfirmDeliveryModalOpen}
        onOpenChange={setIsConfirmDeliveryModalOpen}
        onConfirm={() => {
          setIsConfirmDeliveryModalOpen(false);
          setIsDeliveryConfirmedModalOpen(true);
        }}
        title={<p>Вы подтверждаете участие?</p>}
        description=""
        confirmText="Да"
        cancelText="Нет"
      />
      <ConfirmModal
        isOpen={isCancelDeliveryModalOpen}
        onOpenChange={setIsCancelDeliveryModalOpen}
        onConfirm={() => {
          setIsDeliveryCancelledModalOpen(true);
          setIsCancelDeliveryModalOpen(false);
        }}
        title={<p>Уверены, что хотите отменить участие?</p>}
        description=""
        confirmText="Да"
        cancelText="Нет"
      />
      <ConfirmModal
        isOpen={isDeliveryCancelledModalOpen}
        onOpenChange={setIsDeliveryCancelledModalOpen}
        onConfirm={() => setIsDeliveryCancelledModalOpen(false)}
        title="Участие отменено"
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={isDeliveryConfirmedModalOpen}
        onOpenChange={setIsDeliveryConfirmedModalOpen}
        onConfirm={() => setIsDeliveryConfirmedModalOpen(false)}
        title="Участие подтверждено"
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      {/* ///// раскрываем полные детали активной доставуи для куратора///// */}
      {taskFilter == 'nearest' || taskFilter == 'active' ? (
        <Modal isOpen={fullViewCurator} onOpenChange={setFullViewCurator}>
          <ListOfVolunteers
            onSelectVolunteer={onSelectVolunteer}
            onTakeRoute={() => {}}
            showActions={true}
          />
        </Modal>
      ) : (
        ''
      )}
    </>
  );
};

export default NearestTask;
