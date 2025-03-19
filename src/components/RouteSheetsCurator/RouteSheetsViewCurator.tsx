import React, { useState, useEffect } from 'react';
import { TAddress } from '../../api/routeSheetApi';
import Camera from '../../assets/icons/photo.svg?react';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';
import { type TServerResponsePhotoReport } from '../../api/apiPhotoReports';
import './index.css';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import copy from 'clipboard-copy'; // Импортируем библиотеку
import { Modal } from '../ui/Modal/Modal';
import { UploadPic } from '../UploadPicForPhotoReport/UploadPicForPhotoReport';
import { submitPhotoReport } from '../RouteSheetsVolunteer/helperFunctions';

interface IRouteSheetsViewProps {
  routes: TAddress[];
  myPhotoReports: TServerResponsePhotoReport[];
  deliveryId: number;
  routeSheetId: number;
  sendPhotoReportSuccess: boolean;
  setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const RouteSheetsView: React.FC<IRouteSheetsViewProps> = ({
  routes,
  myPhotoReports,
  deliveryId,
  routeSheetId,
  sendPhotoReportSuccess,
  setSendPhotoReportSuccess,
}) => {
  const [fullView, setFullView] = useState<boolean[]>(
    Array(routes.length).fill(false),
  ); // раскрываем детали о благополучателе

  const [object, setObj] = useState<[number, string][]>([]); /// массив с сылками на фотографии с фотоотчетов
  const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора
  const [comment, setComment] = useState<[number, string][]>([]);
  const [beneficiarIsAbsent, setBeneficiarIsAbsent] = useState<
    [number, boolean][]
  >([]);

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

  const [unactive, setUnactive] = useState<
    ('Отправить' | 'Отправка' | 'Отправлен')[]
  >(Array(routes.length).fill('Отправить'));
  const [uploadPictureModal, setUploadPictureModal] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  const [uploadedFileLink, setUploadedFileLink] = useState<string[]>(
    Array(routes.length).fill(''),
  );

  const [fileUploaded, setFileUploaded] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  const [sendMessage, setSendMessage] = useState<string>('');

  const [isSending, setIsSending] = useState(false); //// отслеживаем отправку фотоотчета
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sendPhotoReportFail, setSendPhotoReportFail] = useState(false);

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
    <div className="flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black space-y-1">
      {!routes || routes.length == 0 ||routes.find(route => route.address.length == 0 || route.beneficiar.length == 0) ? (
        <div  className="w-full bg-light-gray-white dark:bg-light-gray-7-logo pb-4 dark:text-light-gray-white text-center font-gerbera-h3 rounded-b-2xl  flex flex-col justify-between items-center">
          Упс, этот маршрутный лист пуст!
        </div>
      ) : (
        routes.map((route, index) => (
          <div
            key={index}
            className="pb-8 w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center mt-1 pt-[40px] h-fit p-4 "
          >
            <div className="w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center ">
              <div className="flex w-full items-left justify-between ">
                <p
                  className=" font-gerbera-h3 bg-light-gray-white dark:bg-light-gray-7-logo  text-light-brand-green cursor-pointer w-full max-w-[72%] h-fit overflow-auto text-wrap border-none  focus:outline-none selection:bg-none resize-none "
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
                >
                  {route.address}
                </p>
                {isTouchAddress[index] && (
                  <p className=" opacity-1 bg-light-gray-white dark:bg-light-gray-7-logo shadow-xl font-gerbera-h3  text-light-gray-black  dark:text-light-gray-white ToastViewport ToastRoot">
                    Адрес скопирован
                  </p>
                )}
                {array.indexOf(route.beneficiar[0].address) != -1 &&
                object[array.indexOf(route.beneficiar[0].address)][1].length >
                  0 ? (
                  <button className="w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-1 dark:bg-light-gray-6 text-light-brand-green">
                    <a
                      href={
                        object[array.indexOf(route.beneficiar[0].address)][1]
                      }
                    >
                      Ссылка
                    </a>
                  </button>
                ) : (
                  <Camera className="w-[26px] h-[26px] min-h-[26px] min-w-[26px] rounded-full fill-light-gray-3 " />
                )}
              </div>
              <div className="  dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit self-start ">
                {route.beneficiar.map(ben => (
                  <div key={ben.full_name + index}>
                    <p className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-3 mt-8 mb-4">
                      {ben.full_name}
                      <br />
                    </p>
                    {ben.phone && ben.phone.length > 0 && (
                      <p
                        className=" px-3 py-[6px] font-gerbera-h3 selection:bg-none text-light-brand-green inline w-[113px] h-30px bg-light-gray-1 dark:bg-light-gray-6 rounded-[40px] mr-2"
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

              {array.indexOf(route.beneficiar[0].address) != -1 &&
                comment[array.indexOf(route.beneficiar[0].address)][1].length >
                  0 && (
                  <div className="self-start mt-[20px] w-full bg-light-gray-1 dark:bg-light-gray-6 min-h-[60px] rounded-2xl p-3 text-light-gray-8-text dark:text-light-gray-1 font-gerbera-h3 focus: outline-0">
                    Комментарий
                    <br />
                    <p className="text-light-gray-5 font-gerbera-sub3 dark:text-light-gray-3 mt-[6px]">
                      {comment[array.indexOf(route.beneficiar[0].address)][1]}
                    </p>
                  </div>
                )}
              {array.indexOf(route.beneficiar[0].address) != -1 &&
                beneficiarIsAbsent[
                  array.indexOf(route.beneficiar[0].address)
                ][1] && (
                  <p className=" text-light-gray-5 mt-4 dark:text-light-gray-2 font-gerbera-sub3 self-start">
                    Благополучателя нет на месте
                  </p>
                )}
            </div>
            {array.indexOf(route.beneficiar[0].address) != -1 &&
            object[array.indexOf(route.beneficiar[0].address)][1].length > 0 ? (
              ''
            ) : (
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
            )}
            <div className="w-full">
              {route.beneficiar.find(
                ben => ben.comment && ben.comment.length > 0,
              ) && (
                <div className="flex items-center justify-between w-full mb-2 mt-[20px]">
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
                  key={`fullView${index}`}
                  className="flex justify-center items-center w-full"
                >
                  <div className="flex flex-col items-start w-full h-fit space-y-[14px]">
                    {route.beneficiar.find(
                      ben => ben.comment && ben.comment.length > 0,
                    ) && (
                      <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                        Информация
                        {route.beneficiar.map((ben, index) => (
                          <p
                            key={ben.comment.slice(0, 5) + index}
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
            </div>
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
                sendPhotoReportFunc={submitPhotoReport}
                name={route.address}
                idForComment={route.beneficiar[0].id}
                setSendMessage={setSendMessage}
                setUnactive={setUnactive}
                setIsSending={setIsSending}
                routeSheetId={routeSheetId}
                deliveryId={deliveryId}
                routes={routes}
                setSendPhotoReportSuccess={setSendPhotoReportSuccess}
                setErrorMessage={setErrorMessage}
                setSendPhotoReportFail={setSendPhotoReportFail}
              />
            </Modal>
          </div>
        ))
      )}
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
      <Modal onOpenChange={() => {}} isOpen={isSending}>
        <div className="h-screen items-center flex flex-col justify-center ">
          <div className="loader"></div>
        </div>
      </Modal>
    </div>
  );
};

export default RouteSheetsView;
