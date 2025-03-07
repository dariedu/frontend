import React, { useContext, useState, useEffect } from 'react';
import {
  getBallCorrectEndingName,
  // getMonthCorrectEndingName
} from '../helperFunctions/helperFunctions';
import CompletedDeliveryOrTaskFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteersTasks from '../ListOfVolunteers/ListOfVolunteersTask';
import {postTaskComplete, type ITask, type TTasksConfirmedForCurator } from '../../api/apiTasks';
import { TokenContext } from '../../core/TokenContext';
import { getUserById, type IUser } from '../../api/userApi';
import Arrow_down from './../../assets/icons/arrow_down.svg?react'


interface INearestTaskProps {
  task: ITask
  taskFilter: TTaskFilter
  feedbackSubmited: boolean
  arrayListOfConfirmedVolTask:TTasksConfirmedForCurator[] | null
}

type TTaskFilter = 'nearest' | 'active' | 'completed';

const NearestTaskCurator: React.FC<INearestTaskProps> = ({
  task,
  taskFilter,
  feedbackSubmited,
  arrayListOfConfirmedVolTask
}) => {

//  console.log(feedbackSubmited)
  const [isFeedbackSubmited, setIsFeedbackSubmited] = useState(feedbackSubmited);
 // console.log(isFeedbackSubmited, 'is feedback submited')
  const [filter, setFilter] = useState<TTaskFilter>(taskFilter)
  const [fullViewCurator, setFullViewCurator] = useState(false);
  const [openVolunteerList, setOpenVolunteerList] = useState(false)
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] =
    useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =
    useState(false); ////// открываем модальное окно, чтобы подтвердить доставку
  const [taskConfirmCompleteTask, setTaskConfirmCompleteTask] = useState(false);


  const [taskCompleteSuccess, setTaskCompleteSuccess] = useState(false);
  const [taskCompleteFail, setTaskCompleteFail] = useState(false);

  const [list, setList] = useState<IUser[]>([]);
  const [listOfConfirmedVolTask, setListOfConfirmedVolTask] = useState<number[]|null>(null)

 ///// работаем с датой //////////////
 const taskStartDate = new Date(Date.parse(task.start_date) + 180 * 60000);
 const startDay = taskStartDate.getUTCDate();
 const startMonth = taskStartDate.toLocaleDateString("RU", {month:"short"});
 
 const hours = taskStartDate ? String(taskStartDate.getUTCHours()).padStart(2, '0') : '--';
 const minutes = taskStartDate ? String(taskStartDate.getUTCMinutes()).padStart(2, '0') : '--';
 
 const taskEndDate = new Date(Date.parse(task.end_date) + 180 * 60000);
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
  

  const {token}= useContext(TokenContext)
  
  async function getVolunteers() {
    if (token && task.volunteers && task.volunteers.length > 0) {
      try {
        const volunteerArr: IUser[] = []
        Promise.allSettled(task.volunteers.map(id => getUserById(id, token)))
          .then(responses => responses.forEach((result, num) => {
            if (result.status == "fulfilled") {
              volunteerArr.push(result.value)
            }
            if (result.status == "rejected") {
              console.log(`${num} volunteer`)
            }
          })).finally(() => {
            volunteerArr.forEach(vol => {
              if (vol.photo && !vol.photo.includes('https')) {
                vol.photo = vol.photo.replace('http', 'https')
              }
            })
            setList(volunteerArr)
          }
          )
      } catch (err) {
        console.log(err, "getVolunteers() nearestTaskCurator")
      }
    } 
  }

    useEffect(() => {
      getVolunteers()
    }, [])
  
  async function completeTask() {
    if (token) {
      try { 
        let result = await postTaskComplete(task.id, token);
        if (result) {
          setTaskCompleteSuccess(true)
        setFilter('completed')
        }
      } catch (err) {
        console.log(err, 'completeTask() nearestTaskCurator')
        setTaskCompleteFail(true)
      }
    }
  }

