import React, {useState, useContext, useEffect} from 'react';
import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { Modal } from '../ui/Modal/Modal';
import Comment from '../Comment/Comment';
import { TPhotoReport, type TServerResponsePhotoReport  } from '../../api/apiPhotoReports';
import { UserContext } from '../../core/UserContext';
import { TokenContext } from '../../core/TokenContext';
import { postPhotoReport } from '../../api/apiPhotoReports';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { UploadPic } from '../UploadPicForPhotoReport/UploadPicForPhotoReport';


interface IRouteSheetsViewProps {
  routes: TAddress[]
  deliveryId: number,
  routeSheetId: number,
  photoReports: TServerResponsePhotoReport[]
}


const RouteSheetsViewVolunteer: React.FC<IRouteSheetsViewProps> = ({
  routes,
  deliveryId,
  routeSheetId,
  photoReports
}) => {


  
const [uploadedFileLink, setUploadedFileLink] = useState<string[]>(Array(routes.length).fill(''));
//const [routeAddressId, setRouteAddressId] = useState<number[]>(Array(routes.length).fill(NaN));
const [fileUploaded, setFileUploaded] = useState<boolean[]>(Array(routes.length).fill(false))
const [openComment, setOpenComment] = useState<boolean[]>(Array(routes.length).fill(false));
const [comment, addComment] = useState(Array(routes.length).fill(''));
const [blob, setBlob] = useState<Blob>(new Blob()); ////форматит фото в блоб файл
const [sendPhotoReportSuccess, setSendPhotoReportSuccess] = useState(false);
const [sendPhotoReportFail, setSendPhotoReportFail] = useState(false);
const [sendMessage, setSendMessage] = useState<string>('')
const [uploadPictureModal, setUploadPictureModal] = useState<boolean[]>(Array(routes.length).fill(false));
const [beneficiarOnSite, setBeneficiarOnSite] = useState<boolean[]>(Array(routes.length).fill(true)) ////  проверяем благополучатель на месте или нет
const [unactive, setUnactive] = useState<('Отправить' | 'Отправка' | 'Отправлен')[]>(Array(routes.length).fill('Отправить'));
  
const { currentUser } = useContext(UserContext);
const {token} =useContext(TokenContext)
  
// function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, index:number): void {
//   if (e.target.files && e.target.files[0]) {
//     const file = e.target.files[0];
//     let uploadedFilesList: string[] = [];
//     uploadedFileLink.forEach(i => uploadedFilesList.push(i));
//     uploadedFilesList[index] = URL.createObjectURL(file);
//     setUploadedFileLink(uploadedFilesList);
//     let fileUploadedList: boolean[] = [];
//     fileUploaded.forEach(i => fileUploadedList.push(i));
//     fileUploadedList[index] = true;
//     setFileUploaded(fileUploadedList);
//   }
//   }

  const [object, setObj] = useState<[number, string][]>([]);/// массив с сылками на фотографии с фотоотчетов
  const [array, setArr] = useState<number[]>([]); ////массив для легкого перебора

   function checkoForUploadedReports() {
    const arr: number[] = [];
    const obj: [number, string][] = [];

    if (photoReports.length > 0 && routes.length > 0) {
      routes.forEach(route => {
        obj.push([route.beneficiar[0].address, ""])
        arr.push(route.beneficiar[0].address)
      });
      photoReports.forEach(report => {
        if (arr.indexOf(report.address) != -1) {
          obj[arr.indexOf(report.address)][1] = report.photo_view
        }
      })
      obj.forEach((i, index)=> {
        if (i[1].length > 0) {
          setUnactive(prev =>prev.map((string, idx) => idx === index ? 'Отправлен' : string))
        }
  })
      setObj(obj)
      setArr(arr)
    }
  }

  useEffect(() => {
    checkoForUploadedReports()
  }, [])

  function handleAddComment(index: number, comment:string) {
    // console.log(index, address, comment);
    localStorage.removeItem('comment');
    addComment(prev =>prev.map((string, idx) => idx === index ? comment : string))
    setOpenComment(prev =>prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))
  }




  async function submitPhotoReport(index: number) {
    setUnactive(prev =>prev.map((string, idx) => idx === index ? 'Отправка' : string))
    setSendMessage('')
    if (currentUser && token) {
      const obj: TPhotoReport = {
        photo: blob,
        comment: comment[index],
        route_sheet_id: routeSheetId,
        delivery_id: deliveryId,
        address: routes[index].id,
        is_absent: beneficiarOnSite[index]
      }
      let blobPhoto = await fetch(uploadedFileLink[index])
        .then(res => res.blob())
        .then(blob1 => {
          setBlob(blob1);
          return blob1
        });
      if (blobPhoto && currentUser) {
        const formData = new FormData();
        for (let key in obj) {
          if (key == 'photo') {
            formData.set('photo', blobPhoto, `photo_report_delId_${deliveryId}_routeS_id_${routeSheetId}.jpeg`);
          } else {
            const typedKey = key as
              | keyof TPhotoReport
              | keyof typeof obj;
            formData.set(typedKey, String(obj[typedKey]));
          }
        };

      try {
        await postPhotoReport(token, formData);
        setSendMessage(routes[index].address)
        setSendPhotoReportSuccess(true)
        setUnactive(prev =>prev.map((string, idx) => idx === index ? 'Отправлен' : string))
        } catch (err) {
        setSendPhotoReportFail(true)
        setUnactive(prev =>prev.map((string, idx) => idx === index ? 'Отправить' : string))
          console.log(err)
        }
      }
    }
  }

  
  return (
    <div className='flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black w-full'>
      {routes.map((route, index) => (
        <div
          key={index}
          className="w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center mt-1 h-fit p-4"
        >
          <div className='flex w-full items-center justify-between'>
            <div className='flex justify-center items-center'>
              {/* <p className='rounded-full bg-light-brand-green text-light-gray-white h-6 w-6 min-w-6 min-h-6 text-center'>{index+1}</p> */}
          <div className="flex flex-col items-start h-fit ml-3">
            <p className="font-gerbera-h3 text-light-gray-8-text mb-[4px] dark:text-light-gray-1">
              {route.address}
            </p>
           
            <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
            {route.beneficiar[0].full_name}
            </p>
            {route.beneficiar[0].category && route.beneficiar[0].category.length > 0 && (
            <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
            Категория: {route.beneficiar[0].category}
            </p>
            )}
            {route.beneficiar[0].phone && route.beneficiar[0].phone.length > 0 && (
            <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
            Основной телефон: {route.beneficiar[0].phone}
          </p>
            )}
            {route.beneficiar[0].second_phone && route.beneficiar[0].second_phone.length > 0 && (
            <p className="font-gerbera-sub3 text-light-gray-5 dark:text-light-gray-3">
            Запасной телефон: {route.beneficiar[0].second_phone}
          </p>
            )}
             {route.beneficiar[0].comment && route.beneficiar[0].comment.length > 0 && (
                <p className="font-gerbera-sub3 mb-[4px] text-light-gray-5 dark:text-light-gray-3">
               Комментарий: {route.beneficiar[0].comment}
                 </p>
            )} 
          </div>
            </div>
            {(array.indexOf(route.beneficiar[0].address) != -1 && object[array.indexOf(route.beneficiar[0].address)][1].length > 0) ?
                (<button className='w-28 min-w-28 h-7 min-h-7 rounded-[40px] font-gerbera-sub2 bg-light-gray-1 text-light-brand-green'><a  href={object[array.indexOf(route.beneficiar[0].address)][1]}>Ссылка</a></button>)
                : (
                  fileUploaded[index] ?
                    (<div className="w-[37px] h-[37px] min-h-[37px] min-w-[37px] rounded-full flex items-center justify-center relative" onClick={() => setUploadPictureModal(prev => prev.map((isOpen, ind) => ind == index ? !isOpen : isOpen))}>
                  <img
                    src={uploadedFileLink[index]}
                    className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full object-cover absolute"
                  />
                  </div>) : (
                  <div className="w-[37px] h-[37px] min-h-[37px] min-w-[37px] rounded-full flex items-center justify-center relative" onClick={() => setUploadPictureModal(prev => prev.map((isOpen, ind) => ind == index ? !isOpen : isOpen))}>
                    <Avatar className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full absolute"/>
                  </div>    
                )
              )}
          </div>
          {comment[index].length > 0 &&
            <div className='w-[328px] mt-2 bg-light-gray-1  dark:bg-light-gray-6 min-h-[60px] rounded-2xl py-4 px-3 text-light-gray-black dark:text-light-gray-1 font-gerbera-sub3 focus: outline-0'
            >Ваш комментарий к доставке:<br />
            <p className='text-light-gray-4 dark:text-light-gray-3'>{comment[index]}</p>
            </div>
          }
          {!beneficiarOnSite[index] &&
            <p className=' text-light-gray-black dark:text-light-gray-1 font-gerbera-sub3 mt-2'>Благополучателя нет на месте</p>
          }
          <div className='h-fit flex flex-col justify-between mt-4 space-y-2'>
            {unactive[index] == "Отправить" &&
          <button className='btn-B-WhiteDefault' onClick={() => setOpenComment(prev =>
           prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))}>
          Добавить комментарий
          </button>}
            <button className={unactive[index] == "Отправить" ? 'btn-B-WhiteDefault' : 'btn-B-WhiteDefault cursor-default'}  onClick={() => {
             unactive[index] == 'Отправка' ? ()=>{} : submitPhotoReport(index)
            }}>
              {unactive[index]}
          </button>
          </div>
          <Modal onOpenChange={()=>setOpenComment(prev =>
          prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))} isOpen={openComment[index]}>
         <Comment name={route.address} onSave={handleAddComment} index={index} savedComment={comment[index]} />
          </Modal>
          <Modal isOpen={uploadPictureModal[index]} onOpenChange={()=>setUploadPictureModal(prev=>prev.map((isOpen, ind)=>ind==index? !isOpen:isOpen))}>
          <UploadPic
          onOpenChange={()=>setUploadPictureModal(prev=>prev.map((isOpen, ind)=>ind==index? !isOpen:isOpen))}
          index={index}
          setUploadedFileLink={setUploadedFileLink }
          setFileUploaded={setFileUploaded}
          fileUploaded={fileUploaded}
          uploadedFileLink={uploadedFileLink}
          beneficiarOnSite={beneficiarOnSite[index]}
          setBeneficiarOnSite={setBeneficiarOnSite}
        />
    </Modal>
        </div>
      ))}
        <ConfirmModal
      isOpen={sendPhotoReportFail}
      onOpenChange={setSendPhotoReportFail}
      onConfirm={() => setSendPhotoReportFail(false)}
      title={
        <p>
          Упс, что-то пошло не так
          <br /> Попробуйте позже.
        </p>
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
          Фотоотчет по адресу:<br/> {sendMessage}
         <br/> успешно отправлен.
        </p>
      }
      description=""
      confirmText="Закрыть"
      isSingleButton={true}
      />
    </div>
   
  );
};

export default RouteSheetsViewVolunteer;
