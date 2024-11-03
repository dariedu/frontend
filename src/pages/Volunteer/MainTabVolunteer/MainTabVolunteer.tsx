import SliderStories from "../../../components/SliderStories/SliderStories"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCardsDeliveries from "../../../components/SliderCards/SliderCardsDeliveries"
import { useState, useContext, useEffect } from "react";
import { DeliveryContext } from "../../../core/DeliveryContext";
import { postDeliveryTake, getVolunteerDeliveries, type IDelivery, type IVolunteerDeliveries } from "../../../api/apiDeliveries";
import { UserContext } from "../../../core/UserContext";
import { getMetroCorrectName, getMonthCorrectEndingName } from "../../../components/helperFunctions/helperFunctions";


type TMainTabVolunteerProps = {
  switchTab:React.Dispatch<React.SetStateAction<string>>
}

const MainTabVolunteer:React.FC<TMainTabVolunteerProps> = ({switchTab}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [takeDeliverySuccess, setTakeDeliverySuccess] = useState<boolean>(false);
  const [takeDeliverySuccessDateName, setTakeDeliverySuccessDateName] = useState<string>('');
  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [myAvaliable, setMyAvaliable] = useState<IDelivery[]>([]);
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]);
   console.log(myAvaliable, myCurrent)
////// используем контекст доставок, чтобы вывести количество доступных баллов 
  const { deliveries } = useContext(DeliveryContext);
  const userValue = useContext(UserContext);
  const token = userValue.token;
  ////// используем контекст
  
  ///// убираем все неактивные (завершенные заявки из списка)
  function filterDeliveries() {
    if (deliveries.length > 0) {
      const filtered: IDelivery[] = deliveries.filter(i => i.is_completed == false && i.is_active == true);
      setFilteredDeliveries(filtered)
    }
  }

  async function getMyDeliveries() {
    const avaliable: IDelivery[] = [];
    const current: IDelivery[] = [];
    try {
      if (token) {
        let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
        if (result) {
          result['мои активные доставки'].forEach(i => { current.push(i)});
          result['свободные доставки'].forEach(i => { avaliable.push(i)});
          setMyAvaliable(avaliable);
          setMyCurrent(current);
        }
      }
    } catch (err) {
        console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
      }
  }


  useEffect(() => {
    getMyDeliveries()
      filterDeliveries()
}, [deliveries])
  
  
////функция чтобы волонтер взял доставку
async function getDelivery(delivery:IDelivery) {
  const id: number = delivery.id;
try {
   if (token) {
     let result: IDelivery = await postDeliveryTake(token, id, delivery);
     if (result) {
       const deliveryDate = new Date(delivery.date);
       const date = deliveryDate.getDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours();
       const minutes = deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`
       setTakeDeliverySuccess(true)
       setTakeDeliverySuccessDateName(finalString)
  }
}
} catch (err) {
  console.log(err, "MainTabVolunteer getMDelivery fail")
}
  }
  


  return (
    <>
      <div className="mt-2 mb-4 bg-light-gray-white">
        <SliderStories />
        <div className="text-start font-gerbera-h1 text-light-gray-black ml-4">Расписание доставок</div>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        {filteredDeliveries.length > 0 ? (
        <SliderCardsDeliveries deliveries={filteredDeliveries} switchTab={switchTab} getDelivery={getDelivery} stringForModal={takeDeliverySuccessDateName} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
        ): ""}
        
      </div>
    </>
  )
}

export default MainTabVolunteer