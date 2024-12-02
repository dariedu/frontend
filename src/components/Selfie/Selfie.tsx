import React, { useState, useRef, type Dispatch } from 'react';
import { Modal } from '../ui/Modal/Modal';
import Webcam from 'react-webcam';
import Small_pencile from './../../assets/icons/small_pencile.svg?react'
import Photo from './../../assets/icons/photo.svg?react'

interface ISelfieProps {
  text: string;
  setPictureConfirmed: Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
  uploadedFileLink: string;
  setUploadedFileLink: Dispatch<React.SetStateAction<string>>;
  setTryToSubmitWithoutPic: Dispatch<React.SetStateAction<boolean>>;
  localeStorageName: string;
  setBlob: Dispatch<React.SetStateAction<Blob>>;
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
  setBlob,
}) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const webcamRef: React.MutableRefObject<null | Webcam> = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [url, setUrl] = useState('');
  const imageRef: React.MutableRefObject<HTMLImageElement | null> =
    useRef(null);

  const makePhoto = React.useCallback(async () => {
    if (webcamRef.current && webcamRef.current != null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setUrl(imageSrc);
      }
    }
  }, [webcamRef]);

  const deletePhoto = () => {
    setUrl('');
  };

  function savePicture() {
    setFileUploaded(true);
    setUploadedFileLink(url);
    localStorage.setItem(localeStorageName, uploadedFileLink);
    setIsEnabled(false);

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        setBlob(blob);
      });
  }

  return (
    <>
      <div
        className="flex flex-col items-center p-6 h-max-[343px] bg-light-gray-white rounded-t-2xl w-full max-w-[400px] dark:bg-light-gray-7-logo"
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
       <Small_pencile className="absolute bottom-0 right-0  bg-light-gray-2 fill-light-gray-8-text dark:bg-light-gray-5 dark:fill-light-gray-1 rounded-full"
                onClick={() =>
                  isEnabled ? setIsEnabled(false) : setIsEnabled(true)
                } />
            </>
          ) : (
              <Photo  className="h-[72px] w-[72px] cursor-pointer rounded-full bg-light-gray-2 fill-light-gray-white dark:bg-light-gray-5 dark:fill-light-gray-3"
              onClick={() =>
                isEnabled ? setIsEnabled(false) : setIsEnabled(true)
              }/>
          )}
        </div>
        <p className="block text-center max-w-[280px] pb-8 font-gerbera-h2 dark:text-light-gray-1">
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
          className="w-full h-fit bg-light-gray-white flex flex-col justify-between items-center py-8 rounded-t-2xl dark:bg-light-gray-7-logo"
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
            className="relative"
          />
          {url && (
            <img ref={imageRef} src={url} alt="pic" className="absolute" />
          )}
          <div className="flex justify-between w-[240px] h-[40px] mt-4">
            {url.length !== 0 ? (
              <button
              className="btn-S-GreenDefault outline-none"
              onClick={savePicture}
            >
              Сохранить
            </button>
            ) : (
              <button
                className="btn-S-GreenDefault outline-none"
                onClick={makePhoto}
              >
                Сделать фото
              </button>
            )}
            {url.length !== 0 ? (
              <button
              className="btn-S-GreenInactive outline-none"
              onClick={deletePhoto}
            >
              Удалить
            </button>
            ) : (
              <button
                className="btn-S-GreenInactive outline-none"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
