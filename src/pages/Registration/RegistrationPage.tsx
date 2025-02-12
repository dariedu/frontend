import * as Form from '@radix-ui/react-form';
//import * as Select from "@radix-ui/react-select";
import { Selfie } from './../../components/Selfie/Selfie.tsx';
import './index.css';
import { Modal } from './../../components/ui/Modal/Modal.tsx';
import React, { useRef, useState, useEffect } from 'react';
import { CheckboxElement } from './../../components/ui/CheckboxElement/CheckboxElement';
import InputDate from '../../components/InputDate/InputDate.tsx';
import ConcentToPersonalData from './ConcentToPersonalData.tsx';
import { fetchCities, type TCity } from '../../api/cityApi.ts';
import Photo from './../../assets/icons/photo.svg?react';
import Pencile from './../../assets/icons/pencile.svg?react';
import {
  postRegistration,
  type TRegisterationFormData,
  IUserRegistered,
} from '../../api/apiRegistrationToken.ts';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal.tsx';
import InputOptions, { type T } from './InputOptions.tsx';
import LogoNoTaskYet from './../../assets/icons/LogoNoTaskYet.svg?react';
import CalendarIcon from '../../assets/icons/tap_calendar.svg?react';
import { useLocation } from 'react-router-dom';
import DownloadPdfButton from './DownloadPDF.tsx';


function RegistrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); /// открыть модальное для загрузки своей фотографии
  const [pictureConfirmed, setPictureConfirmed] = useState(false); // подтвердил ли юзер загруженное фото
  const [uploadedPictureLink, setUploadedPictureLink] = useState(''); /// ссылка на загруженое фото
  const [registrationCompleteModal, setRegistrationCompleteModal] =
    useState(false);
  const [checked, setChecked] = useState(false); // активируем кнопку отпарвки, если согласились с офертой для взрослых
  const [isAdult, setIsAdult] = useState<boolean | null>(null); ///
  //const [titleForAlert, setTitleForAlert] = useState<string>("");

  const [tryToSubmitWithoutPic, setTryToSubmitWithoutPic] = useState(false); // уведомляем пользователя, если он не засабмитил фото
  const [birthDate, setBirthDate] = useState<string>('');
  const [requestSent, setRequestSent] = useState(false);

  const [registrationhasFailed, setRegistrationhasFailed] = useState<boolean>(false); /// если регистрация не прошла, выводим ошибку пользователю
  const [registrationHasFailedString, setRegistrationHasFailedString] = useState<JSX.Element|string>('');

  const [file, setFile] = useState<Blob>(new Blob()); ////форматит фото в блоб файл
  const [openCalendar, setOpenCalendar] = useState(false); ////открывает модалку с календарем
  const calendarRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
  // const formRef: React.MutableRefObject<HTMLFormElement | null> =  useRef(null);
  const [concentOpenModal, setConcentOpenModal] = useState(false); /// открываем окно с условиями обработки персональных данных
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<boolean>(false); ///дополнительное поле для обозначения загруженного файла (а не сфотографированной с камеры)
  const [dateString, setDateString] = useState<string>('');
  const [dateIsMissing, setDateisMissing] = useState(false);
  ///// данные для инпута для выбора города
  const [clickedCity, setClickedCity] = useState(false);
  const [cityOptions, setCityOptions] = useState<[number, string][]>([
    [1, 'Москва'],
    [3, 'другой'],
  ]);
  const [cityIndex, setCityIndex] = useState<T>(1);
  ///// данные для инпута для выбора города

  ////// запрашиваем города и пушим их в cityOptions для формирования инпута
  async function reqCitiesList() {
    let arr: [number, string][] = [];
    try {
      const result: TCity[] = await fetchCities();
      result.forEach(res => {
        arr.push([res.id, res.city]);
      });
    } catch (err) {
      console.error(err, 'reqCiliesList has failed, registrationPage');
    } finally {
      if (arr.length > 0) {
        setCityOptions(arr);
      }
    }
  }

  /////запрашиваем города один раз при загрузке страницы
  useEffect(() => {
    reqCitiesList();
  }, []);

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
    let result = age >= 18;
    return result;
  }
  /////функция, которая получает данные из календаря и обрабатывает их
  const calcBirthday = (v: Date[]) => {
    const date = v[0];
    let day = date.getDate() < 10 ? '0' + `${date.getDate()}` : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? '0' + `${date.getMonth() + 1}`
        : date.getMonth() + 1;
    let year = date.getFullYear();

    let dateString = `${day}.${month}.${year}`; /// формат даты для пользователя
    let dateString2 = `${year}-${month}-${day}`; ///формат даты для дальнеших вычислений
    localStorage.setItem('birthday', dateString);
    let adult = getAgeFromBirthDate(dateString2);
    setBirthDate(dateString);
    localStorage.setItem('isAdult', `${adult}`);
    setIsAdult(adult);
    if (calendarRef.current != undefined && calendarRef.current != null) {
      calendarRef.current.value = dateString;
      setDateString(dateString)
     setDateisMissing(false)
    }
  };

  type TRegister = Omit<
    IUserRegistered,
    'is_adult' | 'tg_id' | 'tg_username' | 'photo' | 'phone' | 'birthday'
  >;

  const [userFormFieldsInfo, setUserFormFieldsInfo] = useState<TRegister>({
    email: localStorage.getItem('email') ?? '',
    last_name: localStorage.getItem('last_name') ?? '',
    name: localStorage.getItem('name') ?? '',
    surname: localStorage.getItem('surname') ?? '',
    // birthday: localStorage.getItem('birthday') ?? '',
    city: 1,
    consent_to_personal_data: false,
  });

  ////При загрузке страницы, если isAdult пуст, то проверяем localStorage, если там есть birthDate то она подцепится в форму и соотвественно надо обновить isAdult
  if (isAdult == null || birthDate.length == 0) {
    if (
      localStorage.getItem('birthday') !== undefined &&
      localStorage.getItem('birthday') !== '' &&
      localStorage.getItem('birthday') !== null
    ) {
      let string = localStorage.getItem('birthday');
      let dateString = `${string?.slice(6, 10)}-${string?.slice(3, 5)}-${string?.slice(0, 2)}`;
      setIsAdult(getAgeFromBirthDate(dateString));
      if (string !== null) {
        setBirthDate(string);
      }
    }
  }

  type TKeys = keyof typeof userFormFieldsInfo;

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TKeys, value: string | boolean) {
      setUserFormFieldsInfo({
        ...userFormFieldsInfo,
        [fieldName]: value,
      });
    if (typeof value == 'boolean')
    localStorage.setItem(fieldName, JSON.stringify(value));
    else localStorage.setItem(fieldName, value);
  }

  ////отправляем данные на сервер
  async function fetchRegistration(user: TRegisterationFormData) {
    try {
      const response = await postRegistration(user);
      if (response == true) {
        localStorage.clear(); /// если запрос прошел то отчищаем локал сторэдж
        setRegistrationCompleteModal(true);
        setIsSending(false)
         localStorage.clear(); /// если запрос прошел то отчищаем локал сторэдж
        setRegistrationCompleteModal(true);
        setIsSending(false);
      } else {
        throw new Error()
      }
    } catch (e) {
      if (e == "Error: {'email': [ErrorDetail(string='пользователь с таким email уже существует.', code='unique')]}") {
        console.log(e, 'fetchRegistration, registration page');
        setRegistrationHasFailedString(<p>Ошибка!<br/>Пользователь с таким email<br/> уже существует.</p>)
        setRequestSent(false);
        setIsSending(false);
        setRegistrationhasFailed(true);
      } else if (e == "Error: validation with phone") {
        setRegistrationHasFailedString(<p>Ошибка валидации<br/>номера телефона.</p>)
        setRequestSent(false);
        setRegistrationhasFailed(true);
        setIsSending(false);
    } else if (e == "Error: {'email': [ErrorDetail(string='Введите правильный адрес электронной почты.', code='invalid')]}") {
        setRegistrationHasFailedString(<p>Ошибка!<br />Неверный email.</p>)
        setRequestSent(false);
        setRegistrationhasFailed(true);
        setIsSending(false);
      } else if(e == "Error: {'photo': [ErrorDetail(string='Отправленный файл пуст.', code='empty')]}"){
        setRegistrationHasFailedString(<p>Ошибка!<br />Формат фотографии не поддерживается, попробуйте выбрать другое фото или сделать селфи. Подходящий формат фото: jpg, jpeg.</p>)
        setRequestSent(false);
        setRegistrationhasFailed(true);
        setIsSending(false);
      } else if(e == "Error: {'photo': [ErrorDetail(string='Загрузите правильное изображение. Файл, который вы загрузили, поврежден или не является изображением.', code='invalid_image')]}"){
        setRegistrationHasFailedString(<p>Ошибка!<br />Формат фотографии не поддерживается, попробуйте выбрать другое фото или сделать селфи. Подходящий формат фото: jpg, jpeg.</p>)
        setRequestSent(false);
        setRegistrationhasFailed(true);
        setIsSending(false);
      } else if (e == "Error" || e =="TypeError: Cannot read properties of undefined (reading 'data')") {
        setRegistrationHasFailedString(<p>Упс, возникла проблема  с интернет соединением.<br /> Попробуйте позже.</p>)
        setRequestSent(false);
        setRegistrationhasFailed(true);
        setIsSending(false);
      } else {
        //console.log(e);
      setRegistrationHasFailedString(`${e}`)
      setRequestSent(false);
      setRegistrationhasFailed(true);
      setIsSending(false);
      }
    }
  }

  //тип с переменными, которые пользователь не может изменить напрямую
  type TUserUnchangableValues = {
    tg_id: number;
    tg_username: string;
    is_adult: boolean | null;
    phone: string;
    photo: string;
    birthday: string;
    city: number;
  };

  //// бэк передает параметры пользователя через командную строку, забераем данные
  const locationForParams = useLocation();
  const query = new URLSearchParams(locationForParams.search);
  const tgId = query.get('tg_id');
  const phone_number = query.get('phone_number');
  const tg_nickname = query.get('tg_nickname');
