import SliderStories from "../../../components/SliderStories/SliderStories"
//import NextTask from "../../../components/NextTask/NextTask"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCards from "../../../components/SliderCards/SliderCards"
import { DetailedInfoDelivery, DetailedInfoTask } from "../../../components/DetailedInfoDeliveryTask/DetailedInfoDeliveryTask"
import { useState } from "react"

const MainTabVolunteer = () => {
const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="mt-2 mb-4 bg-light-gray-white">
        <SliderStories />
        <Calendar />
        <SliderCards />
        <button onClick={() => {setIsOpen(true)}} className="btn-B-GreenDefault">Open</button>
        {isOpen == true ? (<DetailedInfoDelivery isOpen={isOpen} onOpenChange={setIsOpen} />): ""}
        {/* <NextTask taskName="Уборка" taskType="Уборка" taskDate="10 Окт" taskPoints={5} /> */}
      </div>
    </>
  )
}

export default MainTabVolunteer