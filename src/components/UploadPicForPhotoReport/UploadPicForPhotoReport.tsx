import React, {useState} from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';
import Small_pencile from './../../assets/icons/small_pencile.svg?react'
import Photo from './../../assets/icons/photo.svg?react';
import CloseIcon from "../../assets/icons/closeIcon.svg?react"
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

interface IUploadPicProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  // onOpenChangeComment?: ()=>void
  index: number
  setUploadedFileLink: React.Dispatch<React.SetStateAction<string[]>>
  beneficiarIsAbsent: boolean
  setBeneficiarIsAbsent: React.Dispatch<React.SetStateAction<boolean[]>>
  uploadedFileLink: string[]
  fileUploaded: boolean[]
  setFileUploaded: React.Dispatch<React.SetStateAction<boolean[]>>
  setFiles: React.Dispatch<React.SetStateAction<Blob[]>>
  files:Blob[]
}
////// в компоненте уже есть модалка, если нажать на пустую модальную область она закроется
export const UploadPic: React.FC<IUploadPicProps> = ({
  onOpenChange,
  // onOpenChangeComment,
  index,
  uploadedFileLink,
  beneficiarIsAbsent,
  setUploadedFileLink,
  setBeneficiarIsAbsent,
  setFileUploaded,
  fileUploaded,
  setFiles,
  files
}) => {

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleCheckChange = (): void => {
    setBeneficiarIsAbsent(prev =>
      prev.map((isOpen, idx) => idx === index ? !isOpen : isOpen))
  }
  
  // Допустимые форматы файлов
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  // Максимальный размер файла (5 МБ)
  const maxFileSize = 5 * 1024 * 1024; // 5 МБ в байтах

    

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, index:number): void {
    if (e.target.files && e.target.files[0]) {
      
     
      const file = e.target.files[0];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Неподходящий формат файла. Разрешены только JPEG, JPG.");
        setIsErrorOpen(true)
      } else {

        if (file.size > maxFileSize) {
          setErrorMessage("Файл слишком большой. Рекомендованный размер до 5 МБ. Возможны сложности с отправкой фотоотчета");
          setIsErrorOpen(true)
        }

      let fileList: Blob[] = files.slice();
      fileList[index] = file;
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
        className="flex flex-col items-center justify-between p-6 h-[367px] bg-light-gray-white dark:bg-light-gray-7-logo rounded-t-2xl w-full max-w-[500px]"
        onClick={e => e.stopPropagation()}
    >
      <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end ' onClick={()=>onOpenChange(false)} />
        <div className="h-[142px] w-[140px] bg-light-gray-2 dark:bg-light-gray-5 rounded-full flex justify-center items-center mb-4 relative">
        {uploadedFileLink[index].length > 0 ? (
        <img
            src={uploadedFileLink[index]}
            className={'h-[142px] w-[140px] size-fit rounded-full object-cover '}
    />
        ): (
        <Photo  className="h-[72px] w-[72px] cursor-pointer rounded-full bg-light-gray-2 fill-light-gray-white dark:bg-light-gray-5 dark:fill-light-gray-3"
        />
         )}  
          {uploadedFileLink[index].length>0 ? (
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
                <Small_pencile className="absolute bottom-0 right-0  bg-light-gray-2 fill-light-gray-8-text dark:bg-light-gray-5 dark:fill-light-gray-1 rounded-full"
                />
              <input
                onChange={e => handleFileChange(e, index)}
                type="file"
                accept="image/*"
                className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
            />
        
            </>
          )}        
        </div>

        <p className="text-center max-w-[280px] font-gerbera-h2 dark:text-light-gray-1">
          {uploadedFileLink[index].length > 0 ? 'Фото успешно загружено' : 'Загрузите фотографию благополучателя' }
          <br />
         </p>
      <div>
        {!beneficiarIsAbsent ?
          (<CheckboxElement onCheckedChange={handleCheckChange} checked={false}>
          <p className="font-gerbera-sub2 dark:text-light-gray-3 my-3">Отметьте, если благополучателя нет на месте</p>
        </CheckboxElement>) :
          (<CheckboxElement onCheckedChange={handleCheckChange} checked={true}>
          <p className="font-gerbera-sub2 dark:text-light-gray-3 my-3">Благополучателя нет на месте</p>
         </CheckboxElement>)}
         
        </div>
       
        {uploadedFileLink[index].length>0 && (
          <button className="btn-B-GreenDefault " onClick={()=>onOpenChange(false)}>
            Сохранить фото
          </button>
        )}
      {errorMessage.length > 0 &&
      <ConfirmModal
      isOpen={isErrorOpen}
      onOpenChange={setIsErrorOpen}
        onConfirm={() => { setIsErrorOpen(false); setErrorMessage('') }}
        title={<p>Упс,<br/> { errorMessage }</p>}
      description=""
      confirmText="Закрыть"
      isSingleButton={true}
      />
}
      </div>
  );
};