// console.log(tg_nickname, "tg_nickname")
  //////функция для сабмита формы
  async function onFormSubmit() {
    setIsSending(true);
    setRequestSent(true);

    const userUnchangableValues: TUserUnchangableValues = {
      tg_id: tgId ? +tgId : NaN,
      tg_username: tg_nickname ? tg_nickname : '',
      is_adult: isAdult,
      phone: phone_number ? phone_number : '',
      photo: '',
      birthday: '',
      city: 0,
    };

    /////содиняем два объекта с вводимыми полями формы и с вычисляемыми полями для данного пользователя
    const user = Object.assign(userUnchangableValues, userFormFieldsInfo);
    user.birthday = `${birthDate.slice(6, 10)}-${birthDate.slice(3, 5)}-${birthDate.slice(0, 2)}`;
    user.city = cityIndex as number;
    if (user.phone.includes('+', 0)) {
      user.phone = user.phone.slice(1);
    }

    if (user.phone.slice(0, 1) == '7') {
      user.phone = '8' + user.phone.slice(1);
    }

    user.tg_username =
      user.tg_username.slice(0, 1) == '@'
        ? user.tg_username.slice(1).toLowerCase()
        : user.tg_username.toLowerCase();
    user.email = user.email.toLowerCase();
    user.last_name =
      user.last_name.slice(0, 1).toUpperCase() +
      user.last_name.slice(1).toLowerCase();
    user.name =
      user.name.slice(0, 1).toUpperCase() + user.name.slice(1).toLowerCase();
    user.surname =
      user.surname.slice(0, 1).toUpperCase() +
      user.surname.slice(1).toLowerCase();

    ///// создаем объект форм дата
    const formData = new FormData();
    ///// перебираем юзера переносим все поля `в форм дата
    for (let key in user) {
      if (key == 'photo') {
        formData.append('photo', file, `selfie-${user.tg_id}.jpeg`);
        //setUrl(window.URL.createObjectURL(blob)) //// для тестирования скачивая фото из блоб на компьютер
      } else if (key == 'consent_to_personal_data') {
        if (isAdult) {
          ///// еще одна проверка, если взвослый то отображаем согласился ли он предоставить персональные даннеы, если до 18 то ставим false
          formData.set(
            'consent_to_personal_data',
            String(user.consent_to_personal_data),
          );
        } else {
          formData.set('consent_to_personal_data', 'false');
        }
      } else if (key == 'tg_username') {
        //если ник не задан используем телефон для связи с пользователем
        formData.set('tg_username', '+7' + user.phone.slice(1))
      } else {
        const typedKey = key as
          | keyof TUserUnchangableValues
          | keyof typeof userFormFieldsInfo;
        formData.set(typedKey, String(user[typedKey])); // Приводим значение к строке, если требуется
      }
    }
    // if (formData.get('tg_username') == '') {
    //   setRegistrationHasFailedString(<p>Упс, у вашего аккаунта в Telegram  не задано имя пользователя. <br /> Пожалуйста, создайте имя пользователя и попробуйте снова пройти регистрацию.</p>)
    //   setRequestSent(false);
    //   setRegistrationhasFailed(true);
    //   setIsSending(false);
    // } else {
      
    // }
    fetchRegistration(formData); /////отправляем запрос на сервер с даттыми формДата
  }


  return (
    <>
      {registrationComplete ? (
        <div className="flex flex-col justify-center items-center w-full max-w-[500px] bg-light-gray-white dark:bg-light-gray-7-logo h-screen">
          <LogoNoTaskYet className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
          {isAdult ? (
            <div className="w-[310px] text-cventer">
              <br />
              <p className="font-gerbera-h2 dark:text-light-gray-white">
                Спасибо!
              </p>
              <p className="font-gerbera-h2 dark:text-light-gray-white">
                Получили вашу анкету, проверим в ближайшее время.
              </p>
              <br />
              <p className="font-gerbera-sub1 text-light-gray-5 dark:text-light-gray-2">
                После успешного прохождения проверки вам станут доступны
                основные функции приложения.
              </p>
              <h1 className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-white w-[325px] h-[63px] text-center mt-7">
                <br />
                Теперь вы можете перейти на{' '}
                <p
                  className="text-light-brand-green cursor-pointer"
                  onClick={() => location.reload()}
                >
                  главную страницу
                </p>
              </h1>
            </div>
          ) : (
            <div className="w-[310px] text-center">
              <br />
              <br />
              <p className="font-gerbera-h3 text-center dark:text-light-gray-white ">
                {' '}
                Спасибо! <br />
                Получили вашу анкету.
                <br />
                  <br />
                  Для завершения регистрации просим одного из ваших родителей/официального опекуна заполнить и 
                  подписать {" "}
                  <DownloadPdfButton />
                  {/* <a href="https://cloud.mail.ru/public/c4Yr/MWBRTqPv5" target="_blank" download={"document.pdf"} className="font-gerbera-h3 text-center text-light-brand-green font-normal">Согласие</a> */}
                * на ваше участие в благотворительных доставках и других добрых делах.
              </p>
              <br />
              <p className="font-gerbera-h3 text-center text-light-gray-5 dark:text-light-gray-2">
                *Подписанный документ отправьте @volunteers_dari_edu

              </p>
              <br />
              <br />
              {/* <h1 className="font-gerbera-h3 text-light-gray-black w-[325px] h-[63px] text-center mt-7 dark:text-light-gray-white">
                Теперь вы можете перейти на{' '}
                <p
                  className="text-light-brand-green cursor-pointer"
                  onClick={() => location.reload()}
                >
                  главную страницу
                  </p>
                  
                </h1> */}
                <br/>
                  {/* <h1 className="font-gerbera-h3 text-light-gray-black w-[325px] h-[63px] text-center mt-7 dark:text-light-gray-white" >Спасибо!</h1> */}
            </div>
          )}
        </div>
      ) : (
        <>
            <Form.Root
            action=""
            onSubmit={e => {
              e.preventDefault();
              onFormSubmit();
            }}
          >
            <div
              className="flex flex-col justify-start px-4 items-center w-full max-w-[500px] h-screen bg-light-gray-white dark:bg-light-gray-7-logo overflow-y-scroll"
              onClick={() => {
                setClickedCity(false);
              }}
            >
            <div className="flex flex-col justify-between  items-center w-full  pt-[24px] ">
                <div className="font-gerbera-h1 dark:text-light-gray-white mb-9">
                  Зарегистрироваться
                 </div>
                 <div className="w-full h-min-[360px] flex flex-col justify-start space-y-2 mb-9">
                  <Form.Field
                    name="last_name"
                    className="flex flex-col items-center"
                  >
                    <Form.Control asChild>
                      <input
                        className="formField"
                        placeholder="Фамилия"
                        type="text"
                        required
                        defaultValue={localStorage.getItem('last_name') ?? ''}
                          onChange={e => {
                          e.target.value = e.target.value.replace(/[^А-Яа-я]/ig, '')
                          handleFormFieldChange('last_name', e.target.value);
                        }}
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" className="error">
                      Пожалуйста, введите Вашу фамилию кириллицей
                    </Form.Message>
                    <Form.Message
                      match={value => value.length < 2}
                      className="error"
                    >
                      Минимальное количество символов 2
                    </Form.Message>
                  </Form.Field>

                  <Form.Field
                    name="name"
                    className="flex flex-col items-center"
                  >
                    <Form.Control asChild>
                      <input
                        className="formField"
                        placeholder="Имя"
                        type="text"
                        required
                        defaultValue={localStorage.getItem('name') ?? ''}
                          onChange={e => {
                          e.target.value = e.target.value.replace(/[^А-Яа-я]/ig, '')
                          handleFormFieldChange('name', e.target.value);
                        }}
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" className="error">
                      Пожалуйста, введите Ваше имя кириллицей
                    </Form.Message>
                    <Form.Message
                      match={value => value.length < 2}
                      className="error"
                    >
                      Минимальное количество символов 2
                    </Form.Message>
                  </Form.Field>
                  <Form.Field
                    name="surname"
                    className="flex flex-col items-center"
                  >
                    <Form.Control asChild>
                      <input
                        className="formField"
                        placeholder="Отчество"
                        type="text"
                        required
                        defaultValue={localStorage.getItem('surname') ?? ''}
                          onChange={e => {
                          e.target.value = e.target.value.replace(/[^А-Яа-я]/ig, '')
                          handleFormFieldChange('surname', e.target.value);
                        }}
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" className="error">
                      Пожалуйста, введите Ваше отчество кириллицей
                    </Form.Message>
                    <Form.Message
                      match={value => value.length < 2}
                      className="error"
                    >
                      Минимальное количество символов 2
                    </Form.Message>
                  </Form.Field>
                  <Form.Field
                    name="birthday"
                    className="flex flex-col items-center relative"
                  >
                    <Form.Control asChild>
                      <input
                        ref={calendarRef}
                        name="age"
                        className="formFieldBirthday bgImage"
                        placeholder="Дата рождения"
                        type="text"
                        onClick={e => {
                          e.preventDefault();
                          setOpenCalendar(true);
                          }}
                          value={localStorage.getItem('birthday') ?? ''}
                          onChange={() => {
                          localStorage.removeItem('birthday');
                          localStorage.removeItem('isAdult');
                          setIsAdult(null);
                          setDateString('')
                          setDateisMissing(true)
                        }}
                        required
                        />
                        
                    </Form.Control>
                      <CalendarIcon className="absolute ml-[70%] mt-3 fill-[#BFBFBF]" />
                      {(dateString.length < 10 && dateIsMissing) ? (
                      <p 
                      className="error"
                     >
                      Пожалуйста, введите дату рождения
                    </p>
                      ): ""}
                      
                  </Form.Field>
                  <Form.Field
                    name="email"
                    className="flex flex-col items-center"
                  >
                    <Form.Control asChild>
                      <input
                        name="email"
                        className="formField"
                        placeholder="Email"
                        type="email"
                        required
                        defaultValue={localStorage.getItem('email') ?? ''}
                          onChange={e => {
                          handleFormFieldChange('email', e.target.value);
                          }}
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" className="error">
                      Пожалуйста, введите ваш email
                    </Form.Message>
                      <Form.Message match='typeMismatch' className="error">
                      Неверный имейл
                      </Form.Message>
                      <Form.Message match={(value) => {
                        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                        return reg.test(value) == false ? true : false;
                      }} className="error">
                      Неверный имейл
                    </Form.Message>
                    <Form.Message
                      match={value => value.length < 6}
                      className="error"
                    >
                      Минимальное количество символов 6
                    </Form.Message>
                  </Form.Field>
                  <div className='w-full relative'>
                    <InputOptions
                      options={cityOptions}
                      clicked={clickedCity}
                      setClicked={setClickedCity}
                      choiceMade={cityIndex}
                      setChoiceMade={setCityIndex}
                    />
                  </div>
                </div>
                  {isAdult !== null && isAdult !== false ? (
                  <CheckboxElement
                    onCheckedChange={() => {
                      handleFormFieldChange(
                        'consent_to_personal_data',
                        checked ? false : true,
                      );
                      checked ? setChecked(false) : setChecked(true);
                    }}
                  >
                    <label className="font-gerbera-sub2 text-light-gray-6 dark:text-light-gray-2 h-fit text-left w-[80%]">
                      Я принимаю условия{' '}
                      <b
                        className="text-light-brand-green font-normal text-left cursor-pointer"
                        onClick={() => {
                          setConcentOpenModal(true);
                        }}
                      >
                        договора-оферты.
                      </b>
                    </label>
                  </CheckboxElement>
                ) : (
                  ''
                )}
              </div>
              <div className="flex flex-col justify-between h-[254px] w-full mt-[20px]">
                  {pictureConfirmed ? (
                    <div className="flex flex-col justify-around items-center">
                      <div className=" bg-light-gray-1 rounded-full flex justify-center items-center">
                        <img
                          src={uploadedPictureLink}
                          className="h-[142px] w-[142px] rounded-full object-cover"
                        />
                      </div>
                      <Pencile
                        className="relative -mt-[25px] ml-[70px] rounded-full bg-light-gray-2 fill-light-gray-8-text dark:bg-light-gray-5 dark:fill-light-gray-1"
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between place-items-start my-4 ">
                      <div className="w-[80%] h-[72px] flex flex-col justify-between items-start">
                        <h3 className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
                          Сделайте свое фото
                        </h3>
                        <p
                          className={
                            !tryToSubmitWithoutPic
                              ? 'font-gerbera-sub1 text-light-gray-6 text-left dark:text-light-gray-2'
                              : 'font-gerbera-sub1 text-light-error-red  text-left'
                          }
                        >
                          Чтобы продолжить регистрацию, сделайте, пожалуйста,
                          фото на камеру телефона так, чтобы было хорошо видно
                          ваше лицо
                        </p>
                      </div>
                      <Photo
                        className="h-[35px] w-[38px] cursor-pointer fill-light-gray-3"
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className={
                      !isAdult
                        ? 'btn-B-GreenDefault my-8 self-center'
                        : checked
                          ? 'btn-B-GreenDefault my-8 self-center'
                          : 'btn-B-GreenInactive my-8 self-center'
                    }
                    onClick={e => {
                      if (isAdult && !checked) {
                        e.preventDefault();
                      } else {
                        if (!pictureConfirmed) {
                          setTryToSubmitWithoutPic(true);
                          e.preventDefault();
                        } else {
                          setTryToSubmitWithoutPic(true);
                          if (dateString.length < 10) {
                            setDateisMissing(true)//// добавляю ручную проверку наличия даты рождения
                          }
                        }
                      }
                      if (requestSent) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {requestSent ? 'Запрос отправлен' : 'Отправить заявку'}
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
                  setFile={setFile}
                  uploadedFile={uploadedFile}
                  setUploadedFile={setUploadedFile}
                  
                />
              </Modal>
              <ConfirmModal
                isOpen={registrationCompleteModal}
                onOpenChange={setRegistrationCompleteModal}
                onConfirm={() => {
                  setRegistrationComplete(true);
                  setRegistrationCompleteModal(false);
                }}
                title="Ваша заявка принята! Мы рассмотрим её в течение 24 часов"
                description=""
                confirmText="Ок"
                isSingleButton={true}
              ></ConfirmModal>
            </div>
          </Form.Root>
            <Modal isOpen={openCalendar} onOpenChange={setOpenCalendar}>
              <div className='mb-20'>
              <InputDate
              onClose={() => {
                setOpenCalendar(false);
              }}
              selectionMode="single"
              setCurrentDate={calcBirthday}
              categories={[]}
              filterCategories={[]}
              maxYear={new Date().getFullYear()-13}
              setFilterCategories={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
              </div>
          </Modal>
          <Modal isOpen={concentOpenModal} onOpenChange={setConcentOpenModal}>
            <ConcentToPersonalData onOpenChange={setConcentOpenModal} />
          </Modal>
          <ConfirmModal
            isOpen={registrationhasFailed}
            onOpenChange={setRegistrationhasFailed}
            onConfirm={() => setRegistrationhasFailed(false)}
            title={
             registrationHasFailedString
            }
            description=""
            confirmText="Закрыть"
            isSingleButton={true}
          />
        </>
      )}
      <Modal onOpenChange={()=>{}} isOpen={isSending}>
        <div className="h-screen items-center flex flex-col justify-center ">
          <div className='loader'></div>
        </div>
      </Modal>
    </>
  );
}

export default RegistrationPage;
