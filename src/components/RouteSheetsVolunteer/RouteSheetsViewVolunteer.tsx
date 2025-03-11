import React, { useState, useEffect } from 'react';
//import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { Modal } from '../ui/Modal/Modal';
import {type TServerResponsePhotoReport } from '../../api/apiPhotoReports';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { UploadPic } from '../UploadPicForPhotoReport/UploadPicForPhotoReport';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';
import './index.css';
import { submitPhotoReport } from './helperFunctions';

import copy from 'clipboard-copy'; // Импортируем библиотеку

interface IRouteSheetsViewProps {
  routes: TAddress[];
  deliveryId: number;
  routeSheetId: number;
  photoReports: TServerResponsePhotoReport[];
  sendPhotoReportSuccess: boolean;
  setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const RouteSheetsViewVolunteer: React.FC<IRouteSheetsViewProps> = ({
  routes,
  deliveryId,
  routeSheetId,
  photoReports,
  sendPhotoReportSuccess,
  setSendPhotoReportSuccess,
}) => {
  const [uploadedFileLink, setUploadedFileLink] = useState<string[]>(
    Array(routes.length).fill(''),
  );
  //const [routeAddressId, setRouteAddressId] = useState<number[]>(Array(routes.length).fill(NaN));
  const [fileUploaded, setFileUploaded] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );

  // const [comment, addComment] = useState<string[]>(Array(routes.length).fill(''));
  // const [files, setFiles] = useState<Blob[]>(  Array(routes.length).fill(new Blob()),); ////форматит фото в блоб файл
  //  const [sendPhotoReportSuccess, setSendPhotoReportSuccess] = useState(false);
  const [sendPhotoReportFail, setSendPhotoReportFail] = useState(false);
  const [sendMessage, setSendMessage] = useState<string>('');
  const [uploadPictureModal, setUploadPictureModal] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  // const [beneficiarIsAbsent, setBeneficiarIsAbsent] = useState<boolean[]>(
  //   Array(routes.length).fill(false),
  // ); ////  проверяем благополучатель на месте или нет
  const [unactive, setUnactive] = useState<
    ('Отправить' | 'Отправка' | 'Отправлен')[]
  >(Array(routes.length).fill('Отправить'));
  const [noPhoto, setNoPhoto] = useState<boolean>(false);
  const [fullView, setFullView] = useState<boolean[]>(
    Array(routes.length).fill(false),
  ); // раскрываем детали о благополучателе
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const { currentUser } = useContext(UserContext);
  // const { token } = useContext(TokenContext);

  const [object, setObj] = useState<[number, string][]>([]); /// массив с сылками на фотографии с фотоотчетов
  const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора

  const [isTouchAddress, setIsTouchAddress] = useState(
    Array(routes.length).fill(false),
  ); // Состояние нажатия на адрес
  const [openMaps, setOpenMaps] = useState(false); // открываем модалку для открытия карт
  const [adressForMaps, setAdressForMaps] = useState(''); // адрес для открытия в яндекс картах
  const [isTouchPhone, setIsTouchPhone] = useState(
    Array(routes.length).fill(false),
  ); // Состояние нажатия на телефон
  const [openCall, setOpenCall] = useState(false); // открываем модалку для набора номера
  const [phoneForCall, setPhoneForCall] = useState(''); // номер телефона для набора
  const [isSending, setIsSending] = useState(false); //// отслеживаем отправку фотоотчета

  function checkoForUploadedReports() {
    const arr: number[] = [];
    const obj: [number, string][] = [];

    if (routes.length > 0) {
      routes.forEach(route => {
        obj.push([route.beneficiar[0].address, '']);
        arr.push(route.beneficiar[0].address);
        // console.log(route.beneficiar[0].address, "route.beneficiar[0].address")
      });

      if (photoReports.length > 0) {
        photoReports.forEach(report => {
          if (arr.indexOf(report.address) != -1) {
            obj[arr.indexOf(report.address)][1] = report.photo_view;
          }
        });
        obj.forEach((i, index) => {
          if (i[1].length > 0) {
            setUnactive(prev =>
              prev.map((string, idx) => (idx === index ? 'Отправлен' : string)),
            );
          }
        });
      }
      setArr(arr);
      setObj(obj);
    }
  }

