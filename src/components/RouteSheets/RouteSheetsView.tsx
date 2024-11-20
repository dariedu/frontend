import React from 'react';
import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';

interface IRouteSheetsViewProps {
  routes: TAddress[];
}

const RouteSheetsView: React.FC<IRouteSheetsViewProps> = ({
  routes
}) => {
  console.log(routes, "routes RouteSheetsView")
  return (
    <div>
      {/* Route Details */}
      {routes.map((route, index) => (
        <div
          key={index}
          className="w-full bg-light-gray-1 p-4 rounded-lg flex justify-between items-center mb-4 mt-[12px] "
        >
          <div className="flex flex-col items-start h-fit">
            <p className="font-gerbera-h3 text-light-gray-8 mb-[4px]">
              {route.address}
            </p>
           
            <p className="font-gerbera-sub1">
            {route.beneficiar[0].full_name}
            </p>
            {route.beneficiar[0].category && route.beneficiar[0].category.length > 0 ? (
            <p className="font-gerbera-sub1 text-light-gray-5">
            Категория: {route.beneficiar[0].category}
            </p>
            ): ""}
            {route.beneficiar[0].phone && route.beneficiar[0].phone.length > 0 ? (
            <p className="font-gerbera-sub1 text-light-gray-5">
            Основной телефон: {route.beneficiar[0].phone}
          </p>
            ) : ""}
            {route.beneficiar[0].second_phone && route.beneficiar[0].second_phone.length > 0 ? (
            <p className="font-gerbera-sub1 text-light-gray-5">
            Запасной телефон: {route.beneficiar[0].second_phone}
          </p>
            ) : ""}
             {route.beneficiar[0].comment && route.beneficiar[0].comment.length > 0 ? (
                <p className="font-gerbera-sub1 mb-[4px]">
               Комментарий: {route.beneficiar[0].comment}
                 </p>
            ):""} 
          </div>
          {/* If avatar or placeholder */}
          <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center">
            {route.link && route.link.length > 0 ? (
            <img className="w-[32px] h-[32px] rounded-full bg-light-gray-4" src={route.link} />
            ) : (
                <Avatar className="w-[32px] h-[32px] rounded-full"/>
            )}
            
          </div>
        </div>
      ))}

      {/* Complete Button - Render only if not completed */}
      {/* {!isCompleted && (
        <button
          className={`btn-M-GreenDefault w-full mt-4 ${
            !isVolunteerSelected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          //onClick={onComplete}
          disabled={!isVolunteerSelected}
        >
          Завершить
        </button>
      )} */}
    </div>
  );
};

export default RouteSheetsView;