/// отсеиваем списки ищем только для данной доставки
  function filterVolList() {
  if (arrayListOfConfirmedVolTask && arrayListOfConfirmedVolTask.length > 0) {
    console.log(arrayListOfConfirmedVolTask, "arrayListOfConfirmedVolTask nearestTaskCurator")
    const filtered: TTasksConfirmedForCurator[] = arrayListOfConfirmedVolTask.filter(i => { return i.task == task.id });
    setListOfConfirmedVolTask(filtered[0]?.volunteer)
  }
}
  
  useEffect(() => {
    filterVolList()
  }, [arrayListOfConfirmedVolTask])


  return (
    <>
      <div
        className={`w-full max-w-[500px] py-[17px] px-4 h-fit  rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
      >
        <div className="flex justify-between w-full">
          {filter == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшее
            </p>
          ) : filter == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активное
            </p>
          ) : filter == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center">
              Завершённое
            </p>
          ) : (
            ''
          )}
          <div className="flex items-center">
            <p
              className={
                filter == 'nearest'
                  ? 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2'
                  : 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2 cursor-pointer'
              }
              onClick={() => {
                filter == 'nearest'
                  ? ''
                  : fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
              }}
            >
              {task.category.name}{' '}
            </p>
            {<Arrow_down className={`${fullViewCurator ? "" : "rotate-180"}  stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer`}
              onClick={() => {
                    fullViewCurator == true
                      ? setFullViewCurator(false)
                      : setFullViewCurator(true);
                }}
              />}
          </div>
        </div>
        {fullViewCurator&& (filter == 'nearest' || filter == 'active') && task.description &&  task.description.length != 0 &&
              <div className="w-full box-border min-h-[67px] bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl mt-[20px] flex flex-col h-fit items-start justify-start p-4">
                <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1 text-start">
                  Подробности
                </p>
                <p className="font-gerbera-sub2 text-light-gray-4 dark:text-light-gray-3 mt-[6px] text-start">
                  {task.description}
                </p>
              </div>}
        {/* /////////////////////// */}
        {(filter == 'nearest' || filter == 'active') && (
          <div className="flex justify-center items-center mt-[20px] space-x-2">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-3 dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                {period ? "Даты" : "Время начала" } 
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
              {dateString}
              </p>
            </div>
            <div className="bg-light-gray-1  dark:bg-light-gray-6 rounded-2xl flex flex-col justify-between box-border items-start w-[50%] min-w-[161px] h-[62px] p-3">
              <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                {filter == 'nearest' ? "Записались" : "Волонтёры" }</p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
                {task.volunteers_taken == 0
                  ? '0 из ' + `${task.volunteers_needed}`
                  : `${task.volunteers_taken + ' из ' + `${task.volunteers_needed}`}`}
              </p>
            </div>
          </div>
        )}
        {(filter == 'active' || filter == 'nearest') && task.volunteers_taken > 0  && 
          <button
            className="btn-B-WhiteDefault mt-[20px] self-center"
            onClick={() => setOpenVolunteerList(true)}
          >
          {filter == 'nearest' ? "Список записавшихся волонтёров" : "Список волонтёров"}
          </button>
        }
       {filter == 'active' && fullViewCurator && (
          <button
            className="btn-B-GreenDefault mt-[20px] self-center"
            onClick={e => {
              e.preventDefault();
              setTaskConfirmCompleteTask(true)
            }}
          >
            Завершить
          </button>
        )}
        
        {filter == 'completed' && fullViewCurator && (
          <>
             <div className="flex justify-center items-center mt-[20px] space-x-2">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[50%] box-border min-w-[161px] h-[62px] p-3 dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                {period ? "Даты" : "Время начала" } 
              </p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
              {dateString}
              </p>
            </div>
            <div className="bg-light-gray-1  dark:bg-light-gray-6 rounded-2xl flex flex-col justify-between box-border items-start w-[50%] min-w-[161px] h-[62px] p-3">
              <p className="font-gerbera-sub2 text-light-gray-5 dark:text-light-gray-3">
                Баллы</p>
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1">
               + {task.curator_price} {getBallCorrectEndingName(task.curator_price)}
              </p>
            </div>
            </div>
            {
              feedbackSubmited ? (<button
            className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
            onClick={e => {
              e.preventDefault();
            }}
          >
            Oтзыв отправлен
          </button>) : isFeedbackSubmited ?(<button
            className="btn-B-WhiteDefault mt-[20px] self-center cursor-default"
            onClick={e => {
              e.preventDefault();
            }}
          >
            Oтзыв отправлен
          </button>): ( <button
            className="btn-B-GreenDefault  mt-[20px] self-center"
            onClick={e => {
              e.preventDefault();
              setIsCuratorFeedbackModalOpen(true);
            }}
          >
            Поделиться впечатлениями
          </button>)
            }
          </>
          )
        }
        {/* /////////////////////// */}
      </div>
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <CompletedDeliveryOrTaskFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={() => { setIsFeedbackSubmitedModalOpen(true); setIsFeedbackSubmited(true) }}
          volunteer={false}
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
        isOpen={taskConfirmCompleteTask}
        onOpenChange={setTaskConfirmCompleteTask}
        onConfirm={() => {
          completeTask();
          setTaskConfirmCompleteTask(false);
        }}
        title={<p>Уверены, что хотите завершить доброе дело?</p>}
        description=""
        confirmText="Завершить"
        cancelText="Отменить"
        isSingleButton={false}
      />
      <ConfirmModal
        isOpen={taskCompleteSuccess}
        onOpenChange={setTaskCompleteSuccess}
        onConfirm={() => setTaskCompleteSuccess(false)}
        title={<p>Доброе дело "{task.name.slice(0,1).toUpperCase()+task.name.slice(1)}" успешно завершено<br />
          +{task.curator_price} {getBallCorrectEndingName(task.curator_price)}
        </p>}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
 <ConfirmModal
        isOpen={taskCompleteFail}
        onOpenChange={setTaskCompleteFail}
        onConfirm={() => setTaskCompleteFail(false)}
        title={<p>
          Упс, что-то пошло не так,<br/>
          <br /> Попробуйте позже.
        </p>}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      {list.length > 0 && (
        <Modal isOpen={openVolunteerList} onOpenChange={setOpenVolunteerList}>
          <ListOfVolunteersTasks
            listOfVolunteers={list} 
            onOpenChange={setOpenVolunteerList}
            listOfConfirmedVolTask={listOfConfirmedVolTask}
          />
        </Modal>
      )}
    </>
  );
};

export default NearestTaskCurator;
