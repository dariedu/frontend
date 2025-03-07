import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCardsDeliveries from '../../../components/SliderCards/SliderCardsDeliveries';
import { useState, useContext, useEffect } from 'react';
import { DeliveryContext } from '../../../core/DeliveryContext';
import {
  type IDelivery,
} from '../../../api/apiDeliveries';
import { TokenContext } from '../../../core/TokenContext';
import {
  getMonthCorrectEndingName,
} from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import NearestDeliveryVolunteer from '../../../components/NearestDeliveryVolunteer/NearestDeliveryVolunteer';
import {
  type ITask,
} from '../../../api/apiTasks';
import SliderCardsTaskVolunteer from '../../../components/SliderCards/SliderCardsTasksVolunteer';
import Bread from './../../../assets/icons/bread.svg?react';
import {
  filterDeliveries, getMyDeliveries, getAllTasks, getDeliveryFromServer,
  getTaskFromServer,
  getAllMyTasks
} from './helperFunctions';

type TMainTabVolunteerProps = {
  switchTab: React.Dispatch<React.SetStateAction<string>>;
};

const MainTabVolunteer: React.FC<TMainTabVolunteerProps> = ({ switchTab }) => {
const [selectedDate, setSelectedDate] = useState<Date|null>(null);

  const [takeDeliverySuccess, setTakeDeliverySuccess] =
    useState<boolean>(false); //// подтверждение бронирования доставки
  const [takeDeliverySuccessDateName, setTakeDeliverySuccessDateName] =
    useState<string>(''); ///строка для вывова названия и времени доставки в алерт
  const [takeDeliveryFail, setTakeDeliveryFail] = useState<boolean>(false); /// переменная для записи если произошла ошибка  при взятии доставки
  const [takeDeliveryFailString, setTakeDeliveryFailString] =
    useState<string>(''); //переменная для записи названия ошибки при взятии доставки

  const [takeTaskSuccess, setTakeTaskSuccess] = useState<boolean>(false); //// подтверждение бронирования доброго дела
  const [takeTaskSuccessDateName, setTakeTaskSuccessDateName] =
    useState<string>(''); ///строка для вывова названия и времени доброго дела в алерт
  const [takeTaskFail, setTakeTaskFail] = useState<boolean>(false); /// переменная для записи если произошла ошибка  при взятии доброго дела
  const [takeTaskFailString, setTakeTaskFailString] = useState<string|JSX.Element>(''); //переменная для записи названия ошибки при взятии доброго дела

  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>(localStorage.getItem(`all_del_vol`) !== null && localStorage.getItem(`all_del_vol`) !== undefined ? JSON.parse(localStorage.getItem(`all_del_vol`) as string) : []);
  const [filteredDeliveriesBeforeCalendarFilter, setFilteredDeliveriesBeforeCalendarFilter] = useState<IDelivery[]>(localStorage.getItem(`all_del_vol`) !== null && localStorage.getItem(`all_del_vol`) !== undefined ? JSON.parse(localStorage.getItem(`all_del_vol`) as string) : []);
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]); /// сверяемся есть ли доставки в моих забронированных

  const [allAvaliableTasks, setAllAvaliableTasks] = useState<ITask[]>([]);
  const [takeDeliveryModal, setTakeDeliveryModal] = useState(false)///просим подтвердить пользователя чтобы взять доставку
  const [deliveryForReservation, setDeliveryForReservation] = useState<IDelivery>();/// запоминаем доставку которую пользователь хочет взять
  const [takeTaskModal, setTakeTaskModal] = useState(false)///просим подтвердить пользователя чтобы взять доброе дело
  const [taskForReservation, setTaskForReservation] = useState<ITask>();/// запоминаем таск который пользователь хочет взять
  const [allMyTasksId, setAllMyTasksId] = useState<number[]>([]);
  ////// используем контекст доставок, чтобы вывести количество доступных баллов
  const { deliveries } = useContext(DeliveryContext);
    ///// используем контекст токена
    const {token} = useContext(TokenContext);
    // const token = tokenContext.token;
   ////// используем контекст

  useEffect(() => {
    //  console.log(deliveries)
    console.log(window.Telegram?.WebApp?.platform, "window.Telegram?.WebApp?.platform MainTabVolunteer")
},[])
  

  useEffect(() => {
    getAllTasks(token, setAllAvaliableTasks);
  }, []);

  useEffect(() => {
    getMyDeliveries(token, setMyCurrent);
    filterDeliveries(deliveries, setFilteredDeliveries, setFilteredDeliveriesBeforeCalendarFilter);
  }, [deliveries, takeDeliverySuccess]);

  

  function getTask(task: ITask) {
    const taskDate = new Date(Date.parse(task.start_date) + 180* 60000);
    const date = taskDate.getUTCDate();
    const month = getMonthCorrectEndingName(taskDate);
    const hours =
      taskDate.getUTCHours() < 10
        ? '0' + taskDate.getUTCHours()
        : taskDate.getUTCHours();
    const minutes =
      taskDate.getUTCMinutes() < 10
        ? '0' + taskDate.getUTCMinutes()
        : taskDate.getUTCMinutes();
    const finalString = `\"${task.name.slice(0, 1).toUpperCase() + task.name.slice(1)}\", ${date} ${month}, ${hours}:${minutes}`;
    setTakeTaskSuccessDateName(finalString);
    setTaskForReservation(task);
    setTakeTaskModal(true)
  }


  useEffect(() => { getAllMyTasks(token, setAllMyTasksId) }, [takeTaskSuccess]);

  return (
    <>
      <div className="flex flex-col h-fit mb-5 overflow-x-hidden w-full max-w-[500px]">
        <div>
          <SliderStories />
          {myCurrent.length > 0
            ? myCurrent.map(i => {
                if (i.in_execution == true) {
                  return (
                    <div key={i.id}>
                      <NearestDeliveryVolunteer delivery={i} status="active" />
                    </div>
                  );
                }
              })
            : ''}
          <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl h-[278px] overflow-x-hidden">
            <div className="text-start font-gerbera-h1 text-light-gray-black ml-4 dark:text-light-gray-white pt-[20px]">
              Благотворительная доставка
            </div>
            <Calendar
              startOfWeekDate={new Date()}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              deliveries={filteredDeliveriesBeforeCalendarFilter}
              setFilteredDeliveries={setFilteredDeliveries}
            />
            {filteredDeliveries.length > 0 ? (
              <SliderCardsDeliveries
                deliveries={filteredDeliveries}
                myDeliveries={myCurrent}
                switchTab={switchTab}
                // getDelivery={getDelivery}
                stringForModal={takeDeliverySuccessDateName}
                takeDeliverySuccess={takeDeliverySuccess}
                setTakeDeliverySuccess={setTakeDeliverySuccess}
                setTakeDeliverySuccessDateName={setTakeDeliverySuccessDateName}
                setDeliveryForReservation={setDeliveryForReservation}
                setTakeDeliveryModal={setTakeDeliveryModal} 
              />
            ) : (
              <div className='flex flex-col items-center justify-center overflow-y-hidden mt-6'>
              <Bread className='fill-[#000000] dark:fill-[#F8F8F8] mb-2'/>
            <p className='text-light-gray-black dark:text-light-gray-1 w-54'>Скоро тут появятся доставки</p>
          </div>
            )}
          </div>
        </div>
        <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl overflow-x-hidden mb-20 h-[190px]">
          <div className="text-start font-gerbera-h1 text-light-gray-black ml-4 dark:text-light-gray-white pt-4">
            Другие добрые дела
          </div>
          {allAvaliableTasks.length > 0 ? (
            <SliderCardsTaskVolunteer
              myTasks={allMyTasksId}
              tasks={allAvaliableTasks}
              switchTab={switchTab}
              getTask={getTask}
              stringForModal={takeTaskSuccessDateName}
              takeTaskSuccess={takeTaskSuccess}
              setTakeTaskSuccess={setTakeTaskSuccess}
            />
          ) : (
            <div className='flex flex-col items-center justify-center overflow-y-hidden mt-8'>
            <Bread className='fill-[#000000] dark:fill-[#F8F8F8] mb-2'/>
          <p className='text-light-gray-black dark:text-light-gray-1 w-54'>Скоро тут появятся добрые дела</p>
        </div>
          )}
        </div>
      </div>
      {deliveryForReservation && 
        <ConfirmModal
        isOpen={takeDeliveryModal}
        onOpenChange={setTakeDeliveryModal}
        onConfirm={() => {
          getDeliveryFromServer(deliveryForReservation, token, setTakeDeliverySuccess,
  setTakeDeliverySuccessDateName, setDeliveryForReservation, setTakeDeliveryFail,
  setTakeDeliveryFailString, setTakeTaskFail,  setTakeTaskFailString
          );
          setTakeDeliveryModal(false)
        }}
        onCancel={() => {
          setTakeDeliveryModal(false);
        }}
        title={`Записаться на доставку ${takeDeliverySuccessDateName}?`}
        description=""
        confirmText="Записаться"
        cancelText="Отменить"
        isSingleButton={false}
      />
      }
      {taskForReservation &&
        <ConfirmModal
          isOpen={takeTaskModal}
          onOpenChange={setTakeTaskModal}
          onConfirm={() => {
            getTaskFromServer(taskForReservation, token, setTakeTaskSuccess,  setTakeTaskSuccessDateName, setTakeTaskFail, setTakeTaskFailString);
            setTakeTaskModal(false)
          }}
          onCancel={() => {
            setTakeTaskModal(false);
          }}
          title={`Записаться на доброе дело ${takeTaskSuccessDateName}?`}
        description=""
        confirmText="Записаться"
        cancelText="Отменить"
        isSingleButton={false}
      />
      }
      
      <ConfirmModal
        isOpen={takeDeliveryFail}
        onOpenChange={setTakeDeliveryFail}
        onConfirm={() => {
          setTakeDeliveryFail(false);
          setTakeDeliveryFailString('');
        }}
        title={takeDeliveryFailString}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={takeTaskFail}
        onOpenChange={setTakeTaskFail}
        onConfirm={() => {
          setTakeTaskFail(false);
          setTakeTaskFailString('');
        }}
        title={takeTaskFailString}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
    </>
  );
};

export default MainTabVolunteer;
