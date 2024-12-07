import React from 'react';
import CardTaskVolunteer from '../ui/Cards/CardTask/CardTaskVolunteer';
import { type ITask } from '../../api/apiTasks';


interface SliderCardsProps {
  tasks:ITask[]
  switchTab: React.Dispatch<React.SetStateAction<string>>
  getTask: (delivery: ITask) =>void
  stringForModal: string
  takeTaskSuccess: boolean
  setTakeTaskSuccess:React.Dispatch<React.SetStateAction<boolean>>
}

const SliderCardsTaskVolunteer: React.FC<SliderCardsProps> = ({
  tasks,
  switchTab,
  getTask,
  stringForModal,
  takeTaskSuccess,
  setTakeTaskSuccess
}) => {


  return (
    <div className="mt-1 pt-3 w-full max-w-[500px] bg-light-gray-white rounded-2xl dark:bg-light-gray-7-logo overflow-x-hidden">
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-full pl-4 space-x-2"
      >
        {tasks.map((task) => {
          return (
            <div key={task.id} >
              <CardTaskVolunteer task={task} switchTab={switchTab} getTask={getTask} stringForModal={stringForModal} takeTaskSuccess={takeTaskSuccess} setTakeTaskSuccess={setTakeTaskSuccess} />
          </div>
          )
         }) 
    }
      </div>
    </div>
  );
};

export default SliderCardsTaskVolunteer;
