import {useState, useContext, useEffect} from 'react'
import Calendar from "../../../components/Calendar/Calendar";
import NearestDeliveryVolunteer from "../../../components/NearestDelivery/NearestDeliveryVolunteer";
import { getVolunteerDeliveries, postDeliveryCancel, type IDelivery, type IVolunteerDeliveries } from '../../../api/apiDeliveries';
import { UserContext } from '../../../core/UserContext';
///import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import { getMonthCorrectEndingName, getMetroCorrectName } from '../../../components/helperFunctions/helperFunctions';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';


const CalendarTabVolunteer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
 // const [avaliable, setAvaliable] = useState<IDelivery[]>([])
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([])
  const [myPast, setMyPast] = useState<IDelivery[]>([])
  const [cancelDeliverySuccess, setCancelDeliverySuccess] = useState<boolean>(false)
  const [cancelDeliveryFail, setCancelDeliveryFail]= useState<boolean>(false)
  const [cancelDeliverySuccessString, setCancelDeliverySuccessString] = useState<string>("");

  ////// используем контекст юзера, чтобы вывести количество доступных баллов
   const userValue = useContext(UserContext);
   const token = userValue.token;
  ////// используем контекст

  async function getMyDeliveries() {
    const avaliable:IDelivery[] = [];
    const current: IDelivery[] = [];
    const past: IDelivery[] = [];
   
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
           result['мои активные доставки'].forEach(i => { current.push(i)});
           result['мои завершенные доставки'].forEach(i => { past.push(i)});
           result['свободные доставки'].forEach(i => { avaliable.push(i)});     
           //setAvaliable(avaliable);
           setMyCurrent(current);
           setMyPast(past)}
    }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
}

  useEffect(() => {
    getMyDeliveries()
  }, [cancelDeliverySuccess])

    ////функция чтобы волонтер отменил взятую доставку
async function cancelTakenDelivery(delivery:IDelivery) {
  const id: number = delivery.id;
try {
   if (token) {
     let result: IDelivery = await postDeliveryCancel(token, id, delivery);
     if (result) {
       const deliveryDate = new Date(delivery.date);
       const date = deliveryDate.getDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours();
       const minutes = deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
       setCancelDeliverySuccessString(finalString);
       setCancelDeliverySuccess(true)   
  }
}
} catch (err) {
  setCancelDeliveryFail(true)
  console.log(err, "CalendarTabVolunteer cancelTakenDelivery fail")
}
}
  
  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-center" >
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div className='flex flex-col h-full  mb-20 overflow-auto'>
          {myCurrent.length > 0 ?
              (myCurrent.map((i) => {
                const currentStatus = i.in_execution == true ? "active" : "nearest";
                return(
                <div key={i.id}>
                  <NearestDeliveryVolunteer delivery={i}status={currentStatus} cancelFunc={cancelTakenDelivery} />
                </div>)
              })
            ) : ""
          
          }
          {myPast.length > 0 ? (
           myPast.map((i:IDelivery) => (
                <div key={i.id}>
                  <NearestDeliveryVolunteer delivery={i} status={"completed"} />
                </div>)
        )) : ""
          }
       

        </div>
          {/* <div className="w-full h-vh flex flex-col items-center py-[20px] mt-2 rounded-2xl">
          <img src="./../../src/assets/icons/LogoNoTaskYet.svg" />
          <p className="font-gerbera-h2 text-light-gray-black w-[300px] mt-[28px]">Пока нет запланированных добрых дел</p>
        </div>   */}
      </div>
    
      <ConfirmModal
        isOpen={cancelDeliverySuccess}
        onOpenChange={setCancelDeliverySuccess}
        onConfirm={() => setCancelDeliverySuccess(false)}
        title={`Участие в доставке ${cancelDeliverySuccessString} отменено`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
        <ConfirmModal
        isOpen={cancelDeliveryFail}
        onOpenChange={setCancelDeliveryFail}
        onConfirm={() => setCancelDeliveryFail(false)}
        title={`Упс, что-то пошло не так, попробуйте позже`}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />

    </>
  )
}

export default CalendarTabVolunteer