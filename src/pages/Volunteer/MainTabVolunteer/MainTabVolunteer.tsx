import SliderStories from "../../../components/SliderStories/SliderStories"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCardsDeliveries from "../../../components/SliderCards/SliderCardsDeliveries"
import { useState, useContext, useEffect } from "react";
import { DeliveryContext } from "../../../core/DeliveryContext";
import { postDeliveryTake, getVolunteerDeliveries, type IDelivery, type IVolunteerDeliveries } from "../../../api/apiDeliveries";
import { UserContext } from "../../../core/UserContext";
import { getMetroCorrectName, getMonthCorrectEndingName } from "../../../components/helperFunctions/helperFunctions";
import ConfirmModal from "../../../components/ui/ConfirmModal/ConfirmModal";
import NearestDeliveryVolunteer from "../../../components/NearestDelivery/NearestDeliveryVolunteer";

type TMainTabVolunteerProps = {
  switchTab:React.Dispatch<React.SetStateAction<string>>
}

const MainTabVolunteer:React.FC<TMainTabVolunteerProps> = ({switchTab}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [takeDeliverySuccess, setTakeDeliverySuccess] = useState<boolean>(false);//// подтверждение бронирования доставки
  const [takeDeliverySuccessDateName, setTakeDeliverySuccessDateName] = useState<string>('');///строка для вывова названия и времени доставки в алерт
  const [takeDeliveryFail, setTakeDeliveryFail] = useState<boolean>(false); /// переменная для записи если произошла ошибка  при взятии доставки
  const [takeDeliveryFailString, setTakeDeliveryFailString] = useState<string>('');//переменная для записи названия ошибки при взятии доставки

  const [filteredDeliveries, setFilteredDeliveries] = useState<IDelivery[]>([]);
  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]);/// сверяемся есть ли доставки в моих забронированных

  
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
    const current: IDelivery[] = [];
    try {
      if (token) {
        let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
        if (result) {
          result['мои активные доставки'].forEach(i => { current.push(i)});
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
}, [deliveries, takeDeliverySuccess])
  
  
////функция чтобы волонтер взял доставку
async function getDelivery(delivery:IDelivery) {
       const id: number = delivery.id;
       const deliveryDate = new Date(delivery.date);
       const date = deliveryDate.getDate();
       const month = getMonthCorrectEndingName(deliveryDate);
       const hours = deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours();
       const minutes = deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes();    
       const subway = getMetroCorrectName(delivery.location.subway)
       const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`
     try {
      if (token) {
       let result: IDelivery = await postDeliveryTake(token, id, delivery);
       if (result) {
       setTakeDeliverySuccess(true)
       setTakeDeliverySuccessDateName(finalString)
         }
       }
       } catch (err) {
     if (err == 'Error: You have already taken this delivery') {
       setTakeDeliveryFail(true)
       setTakeDeliveryFailString(`Ошибка, доставка ${finalString}, уже у вас в календаре`)
     } else {
       setTakeDeliveryFail(true)
       setTakeDeliveryFailString(`Упс, что то пошло не так, попробуйте позже`)
       }
       }
   }
  


  return (
    <div className="flex flex-col h-fit min-h-full overflow-y-auto">
      <SliderStories />
        {myCurrent.length > 0 ?
              (myCurrent.map((i) => {
                if (i.in_execution == true) {
                  return(
                <div key={i.id}>
                  <NearestDeliveryVolunteer delivery={i} status="active" />
                </div>)
              }})
            ) : ""
          }
      <div className="mt-[6px] mb-20 bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl">
        <div className="text-start font-gerbera-h1 text-light-gray-black ml-4 dark:text-light-gray-white mt-[20px]">Расписание доставок</div>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} showHeader={false} showFilterButton={false} showDatePickerButton={false} />
        {filteredDeliveries.length > 0 ? (
          <SliderCardsDeliveries deliveries={filteredDeliveries} myDeliveries={myCurrent} switchTab={switchTab} getDelivery={getDelivery} stringForModal={takeDeliverySuccessDateName} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
        ): ""}
        
      </div>
      <ConfirmModal
        isOpen={takeDeliveryFail}
        onOpenChange={setTakeDeliveryFail}
        onConfirm={() => { setTakeDeliveryFail(false); setTakeDeliveryFailString("")}}
        title={takeDeliveryFailString}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />

    </div>
  )
}

export default MainTabVolunteer