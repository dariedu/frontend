import SliderStories from "../../../components/SliderStories/SliderStories"
//import NextTask from "../../../components/NextTask/NextTask"
import Calendar from "../../../components/Calendar/Calendar"
import SliderCards from "../../../components/SliderCards/SliderCards"
const MainTabVolunteer = () => {
  return (
    <>
      <div className="mt-2 mb-4 bg-light-gray-white">
        <SliderStories />
        <Calendar />
        <SliderCards/>
        {/* <NextTask taskName="Уборка" taskType="Уборка" taskDate="10 Окт" taskPoints={5} /> */}
      </div>
    </>
  )
}

export default MainTabVolunteer