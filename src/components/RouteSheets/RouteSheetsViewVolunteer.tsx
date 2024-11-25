import React, {useState, useContext} from 'react';
import Avatar from '../../../src/assets/icons/forRouteSheetSvg.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { Modal } from '../ui/Modal/Modal';
import Comment from '../Comment/Comment';
import { TPhotoReport } from '../../api/apiPhotoReports';
import { UserContext } from '../../core/UserContext';
import { TokenContext } from '../../core/TokenContext';
import { postPhotoReport } from '../../api/apiPhotoReports';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

interface IRouteSheetsViewProps {
  routes: TAddress[]
  deliveryId:number
}


const RouteSheetsViewVolunteer: React.FC<IRouteSheetsViewProps> = ({
  routes,
  deliveryId
}) => {

const [uploadedFileLink, setUploadedFileLink] = useState(Array(routes.length).fill(''));
const [fileUploaded, setFileUploaded] = useState<boolean[]>(Array(routes.length).fill(false))
const [openComment, setOpenComment] = useState<boolean[]>(Array(routes.length).fill(false));
const [comment, addComment] = useState(Array(routes.length).fill(''));
const [blob, setBlob] = useState<Blob>(new Blob()); ////форматит фото в блоб файл
const [sendPhotoReportSuccess, setSendPhotoReportSuccess] = useState(false);
const [sendPhotoReportFail, setSendPhotoReportFail] = useState(false);
const [sendMessage, setSendMessage] = useState<string>('')
  
  const { currentUser } = useContext(UserContext);
  const {token} =useContext(TokenContext)
  
function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, index:number): void {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    let uploadedFilesList: string[] = [];
    uploadedFileLink.forEach(i => uploadedFilesList.push(i));
    uploadedFilesList[index] = URL.createObjectURL(file);
    setUploadedFileLink(uploadedFilesList);
    let fileUploadedList: boolean[] = [];
    fileUploaded.forEach(i => fileUploadedList.push(i));
    fileUploadedList[index] = true;
    setFileUploaded(fileUploadedList);
  }
  }
  
  function handleAddComment(index: number, address: string, comment:string) {
    console.log(index, address, comment);
    localStorage.removeItem('comment');
    addComment(prev =>prev.map((string, idx) => idx === index ? comment : string))
    setOpenComment(prev =>prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))
  }


  async function submitPhotoReport(index: number) {
    setSendMessage('')
    if (currentUser && token) {
      const obj: TPhotoReport = {
        photo: uploadedFileLink[index],
        comment: comment[index],
        routeSheetId: currentUser?.id,
        deliveryId: deliveryId,
        //address:'36'
      }
     let result1 = await fetch(uploadedFileLink[index])
      .then(res => res.blob())
      .then(blob => {
        setBlob(blob);
        return blob
      });

      if (result1 && currentUser) {
        const formData = new FormData();
        for (let key in obj) {
          if (key == 'photo_view') {
            formData.set('photo', blob, `photo.jpeg`);
          }else if (key == 'photo_download') {
            formData.set('photo', blob, `photo.jpeg`);
          } else {
            const typedKey = key as
            | keyof TPhotoReport
            | keyof typeof obj;
           formData.set(typedKey, String(obj[typedKey])); 
          }
        }
        
        try {
          let result = await postPhotoReport(token, obj);
          if (result) {
            setSendMessage(routes[index].address)
            setSendPhotoReportSuccess(true)
          }
        } catch (err) {
          setSendPhotoReportFail(true)
          console.log(err)
        }
      }
}
      
  }

  
  return (
    <div className='flex flex-col items-center justify-normal bg-light-gray-1 dark:bg-light-gray-black w-full'>
      {/* Route Details */}
      {routes.map((route, index) => (
        <div
          key={index}
          className="w-full bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex flex-col justify-between items-center mt-1 h-fit p-4"
        >
          <div className='flex w-full items-center justify-between'>
            <div className='flex justify-center items-center'>
              <p className='rounded-full bg-light-brand-green text-light-gray-white h-6 w-6 min-w-6 min-h-6 text-center'>{index+1}</p>
          <div className="flex flex-col items-start h-fit ml-3">
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
            </div>
          
          {/* If avatar or placeholder */}
          {/* <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center"> */}
            {/* {route.link && route.link.length > 0 ? (
            <img className="w-[32px] h-[32px] rounded-full bg-light-gray-4" src={route.link} />
              ) : ( */}
              {fileUploaded[index] ? (
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center relative" >
                  <input onChange={(e)=>handleFileChange(e, index)} type="file"  accept="image/*" className='w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full bg-none absolute opacity-0 cursor-pointer'/>
                  <img
                    src={uploadedFileLink[index]}
                    className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center relative">
                  <input onChange={(e)=>handleFileChange(e, index)} type="file" accept="image/*" className='w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full bg-none absolute opacity-0 cursor-pointer' />
                  <Avatar className="w-[32px] h-[32px] min-h-[32px] min-w-[32px] rounded-full" />
                </div>
              )
              
              }
               
            {/* )} */}
          {/* </div> */}
          </div>
          {comment[index].length > 0 &&
            <div className='w-[328px] bg-light-gray-1 min-h-[60px] rounded-2xl py-4 px-3 text-light-gray-black font-gerbera-sub3 focus: outline-0 mt-2'
            >Ваш комментарий к доставке:<br />
            <p className='text-light-gray-4'>{comment[index]}</p>
            </div>
          }
          
          <div className='h-[102px] flex flex-col justify-between mt-4'>
          <button className='btn-B-WhiteDefault' onClick={()=>setOpenComment(prev =>
                      prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))}>
          Добавить комментарий
          </button>
          <button className='btn-B-WhiteDefault' onClick={()=>submitPhotoReport(index)}>
          Отправить
          </button>
          </div>
          <Modal onOpenChange={()=>setOpenComment(prev =>
          prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))} isOpen={openComment[index]}>
         <Comment name={route.address} onSave={handleAddComment} index={index} savedComment={comment[index]} />
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