  useEffect(() => {
    checkoForUploadedReports();
  }, [sendPhotoReportSuccess]);

  // function handleAddComment(index: number, comment: string) {
  //   localStorage.removeItem('comment');
  //   addComment(prev =>
  //     prev.map((string, idx) => (idx === index ? comment : string)),
  //   );
  //   // setOpenComment(prev =>
  //   //   prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
  //   // );
  // }

  

  const openYandexMaps = (address: string) => {
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent('Москва, ' + address.slice(0, 20))}`;
    window.open(url, '_blank');
  };
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSingleClick = (
    str: string,
    phoneOrAdress: 'phone' | 'address',
  ) => {
    if (phoneOrAdress == 'address') {
      setAdressForMaps(str);
      setOpenMaps(true);
    } else {
      setPhoneForCall(str);
      setOpenCall(true);
    }
  };

  const handleDoubleClick = (
    index: number,
    str: string,
    phoneOrAdress: 'phone' | 'address',
  ) => {
    copy(str);
    if (phoneOrAdress == 'address') {
      setIsTouchAddress(prev =>
        prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
      );
      setTimeout(() => {
        setIsTouchAddress(prev =>
          prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
        );
      }, 1000);
    } else {
      setIsTouchPhone(prev =>
        prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
      );
      setTimeout(() => {
        setIsTouchPhone(prev =>
          prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
        );
      }, 1000);
    }
  };

  const handleClick = (
    index: number,
    str: string,
    phoneOrAdress: 'phone' | 'address',
  ) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout); // Отменяем выполнение одинарного клика
      setClickTimeout(null);
      handleDoubleClick(index, str, phoneOrAdress); // Выполняем действие для двойного клика
    } else {
      // Устанавливаем задержку для одинарного клика
      const timeout = setTimeout(() => {
        handleSingleClick(str, phoneOrAdress);
        setClickTimeout(null);
      }, 300); // Задержка в 300 мс
      setClickTimeout(timeout);
    }
  };
  return (
    <div
      key={routeSheetId + 'routeSheetViewVolunteer'}
      className={`flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black w-full `}
    >
      {!routes || routes.length == 0 ? (
        <div className="w-full bg-light-gray-white dark:bg-light-gray-7-logo py-4 dark:text-light-gray-white text-center font-gerbera-h3 mt-1 rounded-2xl flex flex-col justify-between items-center">
          Упс! Этот маршрутный лист пуст!
        </div>
      ) : (
        routes.map((route, index) => (
          <div
            key={route.id + routeSheetId + 'routeSheetViewVolunteer'}
            className={`w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center mt-1 pt-[40px] h-fit p-4
             ${route.beneficiar[0].address && array.indexOf(route.beneficiar[0].address) != -1 && object[array.indexOf(route.beneficiar[0].address)][1].length > 0 ? 'opacity-70 dark:opacity-65 ' : ''}
            `}
          >
            <div className="flex w-full items-left justify-between ">
              <p

                className=" font-gerbera-h3 bg-transparent text-light-brand-green h-fit cursor-pointer w-full max-w-[72%] overflow-auto text-wrap border-none  focus:outline-none selection:bg-none resize-none "
                onClick={e => {
                  e.preventDefault();
                  handleClick(index, route.address, 'address');
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  copy(route.address);
                  setIsTouchAddress(prev =>
                    prev.map((isOpen, ind) =>
                      ind == index ? !isOpen : isOpen,
                    ),
                  );
                  setTimeout(() => {
                    setIsTouchAddress(prev =>
                      prev.map((isOpen, ind) =>
                        ind == index ? !isOpen : isOpen,
                      ),
                    );
                  }, 1000);
                }}
              >{route.address}</p>
              {isTouchAddress[index] && (
                <p className=" bg-light-gray-white shadow-xl font-gerbera-h3  text-light-gray-black dark:bg-light-gray-7-logo opacity-1 dark:text-light-gray-white ToastViewport ToastRoot">
                  Адрес скопирован
                </p>
              )}
              {route.beneficiar[0].address &&
                array.indexOf(route.beneficiar[0].address) != -1 &&
                object[array.indexOf(route.beneficiar[0].address)][1].length >
                  0 && (
                  <button className="w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-1 dark:bg-light-gray-6 text-light-brand-green">
                    <a
                      href={
                        object[array.indexOf(route.beneficiar[0].address)][1]
                      }
                    >
                      Ссылка
                    </a>
                  </button>
                )}
             
            </div>
            {route.dinners && route.dinners > 0 && <div className='dark:text-light-gray-1 font-gerbera-h3 rounded-2xl text-light-gray-8-text w-full h-fit self-start'>Обедов к доставке: { route.dinners }</div>}
            <div className="  dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit self-start ">
              {route.beneficiar.map(ben => (
                <div key={ben.full_name + index}>
                  <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-2 mt-8 mb-4">
                    {ben.full_name}
                    <br />
                  </p>
                  {ben.phone && ben.phone.length > 0 && (
                    <p
                      className=" dark:bg-light-gray-6 bg-light-gray-1 px-3 py-[6px] font-gerbera-h3 selection:bg-none text-light-brand-green inline w-[113px] h-30px rounded-[40px] mr-2"
                      onClick={() => {
                        handleClick(index, ben.phone, 'phone');
                      }}
                      onContextMenu={e => {
                        e.preventDefault();
                        copy(ben.phone);
                        setIsTouchPhone(prev =>
                          prev.map((isOpen, ind) =>
                            ind == index ? !isOpen : isOpen,
                          ),
                        );
                        setTimeout(() => {
                          setIsTouchPhone(prev =>
                            prev.map((isOpen, ind) =>
                              ind == index ? !isOpen : isOpen,
                            ),
                          );
                        }, 1000);
                      }}
                    >
                      {ben.phone}
                    </p>
                  )}
                  {ben.second_phone && ben.second_phone.length > 0 && (
                    <p
                      className=" px-3 py-[6px] font-gerbera-h3 selection:bg-none text-light-brand-green  inline w-[113px] h-30px bg-light-gray-1 dark:bg-light-gray-6 rounded-[40px] mr-2 "
                      onClick={() => {
                        handleClick(index, ben.second_phone, 'phone');
                      }}
                      onContextMenu={e => {
                        e.preventDefault();
                        copy(ben.second_phone);
                        setIsTouchPhone(prev =>
                          prev.map((isOpen, ind) =>
                            ind == index ? !isOpen : isOpen,
                          ),
                        );
                        setTimeout(() => {
                          setIsTouchPhone(prev =>
                            prev.map((isOpen, ind) =>
                              ind == index ? !isOpen : isOpen,
                            ),
                          );
                        }, 1000);
                      }}
                    >
                      {ben.second_phone}
                    </p>
                  )}
                </div>
              ))}
              {isTouchPhone[index] && (
                <p className=" opacity-1 bg-light-gray-white shadow-xl font-gerbera-h3 text-light-gray-black dark:bg-light-gray-7-logo dark:text-light-gray-white  ToastViewport ToastRoot ">
                  Телефон скопирован
                </p>
              )}
            </div>
            <div className="h-fit flex flex-col items-center justify-between mt-8 mb-[20px] space-y-2">
              <button
                className={
                  unactive[index] == 'Отправить'
                    ? 'btn-B-WhiteDefault dark:text-light-brand-green text-center'
                    : 'btn-B-GreenInactive  cursor-default text-center'
                }
                onClick={() => {
                  if (unactive[index] == 'Отправить') {
                    setUploadPictureModal(prev =>
                      prev.map((isOpen, ind) =>
                        ind == index ? !isOpen : isOpen,
                      ),
                    );
                  } else if (
                    unactive[index] == 'Отправлен' ||
                    unactive[index] == 'Отправка'
                  ) {
                  }
                }}
              >
                {unactive[index] == 'Отправить'
                  ? 'Фотоотчет'
                  : unactive[index] == 'Отправка'
                    ? 'Отправка'
                    : 'Фотоотчет отправлен'}
              </button>
            </div>
            {route.beneficiar.find(
              ben => ben.comment && ben.comment.length > 0,
            ) && (
              <div className="flex items-center justify-between w-full mb-2 ">
                <p
                  className="font-gerbera-h3 text-light-gray-5"
                  onClick={() =>
                    setFullView(prev =>
                      prev.map((isOpen, idx) =>
                        idx === index ? !isOpen : isOpen,
                      ),
                    )
                  }
                >
                  Дополнительно
                </p>
                <div
                  className="w-6 h-6 cursor-pointer"
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
            )}
            {fullView[index] && (
              <div
                className="flex justify-center items-center w-full -[32px]"
                key={index + 'beneficiar'}
              >
                <div className="flex flex-col items-start w-full h-fit space-y-[14px]">
                  {route.beneficiar.find(
                    ben => ben.comment && ben.comment.length > 0,
                  ) && (
                    <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                      Информация
                      {route.beneficiar.map((ben, index) => (
                        <p
                          key={ben.comment + index}
                          className="font-gerbera-sub3 mb-[4px] text-light-gray-5 dark:text-light-gray-3 mt-[6px]"
                        >
                          {ben.comment}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <Modal
              isOpen={uploadPictureModal[index]}
              onOpenChange={() =>
                setUploadPictureModal(prev =>
                  prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
                )
              }
              onOpenChangeComment={() =>
                setUploadPictureModal(prev =>
                  prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
                )
              }
            >
              <UploadPic
                onOpenChange={() =>
                  setUploadPictureModal(prev =>
                    prev.map((isOpen, ind) =>
                      ind == index ? !isOpen : isOpen,
                    ),
                  )
                }
                index={index}
                setUploadedFileLink={setUploadedFileLink}
                setFileUploaded={setFileUploaded}
                fileUploaded={fileUploaded}
                uploadedFileLink={uploadedFileLink}
                // beneficiarIsAbsentInd={beneficiarIsAbsent[index]}
                // setBeneficiarIsAbsent={setBeneficiarIsAbsent}
                // setFiles={setFiles}
                // files={files}
                sendPhotoReportFunc={submitPhotoReport}
                name={route.address}
                // onSave={handleAddComment}
                idForComment={route.beneficiar[0].id}
                // savedComment={comment[index]}
                setSendMessage={setSendMessage}
                setUnactive={setUnactive}
                setIsSending={setIsSending}
                routeSheetId={routeSheetId}
                deliveryId={deliveryId}
                routes={routes}
                // beneficiarIsAbsent={beneficiarIsAbsent}
                // comment={comment}
                setSendPhotoReportSuccess={setSendPhotoReportSuccess}
                setErrorMessage={setErrorMessage}
                setSendPhotoReportFail={setSendPhotoReportFail}
              />
            </Modal>
          </div>
        ))
      )}
      <ConfirmModal
        isOpen={sendPhotoReportFail}
        onOpenChange={setSendPhotoReportFail}
        onConfirm={() => {
          setSendPhotoReportFail(false);
          setErrorMessage('');
        }}
        title={
          errorMessage.length > 0 ? (
            <p>Упс! {errorMessage}.</p>
          ) : (
            <p>
              Упс, что-то пошло не так
              <br /> Попробуйте позже.
            </p>
          )
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={sendPhotoReportSuccess}
        onOpenChange={setSendPhotoReportSuccess}
        onConfirm={() => setSendPhotoReportSuccess(false)}
        title={
          <p>
            Фотоотчет по адресу: <br /> {sendMessage} {}
            успешно отправлен.
          </p>
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={noPhoto}
        onOpenChange={setNoPhoto}
        onConfirm={() => setNoPhoto(false)}
        title={<p>Пожалуйста, загрузите фотографию</p>}
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={openMaps}
        onOpenChange={setOpenMaps}
        onConfirm={() => openYandexMaps(adressForMaps)}
        title={<p>Открыть в Яндекс картах?</p>}
        description=""
        onCancel={() => setOpenMaps(false)}
        confirmText="Открыть"
        cancelText="Отмена"
        isSingleButton={false}
      />
      <ConfirmModal
        isOpen={openCall}
        onOpenChange={setOpenCall}
        onConfirm={() => setOpenCall(false)}
        title={<p>Позвонить {phoneForCall}?</p>}
        description=""
        onCancel={() => setOpenCall(false)}
        confirmText={<a href={`tel:${phoneForCall}`}>Позвонить</a>}
        cancelText="Отмена"
        isSingleButton={false}
      />
      <Modal onOpenChange={() => {}} isOpen={isSending}>
        <div className="h-screen items-center flex flex-col justify-center ">
          <div className="loader"></div>
        </div>
      </Modal>
    </div>
  );
};

export default RouteSheetsViewVolunteer;
