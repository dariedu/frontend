import React from 'react';
import {
  getMonthCorrectEndingName,
  getBallCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { ITask } from '../../api/apiTasks';
import Small_sms from './../../assets/icons/small_sms.svg?react'
import Kind from './../../assets/icons/tasksIcons/kind.svg?react';
import * as Avatar from '@radix-ui/react-avatar';

type TDetailedInfoTaskProps = {
  tasksCateg:{icon:any, id:number, name:string}[]
  task: ITask;
  isOpen: boolean;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  getTask: (delivery: ITask) =>void
  stringForModal: string
  takeTaskSuccess: boolean
  setTakeTaskSuccess:React.Dispatch<React.SetStateAction<boolean>>
};

const DetailedInfoTask: React.FC<TDetailedInfoTaskProps> = ({
  tasksCateg,
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
 const taskStartDate = new Date(Date.parse(task.start_date) + 180);
 const startDay = taskStartDate.getUTCDate();
 const startMonth = taskStartDate.toLocaleDateString("RU", {month:"short"});
 
 const hours = taskStartDate ? String(taskStartDate.getUTCHours()).padStart(2, '0') : '--';
 const minutes = taskStartDate ? String(taskStartDate.getUTCMinutes()).padStart(2, '0') : '--';
 
 const taskEndDate = new Date(Date.parse(task.end_date) + 180);
 const endDay = taskEndDate.getUTCDate();
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
          className="w-full max-w-[500px] py-[17px] px-4 h-fit rounded-2xl flex flex-col items-center  mt-1 bg-light-gray-white dark:bg-light-gray-7-logo"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between w-full">
            <div
              className={'flex items-start'}
            >
                 {tasksCateg.find(i => i.id == task.category.id) ? (
               tasksCateg.find(i => i.id == task.category.id)?.icon
               ): (
                 <Kind className="w-[32px] h-[32px] fill-[#000000] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-5"/>
               )}
              <div className="flex flex-col justify-center items-start pl-2 ">
                <h1 className="font-gerbera-h3 text-light-gray-8 dark:text-light-gray-1">
                {task.name.slice(0, 1).toLocaleUpperCase()+task.name.slice(1)}
                </h1>
              </div>
            </div>
          </div>
          {/* /////////////////////// */}
          <div className="flex justify-center items-center mt-[14px] space-x-2 w-full">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] min-w-40 h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
                {period ? "Даты" : "Время начала" } 
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
              {dateString}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] min-w-40  h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
                Начисление баллов
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                {'+ '}
                {task.volunteer_price} {getBallCorrectEndingName(task.volunteer_price)}
              </p>
            </div>
          </div>
          {task.curator.name && task.curator.name.length > 0 ? (
          <div className="w-full min-w-[330px] h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between px-4 dark:bg-light-gray-6">
              <div className="flex">
              <Avatar.Root className="inline-flex items-center justify-center h-[32px] w-[32px] bg-light-gray-1 dark:bg-dark-gray-1 rounded-full">
              <Avatar.Image
                src={task.curator.photo || ''}
                alt="Avatar"
                className="h-[32px] w-[32px] object-cover rounded-full cursor-pointer"
              />
              <Avatar.Fallback
                className="text-black dark:text-white"
              >
                {task.curator.name ? task.curator.name[0] : 'A'}
              </Avatar.Fallback>
            </Avatar.Root>
   
            <div className="felx flex-col justify-center items-start ml-4">
              <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                {task.curator.name}
              </h1>
              <p className="font-gerbera-sub3 text-light-gray-4 text-start dark:text-light-gray-3">
                Куратор
              </p>
            </div>
          </div>
          {task.curator.tg_username && task.curator.tg_username.length > 0 ? (
           <a
            href={'https://t.me/' + task.curator?.tg_username}
            target="_blank"
                >
               <Small_sms className="w-[36px] h-[35px]"/>
          </a>
          ): ""}
         
        </div>
          ) : ''}

          {task.description && task.description.length != 0 ? (
            <div className="w-full min-w-[330px]  h-fit min-h-[67px] bg-light-gray-1 rounded-2xl mt-[20px] flex items-center justify-between p-4 dark:bg-light-gray-6">
              <div className="flex flex-col justify-start items-start font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                Подробности
                <p className="font-gerbera-sub1 text-light-gray-5 text-start pt-2 dark:text-light-gray-3">
                  {task.description}
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
          <button
              className="btn-B-GreenDefault  mt-[20px] self-center"
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
          onOpenChange(false)
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
