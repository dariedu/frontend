import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import { useState, useContext, useEffect } from 'react';
import { DeliveryContext } from '../../../core/DeliveryContext';
import {
  postDeliveryTake,
  getVolunteerDeliveries,
  type IDelivery,
  type IVolunteerDeliveries,
} from '../../../api/apiDeliveries';
import { UserContext } from '../../../core/UserContext';
import {
  getMetroCorrectName,
  getMonthCorrectEndingName,
} from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import {
  getAllAvaliableTasks,
  postTaskAccept,
  type ITask,
} from '../../../api/apiTasks';
import LogoNoTaskYet from './../../../assets/icons/LogoNoTaskYet.svg?react';
import SliderCardsTaskCurator from '../../../components/SliderCards/SliderCardsTasksCurator';
import SliderCardsDeliveriesCurator from '../../../components/SliderCards/SliderCardsDeliveriesCurator';
import Search from '../../../components/Search/Search';
import { IUser } from '../../../core/types';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';

type TMainTabCuratorProps = {
  switchTab: React.Dispatch<React.SetStateAction<string>>;
};

const MainTabCurator: React.FC<TMainTabCuratorProps> = ({ switchTab }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { nearestDelivery, isLoading, error } = useContext(DeliveryContext);
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

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
  const [takeTaskFailString, setTakeTaskFailString] = useState<string>(''); //переменная для записи названия ошибки при взятии доброго дела

  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]); /// сверяемся есть ли доставки в моих забронированных

  const [allAvaliableTasks, setAllAvaliableTasks] = useState<ITask[]>([]);

  //console.log(allAvaliableTasks, "allavaliable tasks")

  ////// используем контекст доставок, чтобы вывести количество доступных баллов
  const { deliveries } = useContext(DeliveryContext);
  const userValue = useContext(UserContext);
  const token = userValue.token;
  ////// используем контекст

  ///// убираем все неактивные (завершенные заявки из списка)
  function filterDeliveries() {
    if (deliveries.length > 0) {
      const filtered: IDelivery[] = deliveries.filter(
        i => i.is_completed == false && i.is_active == true,
      );
      setFilteredDeliveries(filtered);
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
          setAllAvaliableTasks(result);
          console.log(result, 'tasks');
        }
      }
    } catch (err) {
      console.log(err, 'getAllTasks() has failed volunteer main tab');
    }
  }

  useEffect(() => {
    getAllTasks();
  }, [token]);

  useEffect(() => {
    getMyDeliveries();
    filterDeliveries();
  }, [deliveries, takeDeliverySuccess]);

  ////функция чтобы волонтер взял доставку
  async function getDelivery(delivery: IDelivery) {
    const id: number = delivery.id;
    const deliveryDate = new Date(delivery.date);
    const date = deliveryDate.getDate();
    const month = getMonthCorrectEndingName(deliveryDate);
    const hours =
      deliveryDate.getHours() < 10
        ? '0' + deliveryDate.getHours()
        : deliveryDate.getHours();
    const minutes =
      deliveryDate.getMinutes() < 10
        ? '0' + deliveryDate.getMinutes()
        : deliveryDate.getMinutes();
    const subway = getMetroCorrectName(delivery.location.subway);
    const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
    try {
      if (token) {
        let result: IDelivery = await postDeliveryTake(token, id, delivery);
        if (result) {
          setTakeDeliverySuccess(true);
          setTakeDeliverySuccessDateName(finalString);
        }
      }
    } catch (err) {
      if (err == 'Error: You have already taken this delivery') {
        setTakeDeliveryFail(true);
        setTakeDeliveryFailString(
          `Ошибка, доставка ${finalString}, уже у вас в календаре`,
        );
      } else if ((err = ' Error: User does not confirmed')) {
        setTakeTaskFail(true);
        setTakeTaskFailString(
          `Ошибка, Ваш профиль пока не был авторизован, попробуйте позже.`,
        );
      } else {
        setTakeDeliveryFail(true);
        setTakeDeliveryFailString(`Упс, что то пошло не так, попробуйте позже`);
      }
    }
  }

  ////функция чтобы волонтер взял оброе дело
  async function getTask(task: ITask) {
    const id: number = task.id;
    const taskDate = new Date(task.start_date);
    const date = taskDate.getDate();
    const month = getMonthCorrectEndingName(taskDate);
    const hours =
      taskDate.getHours() < 10
        ? '0' + taskDate.getHours()
        : taskDate.getHours();
    const minutes =
      taskDate.getMinutes() < 10
        ? '0' + taskDate.getMinutes()
        : taskDate.getMinutes();
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
          `Ошибка, Ваш профиль пока не был авторизован, попробуйте позже.`,
        );
      } else {
        setTakeTaskFail(true);
        setTakeTaskFailString(`Упс, что то пошло не так, попробуйте позже`);
      }
    }
  }

  const station = nearestDelivery?.location?.subway || 'Станция не указана';
  const address = nearestDelivery?.location?.address || 'Адрес не указан';
  const users: IUser[] = [];
  const points = 5;

  const deliveryStatus = nearestDelivery
    ? nearestDelivery.is_completed
      ? 'Завершена'
      : nearestDelivery.is_active
        ? 'Активная'
        : 'Ближайшая'
    : 'Нет доставок';

  return (
    <>
      <div className="flex flex-col min-h-full mb-20 overflow-x-hidden">
        <div>
          <SliderStories />
          {isLoading ? (
            <div>Загрузка доставок...</div>
          ) : error || !nearestDelivery ? (
            <div>Доставок пока нет</div>
          ) : (
            <DeliveryType
              status={deliveryStatus}
              points={points}
              onDeliveryClick={() => setIsRouteSheetsOpen(true)}
            />
          )}
          <Search
            showSearchInput={false}
            showInfoSection={true}
            users={users}
            onUserClick={() => {}}
            station={station}
            address={address}
          />

          {deliveryStatus === 'Ближайшая' && <DeliveryInfo />}

          {!isRouteSheetsOpen && (
            <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl h-fit overflow-x-hidden">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                showHeader={true}
                headerName="Расписание доставок"
                showFilterButton={false}
                showDatePickerButton={false}
              />
              {filteredDeliveries.length > 0 ? (
                <SliderCardsDeliveriesCurator
                  deliveries={filteredDeliveries}
                  myDeliveries={myCurrent}
                  switchTab={switchTab}
                  getDelivery={getDelivery}
                  stringForModal={takeDeliverySuccessDateName}
                  takeDeliverySuccess={takeDeliverySuccess}
                  setTakeDeliverySuccess={setTakeDeliverySuccess}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </div>
        {!isRouteSheetsOpen && (
          <div className="mt-[6px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl overflow-x-hidden mb-20 h-fit">
            <div className="text-start font-gerbera-h1 text-light-gray-black ml-4 dark:text-light-gray-white pt-4">
              Другие добрые дела
            </div>
            {allAvaliableTasks.length > 0 ? (
              <SliderCardsTaskCurator
                tasks={allAvaliableTasks}
                switchTab={switchTab}
                getTask={getTask}
                stringForModal={takeTaskSuccessDateName}
                takeTaskSuccess={takeTaskSuccess}
                setTakeTaskSuccess={setTakeTaskSuccess}
              />
            ) : (
              <div className="flex flex-col w-[300px] items-center mt-10 h-[100px] justify-between ml-4 mb-5">
                <LogoNoTaskYet className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
                <p className="dark:text-light-gray-1">
                  Скоро тут появятся добрые дела
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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

export default MainTabCurator;
