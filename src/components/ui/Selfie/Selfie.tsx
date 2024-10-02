import React, { useState, type Dispatch } from 'react';
import { CheckboxElement } from '../CheckboxElement/CheckboxElement';

interface ISelfieProps {
  text: string;
  setPictureConfirmed: Dispatch<React.SetStateAction<boolean>>,
  onOpenChange: Dispatch<React.SetStateAction<boolean>>,
  localeStorageName: string,
  uploadedFileLink: string,
  setUploadedFileLink: Dispatch<React.SetStateAction<string>>
  setTryToSubmitWithoutPic: Dispatch<React.SetStateAction<boolean>>
}

////// Любой попап с загрузкой фото, text  это тот текст что будет под значком загрузки фото,
// absent  нужен чтобы добавить чекбокс для отпетки, что благополучателя нет на месте, по умолчанию false
export const Selfie: React.FC<ISelfieProps> = ({
  text,
  setPictureConfirmed,
  onOpenChange,
  localeStorageName,
  uploadedFileLink,
  setUploadedFileLink,
  setTryToSubmitWithoutPic
}) => {


  const [fileUploaded, setFileUploaded] = useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let imgLink: string;

    if (event.target.files) {
    imgLink = URL.createObjectURL(event.target.files[0]);
    localStorage.setItem(localeStorageName, uploadedFileLink);
    setFileUploaded(true);
    setUploadedFileLink(imgLink);
    }
    
    
  };

  return (
    <>
      <div
        className="flex flex-col items-center p-6 h-max-[343px] bg-light-gray-white rounded-t-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[142px] w-[140px] bg-light-gray-1 rounded-full flex justify-center items-center mb-8 relative">
          <img
            src={
              fileUploaded
                ? `${uploadedFileLink}`
                : './../src/assets/icons/photo.svg'
            }
            className={
              fileUploaded
                ? 'h-[142px] w-[140px] size-fit rounded-full '
                : 'h-[72px] w-[72px] cursor-pointer'
            }
            // onClick={() => {
            //   navigator.mediaDevices.getUserMedia({ audio: false, video: true }  ) } }
          />
          {fileUploaded ? (
            ''
          ) : (
            <input
              onChange={e => handleFileChange(e)}
              type="file"
              accept="image/*;capture=camera"
              className="absolute opacity-0 h-[142px] w-[140px] rounded-full cursor-pointer"
              // onClick={(e) => {}}
            />
          )}

          {fileUploaded ? (
            <>
              <img
                src="./../src/assets/icons/small_pencile_bg_gray.svg"
                className="absolute bottom-0 right-0"
              />
              <input
                onChange={e => handleFileChange(e)}
                type="file"
                accept="image/*;capture=camera"
                className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
                // onClick={(e) => {}}
              />
            </>
          ) : (
            ''
          )}
        </div>
        <p className="block text-center max-w-[280px] pb-8 font-gerbera-h2">
          {fileUploaded ? 'Отличное фото!' : text}
   
          <br />
        </p>
        {fileUploaded ? (
          <button className="btn-B-GreenDefault" onClick={() => {
            setPictureConfirmed(true)
            setTryToSubmitWithoutPic(false)
            onOpenChange(false)
          }}>
            Далее
          </button>
        ) : (
          ''
        )}
        <p>
        </p>
      </div>
    </>
  );
};
