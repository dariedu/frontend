import React, { useState, useRef, type Dispatch } from 'react';
import { Modal } from '../ui/Modal/Modal';
import Webcam from 'react-webcam';

interface ISelfieProps {
  text: string;
  setPictureConfirmed: Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
  uploadedFileLink: string;
  setUploadedFileLink: Dispatch<React.SetStateAction<string>>;
  setTryToSubmitWithoutPic: Dispatch<React.SetStateAction<boolean>>;
  localeStorageName: string;
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
  setTryToSubmitWithoutPic,
}) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const webcamRef: React.MutableRefObject<null | Webcam> = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [url, setUrl] = useState('');

  const makePhoto = React.useCallback(async () => {
    if (webcamRef.current && webcamRef.current != null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setUrl(imageSrc);
      }
      }
    }, [webcamRef]);
  
  const deletePhoto = () => {
    setUrl("")
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
            onClick={() =>
              isEnabled ? setIsEnabled(false) : setIsEnabled(true)
            }
          />
        </div>
        <p className="block text-center max-w-[280px] pb-8 font-gerbera-h2">
          {fileUploaded ? 'Отличное фото!' : text}

          <br />
        </p>
        {fileUploaded ? (
          <button
            className="btn-B-GreenDefault"
            onClick={() => {
              setPictureConfirmed(true);
              setTryToSubmitWithoutPic(false);
              onOpenChange(false);
            }}
          >
            Далее
          </button>
        ) : (
          ''
        )}
      </div>
      <Modal isOpen={isEnabled} onOpenChange={setIsEnabled}>
        <div
          className="w-full min-h-[600px] bg-light-gray-white flex flex-col justify-between items-center py-8 rounded-t-2xl"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            forceScreenshotSourceSize={true}
            className='relative'
          />
            {url && (<img src={url} alt="pic" className='absolute'/>)}
          <div className="flex justify-between w-[350px] h-[40px]">
            <button className="btn-S-GreenDefault outline-none" onClick={makePhoto}>
              Сделать фото
            </button>
            <button className="btn-S-GreenDefault outline-none" onClick={deletePhoto}>
              Удалить
            </button>
            <button
              className="btn-S-GreenClicked outline-none"
              onClick={() => {
                setFileUploaded(true);
                setUploadedFileLink(url);
                localStorage.setItem(localeStorageName, uploadedFileLink);
                setIsEnabled(false)
              }}
            >
              Сохранить фото
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
