import React, { useContext, useState, useEffect } from 'react';
// import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { TokenContext } from '../../core/TokenContext';
import Camera from '../../assets/icons/photo.svg?react';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';

import {
  getPhotoReports,
  type TServerResponsePhotoReport,
} from '../../api/apiPhotoReports';

interface IRouteSheetsViewProps {
  routes: TAddress[];
  deliveryId: number;
}

const RouteSheetsView: React.FC<IRouteSheetsViewProps> = ({
  routes,
  deliveryId,
}) => {
  const { token } = useContext(TokenContext);

  const [myPhotoReports, setMyPhotoReports] = useState<TServerResponsePhotoReport[]>([]);
  const [fullView, setFullView] = useState<boolean[]>(Array(routes.length).fill(false)); // раскрываем детали о благополучателе

  


  async function requestPhotoReports() {
    if (token) {
      try {
        let result = await getPhotoReports(token);
        let filtered = result
          .filter(report => report.delivery_id == deliveryId)
          .filter(report => {
            if (report.route_sheet_id == routes[0].route_sheet) return report;
          });
        setMyPhotoReports(filtered);
      } catch (err) {
        console.log(err, 'getPhotoReports has failed RouteSheetCurator');
      }
    }
  }

  useEffect(() => {
    requestPhotoReports();
  }, []);

  const [object, setObj] = useState<[number, string][]>([]); /// массив с сылками на фотографии с фотоотчетов
  const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора
  const [comment, setComment] = useState<[number, string][]>([]);
  const [beneficiarIsAbsent, setBeneficiarIsAbsent] = useState<[number, boolean][]>([]);

  function checkoForUploadedReports() {
    const arr: number[] = [];
    const obj: [number, string][] = [];
    const comm: [number, string][] = [];
    const isAbsent: [number, boolean][] = [];

    if (myPhotoReports.length > 0 && routes.length > 0) {
      routes.forEach(route => {
        obj.push([route.beneficiar[0].address, '']);
        comm.push([route.beneficiar[0].address, '']);
        isAbsent.push([route.beneficiar[0].address, false]);
        arr.push(route.beneficiar[0].address);
      });
      myPhotoReports.forEach(report => {
        if (arr.indexOf(report.address) != -1) {
          obj[arr.indexOf(report.address)][1] = report.photo_view;
          comm[arr.indexOf(report.address)][1] = report.comment;
          isAbsent[arr.indexOf(report.address)][1] = report.is_absent;
        }
      });

      setObj(obj);
      setArr(arr);
      setComment(comm);
      setBeneficiarIsAbsent(isAbsent);
    }
  }

  useEffect(() => {
    checkoForUploadedReports();
  }, [myPhotoReports]);

  return (
    <div className="flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black space-y-1">
      {routes.map((route, index) => (
        <div key={index} className='flex flex-col w-full h-fit bg-light-gray-white dark:bg-light-gray-7-logo p-4 space-y-[14px] rounded-2xl mt-1'>
          <div
            className="w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center "
          >
            <div className="flex w-full items-center justify-between">
              <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-white max-w-[80%]">
                {route.address}
              </p>
              {array.indexOf(route.beneficiar[0].address) != -1 &&
              object[array.indexOf(route.beneficiar[0].address)][1].length >
                0 ? (
                <button className="w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-1 dark:bg-light-gray-6 text-light-brand-green">
                  <a
                    href={object[array.indexOf(route.beneficiar[0].address)][1]}
                  >
                    Ссылка
                  </a>
                </button>
              ) : (
                <Camera className="w-[26px] h-[26px] min-h-[26px] min-w-[26px] rounded-full fill-light-gray-3 " />
              )}
            </div>
           
            {array.indexOf(route.beneficiar[0].address) != -1 &&
              comment[array.indexOf(route.beneficiar[0].address)][1].length > 0 && (
            <div className="self-start w-full mt-2 bg-light-gray-1 dark:bg-light-gray-6 min-h-[60px] rounded-2xl p-3 text-light-gray-8-text dark:text-light-gray-1 font-gerbera-h3 focus: outline-0">
              Комментарий
              <br />
              <p className="text-light-gray-5 font-gerbera-sub3 dark:text-light-gray-3 mt-[6px]">
                {comment[array.indexOf(route.beneficiar[0].address)][1]}
              </p>
            </div>
          )}
          {array.indexOf(route.beneficiar[0].address) != -1 &&
              beneficiarIsAbsent[array.indexOf(route.beneficiar[0].address)][1] && (
            <p className=" text-light-gray-5 dark:text-light-gray-1 font-gerbera-sub3 mt-2 self-start">
              Благополучателя нет на месте
            </p>
          )}
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between w-full ">
              <p className="font-gerbera-h3 text-light-gray-5">Дополнительно</p>
              <div
                className="w-6 h-6 cursor-pointer mt-[14px]"
                onClick={() =>
                  setFullView(prev =>
                    prev.map((isOpen, idx) =>
                      idx === index ? !isOpen : isOpen,
                    ),
                  )
                }
              >
                <Arrow_down
                  className={`mt-2 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer  ${fullView[index] ? 'transform rotate-180' : ''}`}
                />
              </div>
            </div>
            {fullView[index] && (
              <div className="flex justify-center items-center w-full mt-[14px]">
                <div className="flex flex-col items-start w-full h-fit space-y-[14px]">
                  <div className="bg-light-gray-1  dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                    Благополучатель
                    <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                      {route.beneficiar[0].full_name}
                    </p>
                  </div>

                  {route.beneficiar[0].category &&
                    route.beneficiar[0].category.length > 0 && (
                      <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                        Категория
                        <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                          {route.beneficiar[0].category}
                        </p>
                      </div>
                    )}
                  {route.beneficiar[0].phone &&
                    route.beneficiar[0].phone.length > 0 && (
                      <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                        Основной телефон
                        <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                          {route.beneficiar[0].phone}
                        </p>
                      </div>
                    )}
                  {route.beneficiar[0].second_phone &&
                    route.beneficiar[0].second_phone.length > 0 && (
                      <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                        Запасной телефон
                        <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                          {route.beneficiar[0].second_phone}
                        </p>
                      </div>
                    )}
                  {route.beneficiar[0].comment &&
                    route.beneficiar[0].comment.length > 0 && (
                      <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                        Информация
                        <p className="font-gerbera-sub3 mb-[4px] text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                          {route.beneficiar[0].comment}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteSheetsView;
