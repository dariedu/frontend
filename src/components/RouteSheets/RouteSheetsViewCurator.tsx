import React, { useContext, useState, useEffect} from 'react';
import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { TokenContext } from '../../core/TokenContext';

import { getPhotoReports, type TServerResponsePhotoReport} from '../../api/apiPhotoReports';


interface IRouteSheetsViewProps {
  routes: TAddress[]
 // deliveryId:number
}


const RouteSheetsView: React.FC<IRouteSheetsViewProps> = ({
  routes,
  //deliveryId
}) => {


  const { token } = useContext(TokenContext);

  const [myPhotoReports, setMyPhotoReports] = useState<TServerResponsePhotoReport[]>([]);
  // const []

async function requestPhotoReports() {
  if (token) {
    try {
      let result = await getPhotoReports(token);
      let filtered = result.filter(report => {
        if (report.route_sheet_id == routes[0].route_sheet)
        return report
      })
       setMyPhotoReports(filtered)
    } catch (err) {
      console.log(err, "getPhotoReports has failed RouteSheetCurator")
  }
}
}

useEffect(() => {
  requestPhotoReports()
}, [])


const [object, setObj] = useState<[number, string][]>([]);/// массив с сылками на фотографии с фотоотчетов
const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора

 function checkoForUploadedReports() {
  const arr: number[] = [];
  const obj: [number, string][] = [];

  if (myPhotoReports.length > 0 && routes.length > 0) {
    routes.forEach(route => {
      obj.push([route.beneficiar[0].address, ""])
      arr.push(route.beneficiar[0].address)
    });
    myPhotoReports.forEach(report => {
      if (arr.indexOf(report.address) != -1) {
        obj[arr.indexOf(report.address)][1] = report.photo_view
      }
    })
    setObj(obj)
    setArr(arr)
  }
  }
  
  useEffect(() => {
    checkoForUploadedReports()
  }, [myPhotoReports])
  
  return (
    <div className='flex flex-col items-center justify-normal'>
      {routes.map((route, index) => (
        <div
          key={index}
          className="w-full bg-light-gray-1 dark:bg-light-gray-6 p-4 rounded-2xl flex justify-between items-center mt-[12px] "
        >
          <div className="flex flex-col items-start h-fit">
            <p className="font-gerbera-h3 text-light-gray-8-text mb-[4px] dark:text-light-gray-1">
              {route.address}
            </p>
           
            <p className="font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-3">
            {route.beneficiar[0].full_name}
            </p>
            {route.beneficiar[0].category && route.beneficiar[0].category.length > 0 && (
            <p className="font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-3">
            Категория: {route.beneficiar[0].category}
            </p>
            )}
            {route.beneficiar[0].phone && route.beneficiar[0].phone.length > 0 && (
            <p className="font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-3">
            Основной телефон: {route.beneficiar[0].phone}
          </p>
            )}
            {route.beneficiar[0].second_phone && route.beneficiar[0].second_phone.length > 0 && (
            <p className="font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-3">
            Запасной телефон: {route.beneficiar[0].second_phone}
          </p>
            )}
             {route.beneficiar[0].comment && route.beneficiar[0].comment.length > 0 && (
                <p className="font-gerbera-sub1 mb-[4px] text-light-gray-5 dark:text-light-gray-3">
               Комментарий: {route.beneficiar[0].comment}
                 </p>
            )} 
          </div>
          {/* If avatar or placeholder */}
            {(array.indexOf(route.beneficiar[0].address) != -1 && object[array.indexOf(route.beneficiar[0].address)][1].length > 0) ? (
            <button className='w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-white text-light-brand-green'><a  href={object[array.indexOf(route.beneficiar[0].address)][1]}>Ссылка</a></button>
            ) : (
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center"> <Avatar className="w-[32px] h-[32px] rounded-full"/></div>
            )}
           
        </div>
      ))}
    </div>
  );
};

export default RouteSheetsView;
