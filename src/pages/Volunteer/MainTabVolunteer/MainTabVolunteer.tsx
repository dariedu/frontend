import SliderStories from "../../../components/SliderStories/SliderStories"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCards from "../../../components/SliderCards/SliderCards"
import {DetailedInfoTask} from "../../../components/DetailedInfoDeliveryTask/DetailedInfoDeliveryTask"
import { useState } from "react"

type TMainTabVolunteerProps = {
  switchTab:React.Dispatch<React.SetStateAction<string>>
}

const MainTabVolunteer:React.FC<TMainTabVolunteerProps> = ({switchTab}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <div className="mt-2 mb-4 bg-light-gray-white">
        <SliderStories />
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <SliderCards />
      <button onClick={() => {setIsOpen(true)}} className="btn-B-GreenDefault">OpenTask</button>
        {isOpen == true ? (<DetailedInfoTask isOpen={isOpen} onOpenChange={setIsOpen} switchTab={switchTab} />): ""}
      </div>
    </>
  )
}

export default MainTabVolunteer