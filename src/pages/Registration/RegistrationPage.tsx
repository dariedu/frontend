import * as Form from '@radix-ui/react-form';
import { Selfie } from './../../components/Selfie/Selfie.tsx';
import './index.css';
import { Modal } from './../../components/ui/Modal/Modal.tsx';
import { useState } from 'react';
import { CheckboxElement } from './../../components/ui/CheckboxElement/CheckboxElement';

import {postRegistration, type TRegisterationFormData, IUserRegistered } from '../../api/apiRegistrationToken.ts';
import ConfirmModal  from '../../components/ui/ConfirmModal/ConfirmModal.tsx'

function RegistrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); /// открыть модальное для загрузки своей фотографии
  const [pictureConfirmed, setPictureConfirmed] = useState(false); // подтвердил ли юзер загруженное фото
  const [uploadedPictureLink, setUploadedPictureLink] = useState(''); /// ссылка на загруженое фото
  const [registrationCompleteModal, setRegistrationCompleteModal] =
    useState(false);
  const [checked, setChecked] = useState(false); // активируем кнопку отпарвки, если согласились с офертой для взрослых
  const [isAdult, setIsAdult] = useState<boolean | null>(null); ///
  const [tryToSubmitWithoutPic, setTryToSubmitWithoutPic] = useState(false); // уведомляем пользователя, если он не засабмитил фото

  const [requestForRegistrationSubmited, setRequestForRegistrationSubmited] = useState<'start' | 'submitSuccess' | 'submitFailed'>('start');
  //const [res, setRes] = useState<boolean>();
  const [blob, setBlob] = useState<Blob>(new Blob());

  type TRegister = Omit<IUserRegistered, "is_adult" | "tg_id" | "tg_username" | 'photo' | 'phone' | "city">;

  const [userFormFieldsInfo, setUserFormFieldsInfo] = useState<TRegister>({
    email: localStorage.getItem("email") ?? "",
    last_name: localStorage.getItem("last_name") ?? "",
    name: localStorage.getItem("name") ?? "",
    surname: localStorage.getItem("surname") ?? "",
    birthday: localStorage.getItem("birthday") ?? "",
    consent_to_personal_data: false,
  })

  ////При загрузке страницы, если isAdult пуст, то проверяем localStorage, если там есть birthDate то она подцепится в форму и соотвественно надо обновить isAdult
  if (isAdult == null) {
    if (
      localStorage.getItem('birthday') !== undefined &&
      localStorage.getItem('birthday') !== '' &&
      localStorage.getItem('birthday') !== null
    ) {
      setIsAdult(
        getAgeFromBirthDate(JSON.stringify(localStorage.getItem('birthday'))),
      );
    }
  }

  type TKeys = keyof typeof userFormFieldsInfo;

  ///определяем есть ли пользователю 18 лет по введенной дате рождения
  function getAgeFromBirthDate(birthDateString: string): boolean {
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
    setIsAdult(result)
    return result
  }

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TKeys, value: string | boolean) {
    setUserFormFieldsInfo({
      ...userFormFieldsInfo,
      [fieldName]: value,
    });
    if (fieldName == 'birthday' && typeof value == 'string') {
      localStorage.setItem('birthday', value);
      setIsAdult(getAgeFromBirthDate(value));
      localStorage.setItem(
        'isAdult',
        JSON.stringify(getAgeFromBirthDate(value)),
      );
    } else {
      if (typeof value == 'boolean')

        localStorage.setItem(fieldName, JSON.stringify(value))
      else
        localStorage.setItem(fieldName, value)
    }
  }

  async function fetchRegistration(user: TRegisterationFormData) {
    try {
      const response = await postRegistration(user)
      if (response) {
        
        //setRes(response)
        setRequestForRegistrationSubmited('submitSuccess') ///// устанавливаем дата, чтобы знать, что отображать на экране
        // console.log(data + " this is response from registration page")
        localStorage.clear() /// если запрос прошел то отчищаем локал сторэдж  
      }
    } catch (e) {
      console.log("запрос fetchRegistration  прошел с ошибкой", e)
      setRequestForRegistrationSubmited('submitFailed')
    }
  }
  

  //тип с переменными, которые пользователь не может изменить напрямую
  type TUserUnchangableValues = {
    tg_id: number
    tg_username: string
    is_adult: boolean | null,
    phone: string,
    photo: string;
    city: number;
  }
  //////функция для сабмита формы
  function onFormSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    if (pictureConfirmed) { ////если пользователь загрузил фото, продолжаем регистрацию
      e.preventDefault();
      const userUnchangableValues: TUserUnchangableValues = {
        tg_id: 123456,
        tg_username: 'mgdata',
        is_adult: isAdult,
        phone: "9086851174",
        photo: "",
        city: 1
      }
      /////содиняем два объекта с вводимыми полями формы и с вычисляемыми полями для данного пользователя
      const user = Object.assign(userUnchangableValues, userFormFieldsInfo);
      ///// создаем объект форм дата
      const formData = new FormData();
      ///// перебираем юзера переносим все поля в форм дата
      for (let key in user) {
        if (key == "photo") {
          formData.set('photo', blob, `selfie-${user.tg_id}.jpeg`)
           // setUrl(window.URL.createObjectURL(blob)) //// для тестирования скачивая фото из блоб на компьютер 
        } else {
           formData.set(key, user[key])
        }
      }
      fetchRegistration(formData) /////отправляем запрос на сервер с даттыми формДата
      setRegistrationCompleteModal(true)
    } else {
      e.preventDefault();
      setTryToSubmitWithoutPic(true);
    }
  }

  return (
    <>
      {requestForRegistrationSubmited == 'submitSuccess'
        ? (<div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
          <img src='./../src/assets/icons/AwaitConfirmRegistrationLogo.svg'></img>
          <h1 className='font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center'>Мы обрабатываем вашу заявку, в ближайшее время с вами свяжется координатор</h1>
        </div>)
        : requestForRegistrationSubmited == 'submitFailed' ? (
          <div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
          <img src='./../src/assets/icons/AwaitConfirmRegistrationLogo.svg'></img>
          <h1 className='font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center'>Упс.. что-то пошло не так</h1>
        </div>
        )
          : (
          <Form.Root >
          <div className="flex flex-col justify-around items-center w-[360px] h-fit bg-light-gray-white">
            <div className="flex flex-col justify-between items-center w-fit h-fit min-h-[520px] max-h-[559px] pt-[24px] pb-[28px]">
              <div className="font-gerbera-h1 my-">Зарегистрироваться</div>
              <div className="w-[328px] h-min-[360px] flex flex-col justify-between">
                <Form.Field name="last_name" className='flex flex-col items-center'>
                  <Form.Control asChild>
                    <input
                      className="formField"
                      placeholder="Фамилия"
                      type="text"
                      required
                      defaultValue={localStorage.getItem("last_name") ?? ""}
                      onChange={(e) => { handleFormFieldChange("last_name", e.target.value) }}
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="error">
                    Пожалуйста, введите вашу фамилию
                  </Form.Message>
                </Form.Field>

                <Form.Field name="name" className='flex flex-col items-center'>
                  <Form.Control asChild>
                    <input
                      className="formField"
                      placeholder="Имя"
                      type="text"
                      required
                      defaultValue={localStorage.getItem("name") ?? ""}
                      onChange={(e) => {
                        handleFormFieldChange("name", e.target.value)
                      }}
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="error">
                    Пожалуйста, введите ваше имя
                  </Form.Message>
                </Form.Field>

                <Form.Field name="surname" className='flex flex-col items-center'>

                  <Form.Control asChild>
                    <input
                      className="formField"
                      placeholder="Отчество"
                      type="text"
                      required
                      defaultValue={localStorage.getItem("surname") ?? ""}
                      onChange={(e) => {
                        handleFormFieldChange("surname", e.target.value)
                      }}
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="error">
                    Пожалуйста, введите ваше отчество
                  </Form.Message>
                </Form.Field>

                <Form.Field name="birthday" className='flex flex-col items-center'>
                  <Form.Control asChild>
                    <input
                      name="age"
                      className="formField"
                      placeholder="Дата рождения"
                      type="date"
                      onChange={(e) => handleFormFieldChange('birthday', e.target.value)}
                      defaultValue={localStorage.getItem("birthday") ?? ""}
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
                      defaultValue={localStorage.getItem("email") ?? ""}
                      onChange={(e) => { handleFormFieldChange("email", e.target.value) }}
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
                        defaultValue={localStorage.getItem("city") ?? ""}
                      //onChange={(e) => { handleFormFieldChange( "city", e.target.value )}}
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" className="error">
                      Пожалуйста выберете город проживания
                    </Form.Message>
                  </Form.Field>
                </div>
              </div>
              {(isAdult !== undefined && isAdult != false) ? (
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

            <div className="flex flex-col justify-between h-[254px]">
              {pictureConfirmed ? (
                <div className="flex flex-col justify-around items-center">
                  <div className=" bg-light-gray-1 rounded-full flex justify-center items-center relative">
                    <img
                      src={uploadedPictureLink}
                      className="h-[142px] w-[142px] rounded-full"
                    />
                    <img
                      src="./../src/assets/icons/small_pencile_bg_gray.svg"
                      className="absolute bottom-0 right-0"
                      onClick={() => { setIsModalOpen(true) }}
                    />
                  </div>
             
                </div>
              ) : (
                <div className="flex justify-between place-items-start my-4">
                  <div className="w-[235px] h-[72px] flex flex-col justify-between items-start">
                    <h3 className="font-gerbera-h3 text-light-gray-black">
                      Сделайте свое фото
                    </h3>
                    <p className={!tryToSubmitWithoutPic ? "font-gerbera-sub1 text-light-gray-6 text-left" : "font-gerbera-sub1 text-light-error-red  text-left"}>
                    Чтобы продолжить регистрацию, сделайте, пожалуйста, фото на камеру телефона так, чтобы было хорошо видно ваше лицо
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
                  !isAdult ? 'btn-B-GreenDefault mb-8' : checked ? 'btn-B-GreenDefault mb-8' : 'btn-B-GreenInactive mb-8'
                }
                onClick={e => {
                  !isAdult ? onFormSubmit(e) : checked ? onFormSubmit(e) : e.preventDefault();
                }}
              >
                Отправить заявку
              </button>
            </div>
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
              <Selfie
                text="Сфотографируйтесь на камеру своего телефона"
                setTryToSubmitWithoutPic={setTryToSubmitWithoutPic}
                setPictureConfirmed={setPictureConfirmed}
                onOpenChange={setIsModalOpen}
                uploadedFileLink={uploadedPictureLink}
                setUploadedFileLink={setUploadedPictureLink}
                localeStorageName="avatarPic"
                setBlob={setBlob}
              />
            </Modal>
            <ConfirmModal isOpen={registrationCompleteModal} onOpenChange={setRegistrationCompleteModal}
              onConfirm={() => { setRegistrationCompleteModal(false) }} title="Ваша заявка принята! Мы рассмотрим её в течение 24 часов" description="" confirmText='Ок' isSingleButton={true} >
            </ConfirmModal>
          </div>
        </Form.Root>
        )}
    </>
  )
}

export default RegistrationPage;
