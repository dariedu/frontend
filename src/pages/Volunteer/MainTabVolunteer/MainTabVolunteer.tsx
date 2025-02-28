import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCardsDeliveries from '../../../components/SliderCards/SliderCardsDeliveries';
import { useState, useContext, useEffect } from 'react';
import { DeliveryContext } from '../../../core/DeliveryContext';
import {
  postDeliveryTake,
  getVolunteerDeliveries,
  type IDelivery,
  type IVolunteerDeliveries,
} from '../../../api/apiDeliveries';
import { TokenContext } from '../../../core/TokenContext';
import {
  getMetroCorrectName,
  getMonthCorrectEndingName,
} from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import NearestDeliveryVolunteer from '../../../components/NearestDelivery/NearestDeliveryVolunteer';
import {
  getAllAvaliableTasks,
  postTaskAccept,
  getMyTasksNoFilter,
  type ITask,
} from '../../../api/apiTasks';
import SliderCardsTaskVolunteer from '../../../components/SliderCards/SliderCardsTasksVolunteer';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react';


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
  

  ///// убираем все неактивные (завершенные заявки из списка)
  function filterDeliveries() {
    if (deliveries.length > 0) {
      const today = new Date();
      const filtered: IDelivery[] = deliveries.filter(
        i =>i.is_completed == false && i.is_active == true && (new Date(i.date) > new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() - 1, today.getMinutes()))
      );
      localStorage.setItem(`all_del_vol`, JSON.stringify(filtered))
      setFilteredDeliveries(filtered);
      setFilteredDeliveriesBeforeCalendarFilter(filtered)
    }
  }

  async function getMyDeliveries() {
    const current: IDelivery[] = [];
    try {
      if (token) {
        let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
        if (result) {
          result['мои активные доставки'].forEach(i => {
            current.push(i);
          });
          current.map(i => {
            if (i.curator.photo && !(i.curator.photo.includes('https'))) {
             return i.curator.photo = i.curator.photo.replace('http', 'https')
            }
          })

          setMyCurrent(current);
        }
      }
    } catch (err) {
      console.log(err, 'CalendarTabVolunteer getMyDeliveries fail');
    }
  }

  async function getAllTasks() {
    try {
      if (token) {
        let result: ITask[] = await getAllAvaliableTasks(token);
        if (result) {
          result.map(i => {
            if (i.curator.photo && !(i.curator.photo?.includes('https'))) {
             return i.curator.photo = i.curator.photo.replace('http', 'https')
            }
          })
         console.log(result, "getAllTasks() main page vol" )
          setAllAvaliableTasks(result);
        }
      }
    } catch (err) {
      console.log(err, 'getAllTasks() has failed volunteer main tab');
    }
  }

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    getMyDeliveries();
    filterDeliveries();
  }, [deliveries, takeDeliverySuccess]);

  // const deliveryDate = new Date(Date.parse(delivery.date) + 180 *60000);
  //   console.log(deliveryDate.getDate(), deliveryDate.getHours())

  ////функция чтобы волонтер взял доставку
  async function getDeliveryFromServer(delivery: IDelivery) {
    const id: number = delivery.id;
  
    const deliveryDate = new Date(Date.parse(delivery.date) + 180 *60000);
    console.log(deliveryDate.getDate(), deliveryDate.getHours())
    const date = deliveryDate.getUTCDate();
    const month = getMonthCorrectEndingName(deliveryDate);
    const hours =
      deliveryDate.getUTCHours() < 10
        ? '0' + (deliveryDate.getUTCHours())
        : deliveryDate.getUTCHours();
    const minutes =
      deliveryDate.getUTCMinutes() < 10
        ? '0' + deliveryDate.getUTCMinutes()
        : deliveryDate.getUTCMinutes();
    const subway = getMetroCorrectName(delivery.location.subway);
    const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
    
      if (token) {
        try {
        let result = await postDeliveryTake(token, id, delivery);
        if (result) {
          setTakeDeliverySuccess(true);
          setTakeDeliverySuccessDateName(finalString);
          setDeliveryForReservation(undefined)
          }
        }
        catch (err) {
        if (err == 'Error: You have already taken this delivery') {
          setTakeDeliveryFail(true);
          setTakeDeliveryFailString(
            `Ошибка, доставка ${finalString}, уже у вас в календаре`,
          );
        } else if ((err = ' Error: User does not confirmed')) {
          setTakeTaskFail(true);
          setTakeTaskFailString(
            <p>Вы сможете записаться на доставку и добрые дела после завершения регистрации.<br/> 
            📩 <a href={'https://t.me/volunteers_dari_edu'} target="_blank"  className='text-light-brand-green ' >
                @volunteers_dari_edu
                </a></p>,
          );
         }  else {
          setTakeDeliveryFail(true);
          setTakeDeliveryFailString(`Упс, что то пошло не так, попробуйте позже`);
        }
      }
    } 
  }




  function getDelivery(delivery: IDelivery) {
    const deliveryDate = new Date(Date.parse(delivery.date) + 180* 60000);
    const date = deliveryDate.getUTCDate();
    const month = getMonthCorrectEndingName(deliveryDate);
    const hours =
      deliveryDate.getUTCHours() < 10
        ? '0' + deliveryDate.getUTCHours()
        : deliveryDate.getUTCHours();
    const minutes =
      deliveryDate.getUTCMinutes() < 10
        ? '0' + deliveryDate.getUTCMinutes()
        : deliveryDate.getUTCMinutes();
    const subway = getMetroCorrectName(delivery.location.subway);
    const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
    setTakeDeliverySuccessDateName(finalString)
    setDeliveryForReservation(delivery);
    setTakeDeliveryModal(true)
  }

  ////функция чтобы волонтер взял оброе дело
  async function getTaskFromServer(task: ITask) {
    const id: number = task.id;
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
    try {
      if (token) {
        let result: ITask = await postTaskAccept(id, token);
        if (result) {
          setTakeTaskSuccess(true);
          setTakeTaskSuccessDateName(finalString);
        }
      }
    } catch (err) {
      if (err == "Error: You've already taken this task!") {
        setTakeTaskFail(true);
        setTakeTaskFailString(
          `Ошибка, доброе дело ${finalString}, уже в календаре`,
        );
      } else if ((err = ' Error: User does not confirmed')) {
        setTakeTaskFail(true);
        setTakeTaskFailString(
          <p>Вы сможете записаться на доброе дело и доставки после завершения регистрации.<br/> 
          📩 <a href={'https://t.me/volunteers_dari_edu'} target="_blank"  className='text-light-brand-green ' >
              @volunteers_dari_edu
              </a></p>,
        );
      } else {
        setTakeTaskFail(true);
        setTakeTaskFailString(`Упс, что то пошло не так, попробуйте позже`);
      }
    }
  }

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

  async function getAllMyTasks() {
    let idArr: number[] = [];
    try {
      if (token) {
        let result: ITask[] = await getMyTasksNoFilter(token);
        if (result) {
          result.filter(i => !i.is_completed).forEach(i => idArr.push(i.id));
          setAllMyTasksId(idArr)
        }
      }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
  }

  useEffect(() => { getAllMyTasks() }, [takeTaskSuccess]);

  return (
    <>
      <div className="flex flex-col h-fit mb-20 overflow-x-hidden w-full max-w-[500px]">
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
          <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl h-fit overflow-x-hidden">
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
                getDelivery={getDelivery}
                stringForModal={takeDeliverySuccessDateName}
                takeDeliverySuccess={takeDeliverySuccess}
                setTakeDeliverySuccess={setTakeDeliverySuccess}
              />
            ) : (
              <div className="flex flex-col w-full max-w-[500px] items-center mt-8 h-[100px] justify-between mb-5">
              <LogoNoTaskYet className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
              <p className="dark:text-light-gray-1">
                Скоро тут появятся доставки
              </p>
            </div>
            )}
          </div>
        </div>
        <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl overflow-x-hidden mb-20 h-fit">
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
            <div className="flex flex-col w-full max-w-[500px] items-center mt-8 h-[100px] justify-between mb-5">
              <LogoNoTaskYet className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
              <p className="dark:text-light-gray-1">
                Скоро тут появятся добрые дела
              </p>
            </div>
          )}
        </div>
      </div>
      {deliveryForReservation && 
        <ConfirmModal
        isOpen={takeDeliveryModal}
        onOpenChange={setTakeDeliveryModal}
        onConfirm={() => {
          getDeliveryFromServer(deliveryForReservation);
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
            getTaskFromServer(taskForReservation);
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
