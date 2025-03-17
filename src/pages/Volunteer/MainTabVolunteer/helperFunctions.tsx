import {  postDeliveryTake,  getVolunteerDeliveries,  type IDelivery,  type IVolunteerDeliveries,} from '../../../api/apiDeliveries';
import {  getMetroCorrectName,  getMonthCorrectEndingName,} from '../../../components/helperFunctions/helperFunctions';
import {  getAllAvaliableTasks,  postTaskAccept,  getMyTasksNoFilter,  type ITask,} from '../../../api/apiTasks';


  ///// убираем все неактивные (завершенные заявки из списка)
  function filterDeliveries(deliveries:IDelivery[],setFilteredDeliveries:React.Dispatch<React.SetStateAction<IDelivery[]>>, setFilteredDeliveriesBeforeCalendarFilter:React.Dispatch<React.SetStateAction<IDelivery[]>>) {
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


async function getMyDeliveries(token:string|null, setMyCurrent:React.Dispatch<React.SetStateAction<IDelivery[]>>) {
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


async function getAllTasks(token:string|null,setAllAvaliableTasks: React.Dispatch<React.SetStateAction<ITask[]>>) {
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


 ////функция чтобы волонтер взял доставку
async function getDeliveryFromServer(delivery: IDelivery, token: string | null, setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setTakeDeliverySuccessDateName: React.Dispatch<React.SetStateAction<string>>,
  setDeliveryForReservation: React.Dispatch<React.SetStateAction<IDelivery | undefined>>,
  setTakeDeliveryFail: React.Dispatch<React.SetStateAction<boolean>>,
  setTakeDeliveryFailString: React.Dispatch<React.SetStateAction<string>>,
  setTakeTaskFail: React.Dispatch<React.SetStateAction<boolean>>,
  setTakeTaskFailString: React.Dispatch<React.SetStateAction<string | JSX.Element>>
) {
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
          setTakeTaskFailString(<p>Вы сможете записаться после того, как ваша заявка пройдет проверку.< br /> 
          📩 <a href={ 'https://t.me/volunteers_dari_edu'} target = "_blank"  className = 'text-light-brand-green ' >
          @volunteers_dari_edu</a></p >,);
       }  else {
        setTakeDeliveryFail(true);
        setTakeDeliveryFailString(`Упс, что то пошло не так, попробуйте позже`);
      }
    }
  } 
}


function getDelivery(delivery: IDelivery, setTakeDeliverySuccessDateName:React.Dispatch<React.SetStateAction<string>>, setDeliveryForReservation:React.Dispatch<React.SetStateAction<IDelivery|undefined>>, setTakeDeliveryModal:React.Dispatch<React.SetStateAction<boolean>>) {
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
  async function getTaskFromServer(task: ITask, token: string | null, setTakeTaskSuccess: React.Dispatch<React.SetStateAction<boolean>>,  setTakeTaskSuccessDateName:React.Dispatch<React.SetStateAction<string>>, setTakeTaskFail:React.Dispatch<React.SetStateAction<boolean>>, setTakeTaskFailString:React.Dispatch<React.SetStateAction<string|JSX.Element>>, ) {
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
        setTakeTaskFailString(<p>Вы сможете записаться после того, как ваша заявка пройдет проверку.<br/>
          📩 <a href={'https://t.me/volunteers_dari_edu'} target="_blank" className='text-light-brand-green ' >
            @volunteers_dari_edu</a></p >,);
      } else {
        setTakeTaskFail(true);
        setTakeTaskFailString(`Упс, что то пошло не так, попробуйте позже`);
      }
    }
  }


async function getAllMyTasks(token:string|null, setAllMyTasksId:React.Dispatch<React.SetStateAction<number[]>>) {
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


export {filterDeliveries, getMyDeliveries, getAllTasks, getDelivery, getDeliveryFromServer, getTaskFromServer, getAllMyTasks}