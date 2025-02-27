import React, { useState, useContext, useEffect } from 'react';
//import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { Modal } from '../ui/Modal/Modal';
import Comment from '../Comment/Comment';
import {
  TPhotoReport,
  type TServerResponsePhotoReport,
} from '../../api/apiPhotoReports';
import { UserContext } from '../../core/UserContext';
import { TokenContext } from '../../core/TokenContext';
import { postPhotoReport } from '../../api/apiPhotoReports';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { UploadPic } from '../UploadPicForPhotoReport/UploadPicForPhotoReport';
import Camera from '../../assets/icons/photo.svg?react';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';

interface IRouteSheetsViewProps {
  routes: TAddress[]
  deliveryId: number
  routeSheetId: number
  photoReports: TServerResponsePhotoReport[]
  sendPhotoReportSuccess: boolean
  setSendPhotoReportSuccess:React.Dispatch<React.SetStateAction<boolean>>
}

const RouteSheetsViewVolunteer: React.FC<IRouteSheetsViewProps> = ({
  routes,
  deliveryId,
  routeSheetId,
  photoReports,
  sendPhotoReportSuccess,
  setSendPhotoReportSuccess
}) => {
  const [uploadedFileLink, setUploadedFileLink] = useState<string[]>(
    Array(routes.length).fill(''),
  );
  //const [routeAddressId, setRouteAddressId] = useState<number[]>(Array(routes.length).fill(NaN));
  const [fileUploaded, setFileUploaded] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  const [openComment, setOpenComment] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  const [comment, addComment] = useState(Array(routes.length).fill(''));
  const [files, setFiles] = useState<Blob[]>(Array(routes.length).fill(new Blob())); ////форматит фото в блоб файл
  // const [sendPhotoReportSuccess, setSendPhotoReportSuccess] = useState(false);
  const [sendPhotoReportFail, setSendPhotoReportFail] = useState(false);
  const [sendMessage, setSendMessage] = useState<string>('');
  const [uploadPictureModal, setUploadPictureModal] = useState<boolean[]>(
    Array(routes.length).fill(false),
  );
  const [beneficiarIsAbsent, setBeneficiarIsAbsent] = useState<boolean[]>(
    Array(routes.length).fill(false),
  ); ////  проверяем благополучатель на месте или нет
  const [unactive, setUnactive] = useState<
    ('Отправить' | 'Отправка' | 'Отправлен')[]
  >(Array(routes.length).fill('Отправить'));
  const [noPhoto, setNoPhoto] = useState<boolean>(false);
  const [fullView, setFullView] = useState<boolean[]>(
    Array(routes.length).fill(false),
  ); // раскрываем детали о благополучателе
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { currentUser } = useContext(UserContext);
  const { token } = useContext(TokenContext);



  const [object, setObj] = useState<[number, string][]>([]); /// массив с сылками на фотографии с фотоотчетов
  const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора



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

  function handleAddComment(index: number, comment: string) {
    localStorage.removeItem('comment');
    addComment(prev =>
      prev.map((string, idx) => (idx === index ? comment : string)),
    );
    setOpenComment(prev =>
      prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
    );
  }

  async function submitPhotoReport(index: number) {
    setUnactive(prev =>
      prev.map((string, idx) => (idx === index ? 'Отправка' : string)),
    );
    setSendMessage('');
    if (currentUser && token) {
      const obj: TPhotoReport = {
        photo: files[index],
        comment: comment[index],
        route_sheet_id: routeSheetId,
        delivery_id: deliveryId,
        address: routes[index].id,
        is_absent: beneficiarIsAbsent[index],
      };

      // let blobPhoto = await fetch(uploadedFileLink[index])
      //   .then(res => res.blob())
      //   .then(blob1 => {
      //     setBlob(blob1);
      //     return blob1;
      //   });
      
      if (files[index] && currentUser) {
        const formData = new FormData();
        for (let key in obj) {
          if (key == 'photo') {
            formData.append('photo', files[index]);
          } else if (key == 'is_absent') {
            formData.set(
              'is_absent',
              String(beneficiarIsAbsent[index] ? 'True' : 'False'),
            );
          } else {
            const typedKey = key as keyof TPhotoReport | keyof typeof obj;
            formData.set(typedKey, String(obj[typedKey]));
          }
        }
        // Создаем AbortController для установки таймаута
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Таймаут 15 секунд
        
        try {
          await postPhotoReport(token, formData, controller.signal);

          setSendMessage(routes[index].address);
          setSendPhotoReportSuccess(true);
          setUnactive(prev =>
            prev.map((string, idx) => (idx === index ? 'Отправлен' : string)),
          );
        } catch (err: any) {
          if (err == 'Error: AxiosError: Network Error') {
            setErrorMessage('возникла проблема с интернет соединением. Возможно фотография слишком тяжелая, попробуйте выбрать фото меньшего размера и попробуйте снова отправить фотоотчет')
          } else if (err == 'Error: Данный токен недействителен для любого типа токена') {
            setErrorMessage('возникла ошибка авторизации, пожалуйста обновите страницу и попробуйте снова отправить фотоотчет')
          } else if (err == 'Error: CanceledError: canceled') {
            console.log('загрузка прервана из-за слабого интернет соединения')
            setErrorMessage('загрузка прервана из-за слабого интернет соединения');
          }
          setSendPhotoReportFail(true);
          setUnactive(prev =>
            prev.map((string, idx) => (idx === index ? 'Отправить' : string)),
          )
        } finally {
          clearTimeout(timeoutId)
        }
      }
    }
  }
 
// routes.map((route) => (console.log(route.beneficiar[0].address, array )))
// console.log(photoReports, "photo report")
  return (
    <div key={routeSheetId + 'routeSheetWievVolunteer'} className={`flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black w-full `}>
      {(!routes || routes.length == 0) ?
        (<div className='w-full bg-light-gray-white dark:bg-light-gray-7-logo py-4 dark:text-light-gray-white text-center font-gerbera-h3 mt-1 rounded-2xl flex flex-col justify-between items-center'
        >Упс, этот маршрутный лист пуст!</div>)
         : routes.map((route, index) => (
        <div key={route.id + routeSheetId + 'routeSheetWievVolunteer'}
          className={`w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center mt-1 h-fit p-4
             ${route.beneficiar[0].address && array.indexOf(route.beneficiar[0].address) != -1 && object[array.indexOf(route.beneficiar[0].address)][1].length > 0 ? 'opacity-70 dark:opacity-65 ' : "" }
            `}
        >
          <div className="flex w-full items-center justify-between">
            <p className="font-gerbera-h3 text-light-gray-8-text mb-[4px] dark:text-light-gray-1 max-w-[80%]">
              {route.address}
            </p>
            { route.beneficiar[0].address && array.indexOf(route.beneficiar[0].address) != -1 &&(
            object[array.indexOf(route.beneficiar[0].address)][1].length > 0 ? (
              <button className="w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-1 dark:bg-light-gray-6 text-light-brand-green">
                <a href={object[array.indexOf(route.beneficiar[0].address)][1]}>
                  Ссылка
                </a>
              </button>
            ) : fileUploaded[index] ? (
              <div
                className="w-[37px] h-[37px] min-h-[37px] min-w-[37px] rounded-full flex items-center justify-center relative"
                onClick={() =>
                  setUploadPictureModal(prev =>
                    prev.map((isOpen, ind) =>
                      ind == index ? !isOpen : isOpen,
                    ),
                  )
              }
              >
                <img
                  src={uploadedFileLink[index]}
                  className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full object-cover absolute"
                />
              </div>
            ) : (
              <div
                className="w-[37px] h-[37px] min-h-[37px] min-w-[37px] rounded-full flex items-center justify-center relative"
                onClick={() =>
                  setUploadPictureModal(prev =>
                    prev.map((isOpen, ind) =>
                      ind == index ? !isOpen : isOpen,
                    ),
                  )
                }
              >
                <Camera className="w-[26px] h-[26px] min-h-[26px] min-w-[26px] rounded-full absolute fill-light-gray-3 " />
              </div>
            ))}
          </div>
          {comment[index].length > 0 && (
            <div className="self-start w-full mt-2 bg-light-gray-1  dark:bg-light-gray-6 min-h-[60px] rounded-2xl p-3 text-light-gray-8-text dark:text-light-gray-1 font-gerbera-h3 focus: outline-0">
              Комментарий
              <br />
              <p className="text-light-gray-5 font-gerbera-sub3 dark:text-light-gray-3 mt-[6px]">
                {comment[index]}
              </p>
            </div>
          )}
          {beneficiarIsAbsent[index] && (
            <p className=" text-light-gray-5 dark:text-light-gray-1 font-gerbera-sub3 mt-2 self-start">
              Благополучателя нет на месте
            </p>
          )}
          <div className="h-fit flex flex-col items-center justify-between mt-4 space-y-2">
            {unactive[index] == 'Отправить'  && (
              <button
                className="btn-B-WhiteDefault text-light-gray-8-text"
                onClick={() =>
                  setOpenComment(prev =>
                    prev.map((isOpen, idx) =>
                      idx === index ? !isOpen : isOpen,
                    ),
                  )
                }
              >
                {comment[index].length == 0 ? 'Добавить комментарий' : "Редактировать комментарий" }
              </button>
            )}
            <button
              className={
                unactive[index] == 'Отправить' || unactive[index] == 'Отправка'
                  ? 'btn-B-WhiteDefault dark:text-light-brand-green'
                  : 'btn-B-GreenInactive  cursor-default'
              }
              onClick={() => {
                if (uploadedFileLink[index] == '' && unactive[index] == 'Отправить') {
                  setNoPhoto(true);
                } else {
                  unactive[index] == 'Отправлен'
                    ? () => {}
                    : unactive[index] == 'Отправка'
                      ? () => {}
                      : submitPhotoReport(index);
                }
              }}
            >
              {unactive[index]}
            </button>
          </div>
          <div className="flex items-center justify-between w-full mb-2 mt-4">
            <p className="font-gerbera-h3 text-light-gray-5"
            onClick={() =>
              setFullView(prev =>
                prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
              )
            }
            >Дополнительно</p>
            <div
              className="w-6 h-6 cursor-pointer"
              onClick={() =>
                setFullView(prev =>
                  prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
                )
              }
            >
              <Arrow_down
                className={`mt-2 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer  ${fullView[index] ? 'transform rotate-180' : ''}`}
              />
            </div>
          </div>
          {fullView[index] && (
            <div className="flex justify-center items-center w-full" key={index+"beneficiar"}>
              <div className="flex flex-col items-start w-full h-fit space-y-[14px]">
                <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                  {route.beneficiar.length == 1 ? 'Благополучатель' : 'Благополучатели'}
                  {route.beneficiar.map(ben => <p key={ben.full_name} className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                  {ben.full_name}
                  </p>)}
                </div>

                {route.beneficiar.find(ben => ben.category && ben.category.length > 0) && (
                    <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                    Категория
                    {route.beneficiar.map(ben => <p key={ben.category} className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                        {ben.category}
                      </p> )}
                     
                    </div>
                  )}
                {route.beneficiar.find(ben => ben.phone && ben.phone.length > 0) && (
                    <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                    Основной телефон
                    {route.beneficiar.map(ben => <p key={ben.phone} className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                        {ben.phone}
                      </p>)}
                     
                    </div>
                  )}
                {route.beneficiar.find(ben => ben.second_phone && ben.second_phone.length> 0) && (
                    <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                    Запасной телефон
                    {route.beneficiar.map(ben =><p key={ben.second_phone} className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                        {ben.second_phone}
                      </p>)}
                      
                    </div>
                  )}
                {route.beneficiar.find(ben => ben.comment && ben.comment.length > 0) && (
                    <div className="bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 rounded-2xl text-light-gray-8-text font-gerbera-sub2 w-full h-fit p-[12px]">
                    Информация
                    {route.beneficiar.map( ben=>
                    <p key={ben.comment} className="font-gerbera-sub3 mb-[4px] text-light-gray-5 dark:text-light-gray-3 mt-[6px]">
                    {ben.comment}
                  </p>
                    )}
                      
                    </div>
                  )}
              </div>
            </div>
          )}

          <Modal
            onOpenChange={() =>
              setOpenComment(prev =>
                prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
              )
            }
            onOpenChangeComment={() =>
              setOpenComment(prev =>
                prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
              )
            }
            isOpen={openComment[index]}
          >
            <Comment
              onOpenChange={() =>
                setOpenComment(prev =>
                  prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
                )
              }
              name={route.address}
              onSave={handleAddComment}
              index={index}
              id={route.beneficiar[0].id}
              savedComment={comment[index]}
            />
          </Modal>
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
                  prev.map((isOpen, ind) => (ind == index ? !isOpen : isOpen)),
                )
              }
              index={index}
              setUploadedFileLink={setUploadedFileLink}
              setFileUploaded={setFileUploaded}
              fileUploaded={fileUploaded}
              uploadedFileLink={uploadedFileLink}
              beneficiarIsAbsent={beneficiarIsAbsent[index]}
              setBeneficiarIsAbsent={setBeneficiarIsAbsent}
              setFiles={setFiles}
              files={files}
            />
          </Modal>
        </div>
      ))}
      <ConfirmModal
        isOpen={sendPhotoReportFail}
        onOpenChange={setSendPhotoReportFail}
        onConfirm={() => { setSendPhotoReportFail(false); setErrorMessage('') }}
        title={errorMessage.length > 0 ? (
          <p>
          Упс, {errorMessage}.
        </p>
        ) : (<p>
            Упс, что-то пошло не так
            <br /> Попробуйте позже.
          </p>)
          
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
            Фотоотчет по адресу: <br /> {sendMessage} { }
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
    </div>
  );
};

export default RouteSheetsViewVolunteer;
