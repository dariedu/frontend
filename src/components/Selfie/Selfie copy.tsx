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
  localeStorageName?: string;
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
  //const [isCameraActive, setIsCameraActive] = useState(false)
  //const [picture, setPicture] = useState('');
  //const [error, setError] = useState('');
  const videoRef: React.MutableRefObject<null | Webcam> = useRef(null);
  //const streamRef: React.MutableRefObject<null | MediaStream> = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const canvasRef: React.MutableRefObject<null | HTMLCanvasElement> =
    useRef(null);
  const facing = 'user';

  // const startStream = () => {
  //     navigator.mediaDevices.getUserMedia({ audio: false, video: {facingMode:{exact:"user"}}})
  //     .then((stream) => {
  //     streamRef.current = stream;
  //     if (videoRef.current!=null && streamRef.current!=null) {
  //       videoRef.current.srcObject = streamRef.current;
  //       videoRef.current.onloadedmetadata = () => { if (videoRef.current != null) videoRef.current.play() }
  //     }
  //     })
  //   .catch((err) => {
  //   console.log(err.name)
  // })
  // }

  //   const stopStream = () => {
  //     if (streamRef.current) {
  //   streamRef.current.getTracks().forEach((track)=>track.stop())
  // }
  //   }

  const deletePhoto = () => {
    console.log('delete');
    if (canvasRef.current !== null) {
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(
        0,
        0,
        canvasRef.current?.width,
        canvasRef.current?.height,
      );
      context?.clearRect(
        0,
        0,
        -canvasRef.current?.width,
        canvasRef.current?.height,
      );
    }
  };

  //   const downLoadPhoto = () => {

  //     const link = document.createElement("a");
  //     link.download = 'photo.png';
  //     if (link.href != undefined && canvasRef.current) {
  //       link.href = canvasRef.current.toDataURL('image/png')
  //       setPicture(`${canvasRef.current?.toDataURL('image/png')}`)
  //     }

  //     fileUploaded(true)
  //
  // }

  const makePhoto = () => {
    const photo = videoRef.current?.getScreenshot();
    const link = document.createElement('a');
    link.download = 'photo.png';
    if (link.href != undefined && canvasRef.current && photo) {
      link.href = photo;
      link.click();
      setUploadedFileLink(photo);
      console.log(localeStorageName);
    }
    // setPicture(`${photo?.toDataURL('image/png')}`)
    // const videoWidth = videoRef.current?.scrollWidth;
    // const videoHeight = videoRef.current?.scrollHeight;
    // if (canvasRef.current && videoWidth && videoHeight && videoRef.current)  {
    //   canvasRef.current.width = videoWidth;
    //   canvasRef.current.height = videoHeight;
    //   canvasRef.current?.getContext("2d")?.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)
    //   console.log("taken")
    // }

    // useEffect(() => {
    //  // setError('')
    //   stopStream()
    //   if(isEnabled) startStream()
    // }, [isEnabled])

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
              onClick={() =>
                isEnabled ? setIsEnabled(false) : setIsEnabled(true)
              }
            />

            {/* {fileUploaded ? (
              ''
            ) : (""
              <input
                onChange={e => handleFileChange(e)}
                type="file"
                accept="image/*;capture=camera"
                className="absolute opacity-0 h-[142px] w-[140px] rounded-full cursor-pointer"
                // onClick={(e) => {}}
              />
            )} */}
            {/* 
            {fileUploaded ? (
              <>
                <img
                  src={picture}
                  //  src="./../src/assets/icons/small_pencile_bg_gray.svg"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => !isEnabled ? setIsEnabled(true) : setIsEnabled(false)}
                />
                {<input
                onChange={e => handleFileChange(e)}
                type="file"
                accept="image/*;capture=camera"
                className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
                // onClick={(e) => {}}
              /> }
              </>
            ) : (
              ''
            )} */}
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
            className="w-full min-h-[500px] relative bg-light-gray-white"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Webcam
              ref={videoRef}
              audio={false}
              mirrored={facing == 'user' ? true : false}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              className="block absolute inset-y-1/2 inset-x-1/2 -translate-y-1/2 -translate-x-1/2 -scale-x-50 scale-y-50 bg-light-gray-8-text"
            />
            {/* <video playsInline muted autoPlay ref={videoRef} className='block absolute inset-y-1/2 inset-x-1/2 -translate-y-1/2 -translate-x-1/2 -scale-x-50 scale-y-50 bg-light-gray-8-text'></video> */}
            <canvas
              ref={canvasRef}
              className="block absolute inset-y-1/2 inset-x-1/2 -translate-y-1/2 -translate-x-1/2 -scale-x-50 scale-y-50"
            ></canvas>
            <div className="flex justify-between absolute w-[328px] h-[40px] inset-y-[70%] inset-x-1/2 -translate-y-1/2 -translate-x-1/2 ">
              <button className="btn-S-GreenDefault" onClick={makePhoto}>
                Сделать фото
              </button>
              <button className="btn-S-GreenDefault" onClick={deletePhoto}>
                Удалить
              </button>
              <button
                className="btn-S-GreenClicked"
                onClick={() => {
                  setFileUploaded(true);
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
};
