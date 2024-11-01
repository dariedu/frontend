import SliderStories from "../../../components/SliderStories/SliderStories"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCardsDeliveries from "../../../components/SliderCards/SliderCardsDeliveries"
//import SliderCards from "../../../components/SliderCards/SliderCards"
//import {DetailedInfoTask} from "../../../components/DetailedInfoDeliveryTask/DetailedInfoDeliveryTask"
import { useState, useContext } from "react";
import { DeliveryContext } from "../../../core/DeliveryContext";

 


type TMainTabVolunteerProps = {
  switchTab:React.Dispatch<React.SetStateAction<string>>
}

const MainTabVolunteer:React.FC<TMainTabVolunteerProps> = ({switchTab}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
   ////// используем контекст доставок, чтобы вывести количество доступных баллов 
const { deliveries} = useContext(DeliveryContext);;
 ////// используем контекст

  return (
    <>
      <div className="mt-2 mb-4 bg-light-gray-white">
        <SliderStories />
        <div className="text-start font-gerbera-h1 text-light-gray-black ml-4">Расписание доставок</div>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <SliderCardsDeliveries deliveries={deliveries} switchTab={switchTab}/>
      </div>
    </>
  )
}

export default MainTabVolunteer