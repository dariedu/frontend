import * as Form from '@radix-ui/react-form';
import { Selfie } from './../../components/Selfie/Selfie.tsx';
import './index.css';
import { Modal } from './../../components/ui/Modal/Modal.tsx';
import React, { useRef, useState, useEffect } from 'react';
import { CheckboxElement } from './../../components/ui/CheckboxElement/CheckboxElement';
import InputDate from '../../components/InputDate/InputDate.tsx';
import ConcentToPersonalData from './ConcentToPersonalData.tsx';
import {
  postRegistration,
  type TRegisterationFormData,
  IUserRegistered,
} from '../../api/apiRegistrationToken.ts';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal.tsx';
import InputOptions from './InputOptions.tsx';
import { fetchCities, type TCity } from '../../api/cityApi.ts';

function RegistrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); /// открыть модальное для загрузки своей фотографии
  const [pictureConfirmed, setPictureConfirmed] = useState(false); // подтвердил ли юзер загруженное фото
  const [uploadedPictureLink, setUploadedPictureLink] = useState(''); /// ссылка на загруженое фото
  const [registrationCompleteModal, setRegistrationCompleteModal] =
    useState(false);
  const [checked, setChecked] = useState(false); // активируем кнопку отпарвки, если согласились с офертой для взрослых
  const [isAdult, setIsAdult] = useState<boolean | null>(null); ///
  const [tryToSubmitWithoutPic, setTryToSubmitWithoutPic] = useState(false); // уведомляем пользователя, если он не засабмитил фото
  const [birthDate, setBirthDate] = useState<string>('');
  //const [requestForRegistrationSubmited, setRequestForRegistrationSubmited] = useState<'start' | 'submitSuccess' | 'submitFailed'>('start');
  //const [res, setRes] = useState<boolean|undefined>();
  const [blob, setBlob] = useState<Blob>(new Blob()); ////форматит фото в блоб файл
  const [openCalendar, setOpenCalendar] = useState(false); ////открывает модалку с календарем
  const calendarRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef(null);
  const [concentOpenModal, setConcentOpenModal] = useState(false); /// открываем окно с условиями обработки персональных данных
  const [registrationComplete, setRegistrationComplete] = useState(false);


  ///// данные для инпута для выбора города
  const [clickedCity, setClickedCity] = useState(false);
  const [cityOptions, setCityOptions] = useState<[number, string][]>([
    [1, 'Москва'],
    [3, 'Ростов-на-Дону'],
    [4, 'другой'],
  ]);
  const [cityIndex, setCityIndex] = useState<number>(1);
  ///// данные для инпута для выбора города

   ////// запрашиваем города и пушим их в cityOptions для формирования инпута
  async function reqCiliesList() {
  
    let arr: [number, string][] = [];
    try {
      const result: TCity[] = await fetchCities();
      result.forEach(res => {
        arr.push([res.id, res.city]);
      })
    } catch (err) {
      //alert(err + ' reqCiliesList has failed, registrationPage')
      console.error(err, 'reqCiliesList has failed, registrationPage');
    } finally {
      if (arr.length > 0) {
        setCityOptions(arr);
      }
    }
  }

  /////запрашиваем города один раз при загрузке страницы
  useEffect(() => {
    reqCiliesList();
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
    // setBirthdayMissing(false);
    if (calendarRef.current != undefined && calendarRef.current != null) {
      calendarRef.current.value = dateString;
    }
  };

  type TRegister = Omit<
    IUserRegistered,
    | 'is_adult'
    | 'tg_id'
    | 'tg_username'
    | 'photo'
    | 'phone'
    | 'birthday'
    | 'city'
  >;

  const [userFormFieldsInfo, setUserFormFieldsInfo] = useState<TRegister>({
    email: localStorage.getItem('email') ?? '',
    last_name: localStorage.getItem('last_name') ?? '',
    name: localStorage.getItem('name') ?? '',
    surname: localStorage.getItem('surname') ?? '',
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

  async function fetchRegistration(user: TRegisterationFormData) {
    try {
      const response = await postRegistration(user);
      if (response == true) {
        localStorage.clear(); /// если запрос прошел то отчищаем локал сторэдж
      }
    } catch (e) {
      console.log('запрос fetchRegistration  прошел с ошибкой', e);
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
  //////функция для сабмита формы
  function onFormSubmit() {
    const userUnchangableValues: TUserUnchangableValues = {
      tg_id: 123456,
      tg_username: 'mgdata',
      is_adult: isAdult,
      phone: '9086851174',
      photo: '',
      birthday: '',
      city: 0,
    };

    /////содиняем два объекта с вводимыми полями формы и с вычисляемыми полями для данного пользователя
    const user = Object.assign(userUnchangableValues, userFormFieldsInfo);
    user.birthday = `${birthDate.slice(6, 10)}-${birthDate.slice(3, 5)}-${birthDate.slice(0, 2)}`;
    user.city = cityIndex
    ///// создаем объект форм дата
    const formData = new FormData();
    ///// перебираем юзера переносим все поля в форм дата
    for (let key in user) {
      if (key == 'photo') {
        formData.set('photo', blob, `selfie-${user.tg_id}.jpeg`);
        // setUrl(window.URL.createObjectURL(blob)) //// для тестирования скачивая фото из блоб на компьютер
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
      } else {
        const typedKey = key as
          | keyof TUserUnchangableValues
          | keyof typeof userFormFieldsInfo;
        formData.set(typedKey, String(user[typedKey])); // Приводим значение к строке, если требуется
      }
    }
    fetchRegistration(formData); /////отправляем запрос на сервер с даттыми формДата
    setRegistrationCompleteModal(true);
  }


  // :  requestForRegistrationSubmited == 'submitFailed' ? (
  //   <div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
  //     <img src="./../src/assets/icons/AwaitConfirmRegistrationLogo.svg"></img>
  //     <h1 className="font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center">
  //       Упс.. что-то пошло не так
  //     </h1>
  //   </div>
  // )

  return (
    <>
       {registrationComplete? (
        <div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
          <img src="./../src/assets/icons/AwaitConfirmRegistrationLogo.svg"></img>
          <h1 className="font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center">
            Благодарим за регистрацию!<br/>
            Теперь вы можете перейти на главную страницу
          </h1>
        </div>) : (
          <>
             <Form.Root
                action=""
                onSubmit={e => {
                  e.preventDefault();
                  onFormSubmit();
                }}
              >
                <div
                  className="flex flex-col justify-around items-center w-[360px] h-fit bg-light-gray-white"
                  onClick={() => {
                    setClickedCity(false);
                  }}
                >
                  <div className="flex flex-col justify-between items-center w-fit h-fit min-h-[520px] max-h-[559px] pt-[24px] pb-[28px]">
                    <div className="font-gerbera-h1 my-">Зарегистрироваться</div>
                    <div className="w-[328px] h-min-[360px] flex flex-col justify-between">
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
                              handleFormFieldChange('last_name', e.target.value);
                            }}
                          />
                        </Form.Control>
                        <Form.Message match="valueMissing" className="error">
                          Пожалуйста, введите вашу фамилию
                        </Form.Message>
                      </Form.Field>
        
                      <Form.Field name="name" className="flex flex-col items-center">
                        <Form.Control asChild>
                          <input
                            className="formField"
                            placeholder="Имя"
                            type="text"
                            required
                            defaultValue={localStorage.getItem('name') ?? ''}
                            onChange={e => {
                              handleFormFieldChange('name', e.target.value);
                            }}
                          />
                        </Form.Control>
                        <Form.Message match="valueMissing" className="error">
                          Пожалуйста, введите ваше имя
                        </Form.Message>
                      </Form.Field>
                      <Form.Field name="surname" className="flex flex-col items-center">
                        <Form.Control asChild>
                          <input
                            className="formField"
                            placeholder="Отчество"
                            type="text"
                            required
                            defaultValue={localStorage.getItem('surname') ?? ''}
                            onChange={e => {
                              handleFormFieldChange('surname', e.target.value);
                            }}
                          />
                        </Form.Control>
                        <Form.Message match="valueMissing" className="error">
                          Пожалуйста, введите ваше отчество
                        </Form.Message>
                      </Form.Field>
                      <Form.Field
                        name="birthday"
                        className="flex flex-col items-center"
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
                            defaultValue={localStorage.getItem('birthday') ?? ''}
                            onChange={() => {
                              localStorage.removeItem('birthday');
                              localStorage.removeItem('isAdult');
                              setIsAdult(null);
                            }}
                            required
                          />
                        </Form.Control>
                        <Form.Message match="valueMissing" className="error">
                          Пожалуйста введите дату рождения
                        </Form.Message>
                      </Form.Field>
        
                      <Form.Field name="email" className="flex flex-col items-center">
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
                          Пожалуйста введите ваш имейл
                        </Form.Message>
                        <Form.Message match="typeMismatch" className="error">
                          Неверный имейл
                        </Form.Message>
                      </Form.Field>
                      <div>
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
                        <label className="font-gerbera-sub2 text-light-gray-6 w-[261px] text-left">
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
        
                  <div className="flex flex-col justify-between h-[254px]">
                    {pictureConfirmed ? (
                      <div className="flex flex-col justify-around items-center">
                        <div className=" bg-light-gray-1 rounded-full flex justify-center items-center">
                          <img
                            src={uploadedPictureLink}
                            className="h-[142px] w-[142px] rounded-full"
                          />
                        </div>
                        <img
                          src="./../src/assets/icons/small_pencile_bg_gray.svg"
                          className="relative -mt-[25px] ml-[70px]"
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between place-items-start my-4">
                        <div className="w-[235px] h-[72px] flex flex-col justify-between items-start">
                          <h3 className="font-gerbera-h3 text-light-gray-black">
                            Сделайте свое фото
                          </h3>
                          <p
                            className={
                              !tryToSubmitWithoutPic
                                ? 'font-gerbera-sub1 text-light-gray-6 text-left'
                                : 'font-gerbera-sub1 text-light-error-red  text-left'
                            }
                          >
                            Чтобы продолжить регистрацию, сделайте, пожалуйста, фото на
                            камеру телефона так, чтобы было хорошо видно ваше лицо
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
                      type="submit"
                      className={
                        !isAdult
                          ? 'btn-B-GreenDefault mb-8'
                          : checked
                            ? 'btn-B-GreenDefault mb-8'
                            : 'btn-B-GreenInactive mb-8'
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
                          }
                        }
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
                  <ConfirmModal
                    isOpen={registrationCompleteModal}
                    onOpenChange={setRegistrationCompleteModal}
                    onConfirm={() => {
                      setRegistrationComplete(true)
                      setRegistrationCompleteModal(false);
                    }}
                    title="Ваша заявка принята! Мы рассмотрим её в течение 24 часов"
                    description=""
                    confirmText="Ок"
                    isSingleButton={true}
                  ></ConfirmModal>
                </div>
              </Form.Root>
              <Modal isOpen={openCalendar} onOpenChange={setOpenCalendar}>
                <InputDate
                onClose={() => {
                    setOpenCalendar(false);
                  }}
                  selectionMode="single"
                  setCurrentDate={calcBirthday}
                />
              </Modal>
              <Modal isOpen={concentOpenModal} onOpenChange={setConcentOpenModal}>
                <ConcentToPersonalData />
              </Modal>
          </>
        )}
    </>
        )
}

export default RegistrationPage;
