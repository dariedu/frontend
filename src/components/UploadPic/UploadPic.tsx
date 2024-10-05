import React, { useState, type Dispatch } from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';
import { Modal } from '../ui/Modal/Modal';


interface IUploadPicProps {
  setPictureConfirmed: Dispatch<React.SetStateAction<boolean>>,/// когда фото будет подтверждено в основном окне можно брать его для загрузки из uploadedFileLink
  isOpen: boolean, ///для модалки
  onOpenChange: Dispatch<React.SetStateAction<boolean>>, //// для модалки
  uploadedFileLink: string, /// ссылка дна фото
  setUploadedFileLink: Dispatch<React.SetStateAction<string>>/// меняем ссылку на фото при загрузке фото
  // beneficiarOnSite: boolean,  /// передаем ли с пропсами или создаем внутри компонента?
  // setBeneficiarOnSite: Dispatch<React.SetStateAction<string>>  /// передаем ли с пропсами или создаем внутри компонента?
}

////// в компоненте уже есть модалка, если нажать на пустую модальную область она закроется
export const UploadPic: React.FC<IUploadPicProps> = ({
  setPictureConfirmed,
  isOpen,
  onOpenChange,
  uploadedFileLink,
  setUploadedFileLink,
}) => {

//// нужны для внутренней логики отображения компонентов
  const [fileUploaded, setFileUploaded] = useState(false);
  const [beneficiarOnSite, setBeneficiarOnSite] = useState(true) ////  проверяем благополучатель на месте или нет

  const handleCheckChange = ():void => {
    beneficiarOnSite == true ? setBeneficiarOnSite(false) : setBeneficiarOnSite(true) ////  проверяем благополучатель на месте или нет
   console.log(beneficiarOnSite)
}

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let imgLink: string;
    if (event.target.files) {
    imgLink = URL.createObjectURL(event.target.files[0]);
    setFileUploaded(true);
    setUploadedFileLink(imgLink);
    }
  };

  const handleConfirmPicture = () => {
    setPictureConfirmed(true) /// при нажатии на кнопку подтверждаем что выбрали корректное фото
    onOpenChange(false) //// закрываем модалку
    ///// позже добавим логику отправки и сохранения фото на сервере
 }

  return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <div
        className="flex flex-col items-center justify-between p-6 h-[343px] bg-light-gray-white rounded-t-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[142px] w-[140px] bg-light-gray-1 rounded-full flex justify-center items-center relative">
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
          />
          {fileUploaded ? (
            ''
          ) : (
            <input
              onChange={e => handleFileChange(e)}
              type="file"
              accept="image/*"
              className="absolute opacity-0 h-[142px] w-[140px] rounded-full cursor-pointer"
            />
          )}
             {/* Для редактирования уже загруженного фото */}
          {fileUploaded ? (
            <>
              <img
                src="./../src/assets/icons/small_pencile_bg_gray.svg"
                className="absolute bottom-0 right-0"
              />
              <input
                onChange={e => handleFileChange(e)}
                type="file"
                accept="image/*"
                className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
              />
            </>
          ) : (
            ''
          )}
               {/* Для редактирования уже загруженного фото */}
        </div>

        <p className="block text-center max-w-[280px] font-gerbera-h2">
          {fileUploaded ? 'Отличное фото!' : 'Загрузите фотографию благополучателя' }
          <br />
        </p>
        <CheckboxElement onCheckedChange={handleCheckChange}>
          <p className="font-gerbera-sub2">Благополучателя нет на месте</p>
         </CheckboxElement>
        {fileUploaded ? (
          <button className="btn-B-GreenDefault" onClick={handleConfirmPicture}>
            Сохранить фото
          </button>
        ) : (
          ''
        )}

      </div>
      </Modal>
  );
};
