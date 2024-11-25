import React, { type Dispatch } from 'react';
import Small_pencile from './../../assets/icons/small_pencile.svg?react'
import Photo from './../../assets/icons/photo.svg?react'

interface ISelfieProps {
  text: string;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
  uploadedFileLink: string|undefined
  setUploadedFileLink: Dispatch<React.SetStateAction<string|undefined>>
  fileUploaded:boolean
  setFileUploaded: Dispatch<React.SetStateAction<boolean>>,
  updateUserAvatar: () => void
  //setFile:Dispatch<React.SetStateAction<File|undefined>>
}

////// Любой попап с загрузкой фото, text  это тот текст что будет под значком загрузки фото,
// absent  нужен чтобы добавить чекбокс для отпетки, что благополучателя нет на месте, по умолчанию false
export const UploadPicture: React.FC<ISelfieProps> = ({
  text,
  onOpenChange,
  uploadedFileLink,
  setUploadedFileLink,
  fileUploaded,
  setFileUploaded,
  updateUserAvatar,
  //setFile
}) => {
 

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileLink(URL.createObjectURL(file));
      //setFile(file)
      setFileUploaded(true);
    }
  }

  return (
    <>
      <div
        className="flex flex-col items-center p-6 h-max-[343px] bg-light-gray-white rounded-t-2xl w-[360px] dark:bg-light-gray-7-logo"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[142px] w-[140px] bg-light-gray-2 dark:bg-light-gray-5 rounded-full flex justify-center items-center mb-8 relative">
          {fileUploaded ? (
            <>
              <img
                src={uploadedFileLink}
                className="h-[142px] w-[140px] size-fit rounded-full object-cover"
                onClick={e => {
                  e.preventDefault;
                }}
              />
              <>
              <Small_pencile className="absolute bottom-0 right-0  bg-light-gray-2 fill-light-gray-8-text dark:bg-light-gray-5 dark:fill-light-gray-1 rounded-full"
                />
                <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="absolute bottom-0 right-0  h-[32px] w-[32px] opacity-0 rounded-full cursor-pointer"
          />
              </>
      
            </>
          ) : (<>
               <Photo  className="h-[72px] w-[72px] cursor-pointer rounded-full bg-light-gray-2 fill-light-gray-white dark:bg-light-gray-5 dark:fill-light-gray-3"
              />
              <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className=" ml-20 mt-20 absolute h-[142px] w-[140px] opacity-0  rounded-full cursor-pointer"
          />
          </> 
          )}
          
        </div>
        <p className="block text-center max-w-[280px]  text-light-gray-8-text pb-8 font-gerbera-h2 dark:text-light-gray-1">
          {fileUploaded ? 'Отличное фото!' : text}
          <br />
        </p>
        {fileUploaded ? (
          <div className='flex justify-between w-[300px] space-x-4'>
             <button
            className="btn-M-GreenDefault"
            onClick={() => {
              onOpenChange(false);
              updateUserAvatar()
            }}
          >
            Сохранить
            </button>
            <button
            className="btn-M-WhiteClicked"
            onClick={() => {
              onOpenChange(false);
              setUploadedFileLink("")
            }}
          >
            Отменить
          </button>
          </div>
         
        ) : (
          ''
        )}
      </div>
    </>
  );
};
