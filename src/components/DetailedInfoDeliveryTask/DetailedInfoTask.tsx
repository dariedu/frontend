import React from 'react';
import {
  getMonthCorrectEndingName,
  getBallCorrectEndingName,
  //getMetroCorrectName,
} from '../helperFunctions/helperFunctions';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { ITask } from '../../api/apiTasks';




type TDetailedInfoTaskProps = {
  task: ITask;
  isOpen: boolean;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  getTask: (delivery: ITask) =>{}
  stringForModal: string
  takeTaskSuccess: boolean
  setTakeTaskSuccess:React.Dispatch<React.SetStateAction<boolean>>
};

const DetailedInfoTask: React.FC<TDetailedInfoTaskProps> = ({
  task,
  isOpen,
  onOpenChange,
  switchTab,
  getTask,
  stringForModal,
  takeTaskSuccess,
  setTakeTaskSuccess
}) => {


 ///// работаем с датой //////////////
 const taskStartDate = new Date(task.start_date);
 const startDay = taskStartDate.getDate();
 const startMonth = taskStartDate.toLocaleDateString("RU", {month:"short"});
 
 const hours = taskStartDate ? String(taskStartDate.getHours()).padStart(2, '0') : '--';
 const minutes = taskStartDate ? String(taskStartDate.getMinutes()).padStart(2, '0') : '--';
 
 const taskEndDate = new Date(task.end_date);
 const endDay = taskEndDate.getDate();
 const endMonth = taskEndDate.toLocaleDateString("RU", {month:"short"})

  let dateString: string;
  let period: boolean;
  if (startDay == endDay && startMonth == endMonth) {
    period = false;
   dateString = `${startDay} ${getMonthCorrectEndingName(taskStartDate)} в ${hours}:${minutes}`
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <div
          className="w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between w-full">
            <div
              className={'flex items-start'}
            >
              <img
                src={'../src/assets/icons/onlineIcon.svg'}
              />
              <div className="flex flex-col justify-center items-start pl-2 max-w-[170px]">
                <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                {task.name.slice(0, 1).toLocaleUpperCase()+task.name.slice(1)}
                </h1>
                  <p className="font-gerbera-sub1 text-light-gray-5 text-left h-fit max-w-[170px] dark:text-light-gray-3">
                    Онлайн
                  </p>
  
              </div>
            </div>
          </div>
          {/* /////////////////////// */}
          <div className="flex justify-between items-center mt-[14px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                {period ? "Период выполнения" : "Время начала" } 
              </p>
              <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
              {dateString}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-black dark:text-light-gray-3">
                Начисление баллов
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                {'+ '}
                {task.volunteer_price} {getBallCorrectEndingName(task.volunteer_price)}
              </p>
            </div>
          </div>
          {task.curator.name && task.curator.name.length > 0 ? (
          <div className="w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4">
          <div className="flex">
            {/* <img
              className="h-[32px] w-[32px] rounded-full"
              src={task.curator.photo}
            /> */}
            <div className="felx flex-col justify-center items-start ml-4">
              <h1 className="font-gerbera-h3 text-light-gray-8-text text-start">
                {task.curator.name}
              </h1>
              <p className="font-gerbera-sub2 text-light-gray-2 text-start">
                Куратор
              </p>
            </div>
          </div>
          {task.curator.tg_username && task.curator.tg_username.length > 0 ? (
           <a
            href={'https://t.me/' + task.curator?.tg_username}
            target="_blank"
          >
            <img
              src="../src/assets/icons/small_sms.svg"
              className="w-[36px] h-[35px]"
            />
          </a>
          ): ""}
         
        </div>
          ) : ''}

          {task.description && task.description.length != 0 ? (
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
          <button
              className="btn-B-GreenDefault  mt-[20px]"
              onClick={e => {
                e.preventDefault();
                getTask(task)
              }}
            >
              Записаться
            </button>
        </div>
      </Modal>
      <ConfirmModal
        isOpen={takeTaskSuccess}
        onOpenChange={setTakeTaskSuccess}
        onConfirm={() => {
          setTakeTaskSuccess(false);
        }}
        onCancel={() => {
          switchTab('tab2');
          setTakeTaskSuccess(false);
        }}
        title={`Доброе дело ${stringForModal} в календаре`}
        description=""
        confirmText="Ок"
        cancelText="В календарь"
        isSingleButton={false}
      />
    </>
  );
};

export {DetailedInfoTask };
