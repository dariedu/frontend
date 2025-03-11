import React, { useState, useContext } from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';
import Small_pencile from './../../assets/icons/small_pencile.svg?react';
import Photo from './../../assets/icons/photo.svg?react';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import Comment from '../Comment/Comment_for_inside_photo';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import { TAddress } from '../../api/routeSheetApi';
import { UserContext } from '../../core/UserContext';
import { TokenContext } from '../../core/TokenContext';

interface IUploadPicProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  // onOpenChangeComment?: ()=>void
  index: number;
  setUploadedFileLink: React.Dispatch<React.SetStateAction<string[]>>;
  // beneficiarIsAbsentInd: boolean;
  // setBeneficiarIsAbsent: React.Dispatch<React.SetStateAction<boolean[]>>;
  uploadedFileLink: string[];
  fileUploaded: boolean[];
  setFileUploaded: React.Dispatch<React.SetStateAction<boolean[]>>;
  // setFiles: React.Dispatch<React.SetStateAction<Blob[]>>;
  // files: Blob[];
  sendPhotoReportFunc: (index: number, currentUser: any, token: string | null,
    setSendMessage: React.Dispatch<React.SetStateAction<string>>,
    setUnactive: React.Dispatch<React.SetStateAction<("Отправить" | "Отправка" | "Отправлен")[]>>,
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>, routeSheetId:number, deliveryId:number, routes:TAddress[], 
    files: Blob, comment: string, beneficiarIsAbsent: boolean, setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>, 
    setErrorMessage:React.Dispatch<React.SetStateAction<string>>,  setSendPhotoReportFail:React.Dispatch<React.SetStateAction<boolean>>) => void;
  name: string;
  // onSave: (index: number, comment: string) => void;
  idForComment: number;
  // beneficiarIsAbsent: boolean[]
  // savedComment: string;
  setSendMessage: React.Dispatch<React.SetStateAction<string>>,
  setUnactive: React.Dispatch<React.SetStateAction<("Отправить" | "Отправка" | "Отправлен")[]>>,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  routeSheetId: number,
  deliveryId: number,
  routes: TAddress[], 
  // comment: string[],
  setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>, 
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setSendPhotoReportFail: React.Dispatch<React.SetStateAction<boolean>>
}
////// в компоненте уже есть модалка, если нажать на пустую модальную область она закроется
export const UploadPic: React.FC<IUploadPicProps> = ({
  onOpenChange,
  index,
  uploadedFileLink,
  // beneficiarIsAbsentInd,
  setUploadedFileLink,
  // setBeneficiarIsAbsent,
  setFileUploaded,
  fileUploaded,
  // setFiles,
  // files,
  sendPhotoReportFunc,
  name,
  // onSave,
  idForComment,
  // beneficiarIsAbsent,
  // savedComment,
  setSendMessage,
  setUnactive,
  setIsSending,
  routeSheetId,
  deliveryId,
  routes, 
  setSendPhotoReportSuccess, 
  setErrorMessage,
  setSendPhotoReportFail
  
}) => {

  const localeStorageName = `comment${idForComment}`;
  const [errorMessageP, setErrorMessageP] = useState<string>('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [files, setFiles] = useState<Blob>(new Blob()); ////форматит фото в блоб файл
  const [comment, addComment] = useState<string>(localStorage.getItem(localeStorageName) ?? "")
  const [beneficiarIsAbsent, setBeneficiarIsAbsent] = useState<boolean>(false); ////  проверяем благополучатель на месте или нет
  
// console.log(routeSheetId, "routeSheetId")

    const { currentUser } = useContext(UserContext);
  const { token } = useContext(TokenContext);

  
  // function handleAddComment(comment: string) {
  //   addComment(comment);
  //   localStorage.removeItem('comment');
  // }



  // type TComment = typeof localeStorageName;

  const [requestBody, setRequestBody] = useState({[`${localeStorageName}`]: localStorage.getItem(localeStorageName) ?? comment ?? '' });

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: string, value: string) {
    setRequestBody({
      ...requestBody,
      [fieldName]: value,
    });
    addComment(value)
    localStorage.setItem(fieldName, value);
  }

  const handleCheckChange = (): void => {
   beneficiarIsAbsent ?  setBeneficiarIsAbsent(false) : setBeneficiarIsAbsent(true)
  };

  // Допустимые форматы файлов
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  // Максимальный размер файла (5 МБ)
  const maxFileSize = 5 * 1024 * 1024; // 5 МБ в байтах

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ): void {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessageP(
          'Неподходящий формат файла. Разрешены только JPEG, JPG.',
        );
        setIsErrorOpen(true);
      } else {
        if (file.size > maxFileSize) {
          setErrorMessageP(
            'Файл слишком большой. Рекомендованный размер до 5 МБ. Возможны сложности с отправкой фотоотчета',
          );
          setIsErrorOpen(true);
        }

        let fileList: Blob = files;
        fileList = file;
        setFiles(fileList);

        let uploadedFilesList: string[] = uploadedFileLink.slice();
        // uploadedFileLink.forEach(i => uploadedFilesList.push(i));
        uploadedFilesList[index] = URL.createObjectURL(file);
        setUploadedFileLink(uploadedFilesList);
        let fileUploadedList: boolean[] = fileUploaded.slice();
        // fileUploaded.forEach(i => fileUploadedList.push(i));
        fileUploadedList[index] = true;
        setFileUploaded(fileUploadedList);
      }
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-start dark:bg-light-gray-black w-full h-screen max-w-[500px] bg-light-gray-1 overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div
        className={`flex items-center mb-1  bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-full max-w-[500px] h-fit min-h-[60px] p-4 rounded-b-2xl`}
      >
        <button onClick={() => onOpenChange(false)}>
          <RightArrowIcon className="rotate-180 w-9 h-9 mr-[8px] stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer" />
        </button>
        <h2 className="text-light-gray-black dark:text-light-gray-1">
          Фотоотчет к доставке по адресу {name}
        </h2>
      </div>
      <div className="bg-light-gray-white dark:bg-light-gray-7-logo  rounded-2xl w-full flex justify-center items-center min-h-[234px]">
        <div className="h-[142px] w-[140px] min-h-[142px] min-w-[140px] bg-light-gray-2 dark:bg-light-gray-5 rounded-full flex justify-center items-center mb-4 relative">
          {uploadedFileLink[index].length > 0 ? (
            <img
              src={uploadedFileLink[index]}
              className={
                'h-[142px] w-[140px] min-h-[142px] min-w-[140px] size-fit rounded-full object-cover '
              }
            />
          ) : (
            <Photo className="h-[72px] w-[72px] min-h-[72px] min-w-[72px] cursor-pointer rounded-full bg-light-gray-2 fill-light-gray-white dark:bg-light-gray-5 dark:fill-light-gray-3" />
          )}
          {uploadedFileLink[index].length > 0 ? (
            ''
          ) : (
            <input
              onChange={e => handleFileChange(e, index)}
              type="file"
              accept="image/*"
              className="absolute opacity-0 h-[142px] w-[140px] rounded-full cursor-pointer"
            />
          )}
          {uploadedFileLink[index].length > 0 && (
            <>
              <Small_pencile className="absolute bottom-0 right-0  bg-light-brand-green fill-light-gray-1  rounded-full" />
              <input
                onChange={e => handleFileChange(e, index)}
                type="file"
                accept="image/*"
                className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
              />
            </>
          )}
        </div>
      </div>
      <div className="bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl w-full p-4 h-fit min-h-fit justify-center items-left flex flex-col mt-1">
        <div>
          {!beneficiarIsAbsent? (
            <CheckboxElement
              onCheckedChange={handleCheckChange}
              checked={false}
            >
              <p className="font-gerbera-sub2 dark:text-light-gray-3 my-3">
                Отметьте, если благополучателя нет на месте
              </p>
            </CheckboxElement>
          ) : (
            <CheckboxElement onCheckedChange={handleCheckChange} checked={true}>
              <p className="font-gerbera-sub2 dark:text-light-gray-3 my-3">
                Благополучателя нет на месте
              </p>
            </CheckboxElement>
          )}
        </div>
        <Comment
          // onSave={handleAddComment}
          // index={index}
          savedComment={comment}
          // id={idForComment}
          localeStorageName={localeStorageName}
          handleFormFieldChange={handleFormFieldChange}
          requestBody={requestBody}
        />
      </div>

      {uploadedFileLink[index].length > 0 && (
        <button
          className="btn-B-GreenDefault mt-[39px] "
          onClick={() => {
            onOpenChange(false);
            sendPhotoReportFunc( index, currentUser, token,  setSendMessage,  setUnactive,  setIsSending, routeSheetId, deliveryId, routes,  files, comment, beneficiarIsAbsent, setSendPhotoReportSuccess, setErrorMessage, setSendPhotoReportFail);
          }}
        >
          Отправить фотоотчет
        </button>
      )}
      {errorMessageP.length > 0 && (
        <ConfirmModal
          isOpen={isErrorOpen}
          onOpenChange={setIsErrorOpen}
          onConfirm={() => {
            setIsErrorOpen(false);
            setErrorMessageP('');
          }}
          title={
            <p>
              Упс,
              <br /> {errorMessageP}
            </p>
          }
          description=""
          confirmText="Закрыть"
          isSingleButton={true}
        />
      )}
    </div>
  );
};
