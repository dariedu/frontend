
import Calendar from "../../../components/Calendar/Calendar";
import NearestDelivery from "../../../components/NearestDelivery/NearestDelivery";
import NearestTask from "../../../components/NearestTask/NearestTask";
//import Logo from "./../../../assets/icons/Logo.svg"
//C:\Users\gonch\Desktop\IT shit\telegram_app\frontend\src\assets\icons\Logo.svg



const CalendarTabVolunteer = () => {

let hasTasks: boolean = false;

  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-center" >
        <Calendar />
        {hasTasks ? (
          <>
            <NearestDelivery />
            <NearestTask />
          </>
        ): (
          <div className="w-full h-vh flex flex-col items-center py-[20px] mt-2 rounded-2xl">
          <img src="./../../src/assets/icons/LogoNoTaskYet.svg" />
          <p className="font-gerbera-h2 text-light-gray-black w-[300px] mt-[28px]">Пока нет запланированных добрых дел</p>
        </div>  
        )}
      </div>

    </>
  )
}

export default CalendarTabVolunteer