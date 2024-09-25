//import { useState, useEffect } from "react";
import * as Form from '@radix-ui/react-form';
import { PictuteUpload } from './../ui/PictureUpload/PictureUpload';
import './index.css';
import { Modal } from '../ui/Modal/Modal';
import { useState, useEffect } from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';
import { postRegistration, type IRegister, type TToken,type ITokenBlacklist,type ITokenRefresh} from '../../api/apiRegistrationToken.ts';
import ConfirmModal  from '../../components/ui/ConfirmModal/ConfirmModal.tsx'


export default function RegistrationForm() {
  // const [registrationActive, setRegistrationActive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); /// открыть модальное для загрузки своей фотографии
  const [pictureConfirmed, setPictureConfirmed] = useState(false); // подтвердил ли юзер загруженное фото
  const [uploadedPictureLink, setUploadedPictureLink] = useState(''); /// ссылка на загруженое фото
  const [registrationCompleteModal, setRegistrationCompleteModal] = useState(false);
  const [checked, setChecked] = useState(false) // активируем кнопку отпарвки, если согласились с офертой для взрослых
  const [isAdult, setIsAdult] = useState(true); /// взрослый или жо 18 лет, по умолчанию взрослый, меняется при вводе даты рождения
  // const [isParentsAgreementModalOpen, setIsParentsAgreementModalOpen] =
  //   useState(false); ///// открыть модальное окно для загрузки разрешения родителей
  // const [parentAgreementUploaded, setParentAgreementUploaded] = useState(false); // загружено ли изображение согласия подписанное родителем
  // const [uploadedParentAgreementLink, setuploadedParentAgreementLink] =
  //   useState(''); //// ссылка на загруженое фосо согласия родителей

  interface IFullProfile extends IRegister {
    birthDate: string
  }
  const [userState, setUserState] = useState<IFullProfile>({
    tg_id: 333,
    email: localStorage.getItem("email") ?? "",
    last_name: localStorage.getItem("last_name") ?? "",
    name: localStorage.getItem("name") ?? "",
    surname: localStorage.getItem("surname") ?? "",
    phone: localStorage.getItem("phone") ?? "",
    city: localStorage.getItem("city") ?? "",
    birthDate: localStorage.getItem("birthDate") ?? "",
    is_adult: isAdult,
    consent_to_personal_data: false
  })

  type TKeys = keyof typeof userState;

  // при каждом рендере обновляем localStorage
  useEffect(() => {
    for (let key in userState) {
      localStorage.setItem(key, userState[key]);
    }
  })
 
  
  // при каждом изменении в полях формы вносим изменения в юзера
  function handleFormFieldChange(fieldName: TKeys, value: string | boolean) {
   setUserState({
      ...userState,
      [fieldName]: value
   })
  }

  // функция для сабмита формы
  function onFormSubmit(e:React.FormEvent<HTMLFormElement>):void {
    e.preventDefault();
    setRegistrationCompleteModal(true)
  }

  ///определяем есть ли пользователю 18 лет по введенной дате рождения 
  function getAgeFromBirthDate(birthDateString: string): boolean {
  localStorage.setItem("birthDate", birthDateString);
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  
  let result = age >= 18
  setIsAdult(result);
  return result
}


  return (
    <Form.Root onSubmit={(e) => onFormSubmit(e)}>
      <div className="flex flex-col justify-around items-center w-fit h-fit">
        <div className="flex flex-col justify-around items-center w-fit h-[539px]">
          <div className="font-gerbera-h1 my-">Зарегистрироваться</div>
          <div className="w-[360px] h-min-[364px] flex flex-col justify-between">
            <Form.Field name="last_name" className='flex flex-col items-center'>
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Фамилия"
                  type="text"
                  required
                  defaultValue={localStorage.getItem("last_name") ??  ""}
                  onChange={(e)=>{handleFormFieldChange("last_name", e.target.value)}}
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста, введите вашу фамилию
              </Form.Message>
            </Form.Field>

            <Form.Field name="name" className='flex flex-col items-center'>
              {/* <Label>Email</Label> */}
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Имя"
                  type="text"
                  required
                  defaultValue={localStorage.getItem("name") ??  ""}
                  onChange={(e)=>{handleFormFieldChange("name", e.target.value)}}
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста, введите ваше имя
              </Form.Message>
            </Form.Field>

            <Form.Field name="surname" className='flex flex-col items-center'>
              {/* <Label>Email</Label> */}
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Отчество"
                  type="text"
                  required
                  defaultValue={localStorage.getItem("surname") ??  ""}
                  onChange={(e)=>{handleFormFieldChange("surname", e.target.value)}}
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
              Пожалуйста, введите ваше отчество
              </Form.Message>
            </Form.Field>

            <Form.Field name="birthDate" className='flex flex-col items-center'>
              <Form.Control asChild>
                <input
                  name="age"
                  className="formField"
                  placeholder="Дата рождения"
                  type="date"
                  onChange={(e) => {
                  getAgeFromBirthDate(e.target.value)
                  handleFormFieldChange("birthDate", e.target.value)
                  }}
                  defaultValue={localStorage.getItem("birthDate") ??  ""}
                  required
                  
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста введите дату рождения
              </Form.Message>
            </Form.Field>

            <Form.Field name="email" className='flex flex-col items-center'>
              <Form.Control asChild>
                <input
                  name="email"
                  className="formField"
                  placeholder="Email"
                  type="email"
                  required
                  defaultValue={localStorage.getItem("email") ??  ""}
                  onChange={(e)=>{handleFormFieldChange("email", e.target.value)}}
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста введите ваш имейл
              </Form.Message>
              <Form.Message match="typeMismatch" className="error">
                Неверный имейл
              </Form.Message>
            </Form.Field>

            <div>
              <Form.Field name="city" className='flex flex-col items-center'>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Город проживания"
                    type="select"
                    required
                    defaultValue={localStorage.getItem("city") ??  ""}
                    onChange={(e)=>{handleFormFieldChange("city", e.target.value)}}
                  />
                </Form.Control>
                <Form.Message match="valueMissing" className="error">
                  Пожалуйста выберете город проживания
                </Form.Message>
              </Form.Field>
            </div>
          </div>
          {isAdult ? (
            <CheckboxElement onCheckedChange={() => {
              handleFormFieldChange("consent_to_personal_data", checked ? false : true)
              checked ? setChecked(false) : setChecked(true)
             }
            }>
              <label className="font-gerbera-sub2 text-light-gray-6 w-[261px]">
                Я принимаю условия{' '}
                <a href="*" className="text-light-brand-green font-normal">
                  договора-оферты.
                </a>
              </label>
            </CheckboxElement>
          ) : (
            ''
          )}
        </div>

        <div className="flex flex-col justify-between h-min-">
          {pictureConfirmed ? (
            <div className="flex flex-col justify-around items-center h-[160px] mb-3.5">
              <div className=" bg-light-gray-1 rounded-full flex justify-center items-center mb-8 relative">
                <img
                  src={uploadedPictureLink}
                  className="h-[108px] w-[108px] rounded-full"
                />
                <img
                  src="./../src/assets/icons/small_pencile_bg_gray.svg"
                  className="absolute bottom-0 right-0"
                />
                <input
                  //  onChange={e => handleFileChange(e)}
                  type="file"
                  accept="image/*;capture=camera"
                  className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
                  // onClick={(e) => {}}
                />
              </div>
              <p className="font-gerbera-h1">Ваше фото подтверждено!</p>
            </div>
          ) : (
            <div className="flex justify-between place-items-start my-4">
              <div className="w-[235px] h-[72px] flex flex-col justify-between items-start">
                <h3 className="font-gerbera-h3 text-light-gray-black">
                  Загрузите свое фото
                </h3>
                <p className="font-gerbera-sub1 text-light-gray-6 text-left">
                  Для продолжения регистрации, пожалуйста, сфотографируйтесь или
                  загрузите ваше фото в формате jpg
                </p>
              </div>
              <img
                src="./../src/assets/icons/photo.svg"
                className="h-[35px] w-[38px] cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
            </div>
          )}

          <button
            className={
             !isAdult ? 'btn-B-GreenDefault my-8' : checked ? 'btn-B-GreenDefault my-8' : 'btn-B-GreenInactive  my-8'
            }
            onClick={e => {
              !isAdult ? "" : checked ? "" : e.preventDefault();
            }}
          >
            Отправить заявку
          </button> 
        </div>
       
        {/* <Modal
            isOpen={isParentsAgreementModalOpen}
            onOpenChange={setIsParentsAgreementModalOpen}
          > */}
        {/* <PictuteUpload
              text="Сфотографируйте согласие на обработку данных подписанное родителем"
              pictureConfirmed={parentAgreementUploaded}
              setPictureConfirmed={setParentAgreementUploaded}
              onOpenChange={setIsParentsAgreementModalOpen}
              uploadedFileLink={uploadedParentAgreementLink}
              setUploadedFileLink={setuploadedParentAgreementLink}
              localeStorageName="parentsAgreement"
            />
          </Modal> */}
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <PictuteUpload
            text="Сфотографируйтесь на камеру своего телефона"
            pictureConfirmed={pictureConfirmed}
            setPictureConfirmed={setPictureConfirmed}
            onOpenChange={setIsModalOpen}
            uploadedFileLink={uploadedPictureLink}
            setUploadedFileLink={setUploadedPictureLink}
            localeStorageName="avatarPic"
          />
        </Modal>
        <ConfirmModal isOpen={registrationCompleteModal} onOpenChange={setRegistrationCompleteModal}
          onConfirm={() => {setRegistrationCompleteModal(false) }} title="Ваша заявка принята! Мы рассмотрим её в течение 24 часов" description="" confirmText='Ок' isSingleButton={true} >
        </ConfirmModal>
      </div>
    </Form.Root>
  );
}
