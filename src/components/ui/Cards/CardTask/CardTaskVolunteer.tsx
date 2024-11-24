import React, { useState} from 'react';
import { type ITask } from '../../../../api/apiTasks';
import {
  getBallCorrectEndingName,
  // getMetroCorrectName,
} from '../../../helperFunctions/helperFunctions';
import { DetailedInfoTask } from '../../../DetailedInfoDeliveryTask/DetailedInfoTask';
import OnlineIcon from './../../../../assets/icons/onlineIcon.svg?react'


type TCardDeliveryProps = {
  task: ITask
   switchTab: React.Dispatch<React.SetStateAction<string>>;
   getTask: (delivery: ITask) =>void
   stringForModal: string
   takeTaskSuccess: boolean
   setTakeTaskSuccess:React.Dispatch<React.SetStateAction<boolean>>
};

const CardTaskVolunteer: React.FC<TCardDeliveryProps> = ({ task, switchTab, getTask, stringForModal, takeTaskSuccess, setTakeTaskSuccess}) => {
 const [isOpen, setIsOpen] = useState(false);

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
  if (startDay == endDay && startMonth == endMonth) {
    dateString = `${startDay} ${startMonth} ${hours}:${minutes}`
  } else {
    if (startMonth == endMonth) {
       dateString = `${startDay} - ${endDay} ${endMonth}`
    } else {
       dateString = `${startDay} ${startMonth} - ${endDay} ${endMonth}`
    }
   
  }
  ///// работаем с датой //////////////
  
     return (
       <>

     <div className="p-4 bg-light-gray-1 rounded-2xl shadow w-[240px] h-[116px] mb-4 flex flex-col justify-between dark:bg-light-gray-6" onClick={()=>setIsOpen(true)}>
      <div className="flex items-center">
             <div className="flex items-start justify-center">
               <OnlineIcon className="w-[32px] h-[32px] fill-[#000000] bg-light-gray-white rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-5" />
          <div className='flex flex-col items-start ml-2'>
              <p className='font-gerbera-h3 text-light-gray-black w-40 h-[18px] overflow-hidden text-start dark:text-light-gray-white'>
               {task.name.slice(0, 1).toUpperCase()+task.name.slice(1)}
              </p>
          {/* <p className='text-light-gray-black font-gerbera-sub1 dark:text-light-gray-3'>{delivery.location.address}</p> */}

          </div>
             </div>
            </div>    
        <div className="flex justify-between items-center w-fit space-x-1">
        <div className="flex justify-center text-center bg-light-gray-white w-fit h-fit py-[6px] px-3 rounded-2xl dark:bg-light-gray-5 dark:text-light-gray-2 font-gerbera-sub2">
          {dateString}
            </div>
          <div className="flex items-center justify-center bg-light-brand-green w-fit h-fit py-[6px]  px-3 rounded-2xl">
            <span className="text-light-gray-white font-gerbera-sub2">
              + {task.volunteer_price} {getBallCorrectEndingName(task.volunteer_price)}
            </span>
          </div>
        </div>
           </div>
         <DetailedInfoTask task={task} isOpen={isOpen} onOpenChange={setIsOpen} switchTab={switchTab} getTask={getTask} stringForModal={stringForModal} takeTaskSuccess={takeTaskSuccess} setTakeTaskSuccess={setTakeTaskSuccess} />
         </>
         )

   };

export default CardTaskVolunteer;
