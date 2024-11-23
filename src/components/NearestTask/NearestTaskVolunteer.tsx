import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getMonthCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import CompletedDeliveryOrTaskFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { type ITask } from '../../api/apiTasks';
import Small_sms from "./../../assets/icons/small_sms.svg?react"
import Arrow_down from './../../assets/icons/arrow_down.svg?react'

interface INearestTaskProps {
  task: ITask;
  taskFilter: TTaskFilter;
  cancelFunc: (task: ITask) => {}
}

type TTaskFilter = 'nearest' | 'active' | 'completed';

const NearestTaskVolunteer: React.FC<INearestTaskProps> = ({
  task,
  cancelFunc,
  taskFilter,
}) => {
  const deliveryDate = new Date(task.start_date);

  const [fullView, setFullView] = useState(false); ////раскрываем доставку, чтобы увидеть детали
  const [isModalOpen, setIsModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке волонтера

  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =
    useState(false); ////// открываем модальное окно, чтобы подтвердить доставку



  const [isCancelDeliveryModalOpen, setIsCancelDeliveryModalOpen] =    useState(false); //// модальное окно для отмены доставки
  const [isDeliveryCancelledModalOpen, setIsDeliveryCancelledModalOpen] =
    useState(false); //// модальное окно для подтверждения отмены доставки

  //const lessThenTwoHours = (deliveryDate.valueOf() - currentDate.valueOf()) / 60000 <= 120;
  let curatorTelegramNik: string = '';
  if (task.curator.tg_username && task.curator.tg_username.length > 0) {
  curatorTelegramNik = task.curator.tg_username.includes('@')
    ? task.curator.tg_username.slice(1)
    : task.curator.tg_username;
}
  


  return (
    <>
      <div
        className={`w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
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
            <p className="btn-S-GreenInactive flex items-center justify-center dark:bg-light-gray-5 dark:text-light-gray-white">
              Завершённое
            </p>
          ) : (
            ''
          )}

          <div className="flex items-center">
            <p
              className='font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2 cursor-pointer'
              onClick={() => {fullView == true  ? setFullView(false) : setFullView(true) }}
            >
              {task.category.name}{' '}
            </p>
            {taskFilter == 'nearest' || taskFilter == 'completed' ? (
            <Arrow_down  className={`${!fullView ? 'rotate-180' : ''} stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer`}
            onClick={() => {
              fullView == true ? setFullView(false) : setFullView(true);
            }}/>
            ) : taskFilter == 'active' ? (
              <Arrow_down  className={`${!fullView ? 'rotate-180' : ''} stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer`}
              onClick={() => {
                fullView == true ? setFullView(false) : setFullView(true);
              }}/>
              ) : (
                ''
              )
            }
          </div>
        </div>
        {/* /////////////////////// */}
        { taskFilter == 'completed' ? ( '' ) : (
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
                  {task.volunteer_price} {getBallCorrectEndingName(task.volunteer_price)}
                </p>
              </div>
            </div>
        )}
        {fullView ? (
        task.curator?.name && task.curator.name.length > 0 ? (
          <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
          <div className="flex">
            {/* <img
              className="h-[32px] w-[32px] rounded-full"
              src={task.curator.photo}
            /> */}
            <div className="felx flex-col justify-center items-start ml-4">
              <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                {task.curator.name}
              </h1>
              <p className="font-gerbera-sub2 text-light-gray-2 text-start dark:text-light-gray-3">
                Куратор
              </p>
            </div>
            </div>
            {curatorTelegramNik && curatorTelegramNik.length > 0 ? (
                <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
                  <Small_sms className="w-[36px] h-[35px]"/>
                </a>     
            ) : ""}
        </div>
          ) : ""
        ): ""}
       {(taskFilter == 'active' || taskFilter == 'nearest') && fullView ? (
              <div>{task.description && task.description.length != 0 ? (
                <div className="w-[330px] h-fit min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between p-4 dark:bg-light-gray-6">
                  <div className="flex flex-col justify-start items-start font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                    Подробности
                    <p className="font-gerbera-sub2 text-light-gray-2 text-start pt-2 dark:text-light-gray-3">
                      {task.description}
                    </p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )
        }

        {fullView ? (taskFilter == 'nearest' ? (
              <button
                className="btn-B-GrayDefault  mt-[20px] dark:bg-light-gray-6 dark:text-light-gray-white"
                onClick={e => {
                  e.preventDefault();
                  setIsCancelDeliveryModalOpen(true);
                }}
              >
                Отказаться
              </button>
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
        ): ""}

        {/* /////////////////////// */}
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <CompletedDeliveryOrTaskFeedback
          onOpenChange={setIsModalOpen}
          onSubmitFidback={setIsFeedbackSubmitedModalOpen}
          volunteer={true}
          delivery={false}
          deliveryOrTaskId={task.id}
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
        isOpen={isCancelDeliveryModalOpen}
        onOpenChange={setIsCancelDeliveryModalOpen}
        onConfirm={() => {
          cancelFunc? cancelFunc(task) : ()=>{}
          //setIsDeliveryCancelledModalOpen(true);
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
    </>
  );
};

export default NearestTaskVolunteer;
