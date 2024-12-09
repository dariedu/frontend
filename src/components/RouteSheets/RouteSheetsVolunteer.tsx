import React, {useState, useContext, useEffect} from 'react';
import RouteSheetsViewVolunteer from './RouteSheetsViewVolunteer';
import {IRouteSheet} from '../../api/routeSheetApi';
import Small_sms from "./../../assets/icons/small_sms.svg?react";
import Arrow_right from './../../assets/icons/arrow_right.svg?react';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';
import * as Avatar from '@radix-ui/react-avatar';
import { getPhotoReports, type TServerResponsePhotoReport} from '../../api/apiPhotoReports';
import { TokenContext } from '../../core/TokenContext';
import { UserContext } from '../../core/UserContext';

interface RouteSheetsProps {
  status: 'Активная' | 'Ближайшая' | 'Завершенная' 
  routeSheetsData: IRouteSheet[]
  onClose: () => void
  deliveryId: number
  curatorName:string
  curatorTelegramNik: string
  curatorImg:string
}

const RouteSheetsVolunteer: React.FC<RouteSheetsProps> = ({
  status,
  routeSheetsData,
  onClose,
  deliveryId,
  curatorName,
  curatorTelegramNik,
  curatorImg
}) => {


  const [openRouteSheets, setOpenRouteSheets] = useState<boolean[]>(Array(routeSheetsData.length).fill(false));
  const [myPhotoReports, setMyPhotoReports] = useState<TServerResponsePhotoReport[]>([])
  const { token } = useContext(TokenContext);
  const { currentUser } = useContext(UserContext);
  const [sendPhotoReportSuccess, setSendPhotoReportSuccess] = useState<boolean>(false);

  ///запрашиваем все репорты и отбираем только отчеты этого пользователя
  async function requestPhotoReports() {
    if (token && currentUser) {
      try {
        let result = await getPhotoReports(token);
        let filtered = result.filter(report => report.delivery_id == deliveryId).filter(report => {
          if (report.user.id == currentUser.id)
           return report
        })
        setMyPhotoReports(filtered)
      } catch (err) {
        console.log(err, " getPhotoReports failed RouteSheetVolunteer")
    }
  }
  }
  
  useEffect(() => {
    requestPhotoReports()
  }, [sendPhotoReportSuccess])

  return ( 
    <div className="w-full max-w-[500px] bg-light-gray-1 dark:bg-light-gray-black rounded-xl flex flex-col overflow-y-auto h-screen pb-[74px]" onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-center px-4 pb-1 mb-1 h-[60px] min-h-[60px] text-light-gray-black rounded-b-xl bg-light-gray-white dark:bg-light-gray-7-logo w-full">
        <Arrow_right  className={`stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer transform rotate-180 `} onClick={onClose}/>
        <h2 className="font-gerbera-h1 text-lg text-light-gray-black dark:text-light-gray-1 ml-4 ">{status} доставка</h2>
      </div>
      <div className="flex flex-col">
      <div className="w-full h-[67px] bg-light-gray-white rounded-2xl flex items-center justify-between px-4 dark:bg-light-gray-7-logo">
          <div className="flex">
            
          <Avatar.Root className="inline-flex items-center justify-center h-[32px] w-[32px] bg-light-gray-1 dark:bg-light-gray-8-text rounded-full">
              <Avatar.Image
                src={curatorImg}
                className="h-[32px] w-[32px] object-cover rounded-full cursor-pointer"
              />
              <Avatar.Fallback
                className="text-black dark:text-white"
              >
                {curatorName? curatorName[0] : 'A'}
              </Avatar.Fallback>
            </Avatar.Root>
                  <div className="felx flex-col justify-center items-start ml-4">
                    <h1 className="font-gerbera-h3 text-light-gray-8-text text-start dark:text-light-gray-1">
                      {curatorName}
                    </h1>
                    <p className="font-gerbera-sub3 text-light-gray-5 text-start dark:text-light-gray-3">
                      Куратор
                    </p>
                  </div>
                </div>
              <a href={'https://t.me/' + curatorTelegramNik} target="_blank">
              <Small_sms className="w-[36px] h-[35px]"/>
                </a>
              </div>
        {routeSheetsData.map((routeS, index) => {
          return (
            <div key={routeS.id} className="mt-1 rounded-xl bg-light-gray-white dark:bg-light-gray-7-logo min-h-[60px] flex flex-col justify-around">
              <div className="flex items-center justify-between w-[96%] mb-2">
                <span className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-4 p-4">
                  {`Маршрутный лист: ${routeS.name}`}
                </span>
                <div
                  className="w-6 h-6 cursor-pointer"
                  onClick={() =>
                    setOpenRouteSheets(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? !isOpen : isOpen,
                      )
                    )
                  }
                >
                  <Arrow_down  className={`mt-2 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer  ${ openRouteSheets[index] ? 'transform rotate-180' : "" }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
              </div>
              {openRouteSheets[index] && (
                <RouteSheetsViewVolunteer
                  photoReports={myPhotoReports}
                  routeSheetId={routeSheetsData[index].id}
                  routes={routeS.address.map(addr => (addr))}
                  deliveryId={deliveryId}
                  sendPhotoReportSuccess={sendPhotoReportSuccess}
                  setSendPhotoReportSuccess={setSendPhotoReportSuccess}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSheetsVolunteer;
