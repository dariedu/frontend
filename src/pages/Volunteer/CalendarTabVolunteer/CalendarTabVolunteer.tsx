import {useState, useContext, useEffect} from 'react'
import Calendar from "../../../components/Calendar/Calendar";
import NearestDeliveryVolunteer from "../../../components/NearestDelivery/NearestDeliveryVolunteer";
//import NearestTask from "../../../components/NearestTask/NearestTask";
//import Logo from "./../../../assets/icons/Logo.svg"
//C:\Users\gonch\Desktop\IT shit\telegram_app\frontend\src\assets\icons\Logo.svg
import { getVolunteerDeliveries, type IDelivery, type IVolunteerDeliveries } from '../../../api/apiDeliveries';
import { UserContext } from '../../../core/UserContext';

const CalendarTabVolunteer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [myDeliveries, setMyDeliveries] = useState<IMyDeliveries>({ avaliable: [], myCurrent: [], myPast: []})
   
  
  ////// используем контекст юзера, чтобы вывести количество доступных баллов
   const userValue = useContext(UserContext);
   const token = userValue.token;
  ////// используем контекст

  interface IMyDeliveries{
    avaliable: IDelivery[]
    myCurrent: IDelivery[]
    myPast: IDelivery[]
  }

  async function getMyDeliveries() {
      const my:IMyDeliveries = { avaliable: [], myCurrent: [], myPast: []}
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
           result['мои активные доставки'].forEach(i => { my.myCurrent.push(i)});
           result['мои завершенные доставки'].forEach(i => { my.myPast.push(i) });
           result['свободные доставки'].forEach(i => { my.avaliable.push(i) });     
           setMyDeliveries(my)
      }
    }
    } catch (err) {
      console.log(err, "CalendarTabVolunteer getMyDeliveries fail")
    }
}

  useEffect(() => {
    getMyDeliveries()
  }, [])
  
  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-center" >
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        {myDeliveries.myCurrent.length > 0 ? (myDeliveries.myCurrent.map(i =>
        {return <div key={i.id}>
             <NearestDeliveryVolunteer delivery={i} />
          </div>
         
        })
      ): ("")}

          {/* <div className="w-full h-vh flex flex-col items-center py-[20px] mt-2 rounded-2xl">
          <img src="./../../src/assets/icons/LogoNoTaskYet.svg" />
          <p className="font-gerbera-h2 text-light-gray-black w-[300px] mt-[28px]">Пока нет запланированных добрых дел</p>
        </div>   */}
        
      </div>

    </>
  )
}

export default CalendarTabVolunteer