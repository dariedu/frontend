import React, { useState, useContext } from 'react';
import {
  getBallCorrectEndingName,
  // getMonthCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import CompletedDeliveryOrTaskFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { type ITask } from '../../api/apiTasks';
import Small_sms from "./../../assets/icons/small_sms.svg?react"
import Arrow_down from './../../assets/icons/arrow_down.svg?react'
import * as Avatar from '@radix-ui/react-avatar';
import { TokenContext } from '../../core/TokenContext';

interface INearestTaskProps {
  task: ITask
  taskFilter: TTaskFilter
  cancelFunc: (task: ITask, token: string|null,
    setCancelTaskId: React.Dispatch<React.SetStateAction<number|undefined>>,
    setCancelTaskSuccessString: React.Dispatch<React.SetStateAction<string>>,
    setCancelTaskSuccess: React.Dispatch<React.SetStateAction<boolean>>,
    setCancelDeliveryFail: React.Dispatch<React.SetStateAction<boolean>>) => {}
  feedbackSubmited: boolean
  setCancelTaskId: React.Dispatch<React.SetStateAction<number | undefined>>
  setCancelTaskSuccessString: React.Dispatch<React.SetStateAction<string>>
  setCancelTaskSuccess:React.Dispatch<React.SetStateAction<boolean>>
  setCancelDeliveryFail: React.Dispatch<React.SetStateAction<boolean>>
  allTasksNotConfirmed:number[]
}

type TTaskFilter = 'nearest' | 'active' | 'completed';

const NearestTaskVolunteer: React.FC<INearestTaskProps> = ({
  task,
  cancelFunc,
  taskFilter,
  setCancelTaskId,
  setCancelTaskSuccessString,
  feedbackSubmited,
  setCancelTaskSuccess,
  setCancelDeliveryFail,
  allTasksNotConfirmed
}) => {
  // const taskDate = new Date(Date.parse(task.start_date) + 180 * 60000);

  const [isFeedbackSubmited, setIsFeedbackSubmited] = useState(feedbackSubmited)
  const [fullView, setFullView] = useState(false); ////раскрываем доставку, чтобы увидеть детали
  const [isModalOpen, setIsModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке волонтера

  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =  useState(false); ////// 



  const [isCancelDeliveryModalOpen, setIsCancelDeliveryModalOpen] =    useState(false); //// модальное окно для отмены доставки
  const [isDeliveryCancelledModalOpen, setIsDeliveryCancelledModalOpen] =
    useState(false); //// модальное окно для подтверждения отмены доставки

  
    const { token } = useContext(TokenContext);
  
  //const lessThenTwoHours = (deliveryDate.valueOf() - currentDate.valueOf()) / 60000 <= 120;
  let curatorTelegramNik: string = '';
  if (task.curator.tg_username && task.curator.tg_username.length > 0) {
  curatorTelegramNik = task.curator.tg_username.includes('@')
    ? task.curator.tg_username.slice(1)
    : task.curator.tg_username;
}
  
   ///// работаем с датой //////////////
 const taskStartDate = new Date(Date.parse(task.start_date) + 180*60000);
 const startDay = taskStartDate.getUTCDate();
 const startMonth = taskStartDate.toLocaleDateString("RU", {month:"short"});
 
 const hours = taskStartDate ? String(taskStartDate.getUTCHours()).padStart(2, '0') : '--';
 const minutes = taskStartDate ? String(taskStartDate.getUTCMinutes()).padStart(2, '0') : '--';
 
 const taskEndDate = new Date(Date.parse(task.end_date) + 180* 60000);
 const endDay = taskEndDate.getUTCDate();
 const endMonth = taskEndDate.toLocaleDateString("RU", {month:"short"})

  let dateString: string;
  let period: boolean;
  if (startDay == endDay && startMonth == endMonth) {
    period = false;
   dateString = `${startDay} ${taskEndDate.toLocaleDateString("RU", {month:"short"})} в ${hours}:${minutes}`
  } else {
    period = true
    if (startMonth == endMonth) {
       dateString = `${startDay} - ${endDay} ${endMonth}`
    } else {
       dateString = `${startDay} ${startMonth} - ${endDay} ${endMonth}`
    }
 }
 ///// работаем с датой //////////////

  return (
    <>
      <div
        className={`w-full max-w-[500px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
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
            <div className="flex justify-bcenter items-center mt-[14px] space-x-2">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-3 dark:bg-light-gray-6">
              <p className="font-gerbera-sub3 text-light-gray-4 dark:text-light-gray-3">
                {period ? "Даты" : "Время начала" } 
              </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                 {dateString}
                </p>
              </div>
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start box-border min-w-[161px] w-[50%] h-[62px] p-3 dark:bg-light-gray-6">
                <p className="font-gerbera-sub3 text-light-gray-4 dark:text-light-gray-3">
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
          <div className="w-full box-border h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
              <div className="flex">
              <Avatar.Root className=" h-[32px] w-[32px] min-h-[32px] min-w-[32px] inline-flex items-center justify-center  bg-light-gray-white dark:bg-light-gray-8-text rounded-full">
              <Avatar.Image
                src={task.curator.photo}
                alt="Avatar"
                className="h-[32px] w-[32px] min-h-[32px] min-w-[32px] object-cover rounded-full cursor-pointer"
              />
              <Avatar.Fallback
                className="text-black dark:text-white "
              >
                {task.curator.name ? task.curator.name[0] : 'A'}
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="felx flex-col justify-center items-start ml-4 ">
              <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                {task.curator.name}
              </h1>
              <p className="font-gerbera-sub3 text-light-gray-4 text-start dark:text-light-gray-3">
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
                <div className="w-full  h-fit min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between p-4 dark:bg-light-gray-6">
                  <div className="flex flex-col justify-start items-start font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                    Подробности
                    <p className="font-gerbera-sub2 text-light-gray-4 dark:text-light-gray-3 text-start pt-2 ">
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

        {fullView ? (taskFilter == 'nearest' && allTasksNotConfirmed.includes(task.id) ? (
              <button
                className="btn-B-GrayDefault  mt-[20px] dark:bg-light-gray-6 dark:text-light-gray-white self-center"
                onClick={e => {
                  e.preventDefault();
                  setIsCancelDeliveryModalOpen(true);
                }}
              >
                Отказаться
              </button>
        ) : taskFilter == 'completed' && (
            <>
               <div className="flex justify-bcenter items-center mt-[14px] space-x-2">
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-3 dark:bg-light-gray-6">
              <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
                {period ? "Даты" : "Время начала" } 
              </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                 {dateString}
                </p>
              </div>
              <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start box-border min-w-[161px] w-[50%] h-[62px] p-3 dark:bg-light-gray-6">
                <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
                  Начисление баллов
                </p>
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                  {'+'}
                  {task.volunteer_price} {getBallCorrectEndingName(task.volunteer_price)}
                </p>
              </div>
            </div>
              { feedbackSubmited ? (
          <button
              className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Oтзыв отправлен
            </button>) : taskFilter == 'completed' && isFeedbackSubmited ? (
             <button
             className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
             onClick={e => {
               e.preventDefault();
             }}
           >
             Oтзыв отправлен
           </button>
            ): (
            <button
              className="btn-B-GreenDefault  mt-[20px] self-center"
              onClick={e => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Поделиться впечатлениями
            </button>
          ) }
            </>
        )  
        ): ""}

        {/* /////////////////////// */}
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <CompletedDeliveryOrTaskFeedback
          onOpenChange={setIsModalOpen}
          onSubmitFidback={() => { setIsFeedbackSubmitedModalOpen(true); setIsFeedbackSubmited(true) }}
          volunteer={true}
          delivery={false}
          deliveryOrTaskId={task.id}
        />
      </Modal>
      <ConfirmModal
        isOpen={isFeedbackSubmitedModalOpen}
        onOpenChange={setIsFeedbackSubmitedModalOpen}
        onConfirm={() => {setIsFeedbackSubmitedModalOpen(false)}}
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
          cancelFunc? cancelFunc(task, token, setCancelTaskId, setCancelTaskSuccessString, setCancelTaskSuccess, setCancelDeliveryFail) : ()=>{}
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
