import * as Form from '@radix-ui/react-form';
//import * as Select from "@radix-ui/react-select";
import { Selfie } from './../../components/Selfie/Selfie.tsx';
import './index.css';
import { Modal } from './../../components/ui/Modal/Modal.tsx';
import React, { useRef, useState } from 'react';
import { CheckboxElement } from './../../components/ui/CheckboxElement/CheckboxElement';
import InputDate from '../../components/InputDate/InputDate.tsx';
import ConcentToPersonalData from './ConcentToPersonalData.tsx';
import { getTelegramParams } from '../../core/getQueryParams.ts';

import {
  postRegistration,
  type TRegisterationFormData,
  IUserRegistered,
} from '../../api/apiRegistrationToken.ts';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal.tsx';

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
  //const [birthdayMissing, setBirthdayMissing] = useState(false);

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

  async function fetchRegistration(user: TRegisterationFormData) {
    try {
      const response = await postRegistration(user);
      if (response == true) {
        //setRequestForRegistrationSubmited('submitSuccess'); ///// устанавливаем дата, чтобы знать, что отображать на экране
        localStorage.clear(); /// если запрос прошел то отчищаем локал сторэдж
      }
    } catch (e) {
      console.log('запрос fetchRegistration  прошел с ошибкой', e);
      //  setRequestForRegistrationSubmited('submitFailed');
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
  };
  //////функция для сабмита формы
  function onFormSubmit() {
    const { tgId, tgUsername, phone } = getTelegramParams();

    const userUnchangableValues: TUserUnchangableValues = {
      tg_id: tgId || 0,
      tg_username: tgUsername || '',
      is_adult: isAdult,
      phone: phone || '',
      photo: '',
      birthday: '',
    };
    /////содиняем два объекта с вводимыми полями формы и с вычисляемыми полями для данного пользователя
    const user = Object.assign(userUnchangableValues, userFormFieldsInfo);
    // let cityIndex = 1; //// будет функция для вычисления города
    user.birthday = `${birthDate.slice(6, 10)}-${birthDate.slice(3, 5)}-${birthDate.slice(0, 2)}`;
    console.log(user);
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

  return (
    <>
      {/* {requestForRegistrationSubmited == 'submitSuccess' ? (
        <div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
          <img src="./../src/assets/icons/AwaitConfirmRegistrationLogo.svg"></img>
          <h1 className="font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center">
            Мы обрабатываем вашу заявку, в ближайшее время с вами свяжется
            координатор
          </h1>
        </div>
      ) :  requestForRegistrationSubmited == 'submitFailed' ? (
        <div className="flex flex-col justify-center items-center w-[360px] bg-light-gray-white h-screen">
          <img src="./../src/assets/icons/AwaitConfirmRegistrationLogo.svg"></img>
          <h1 className="font-gerbera-h2 text-light-gray-black w-[325px] h-[63px] text-center">
            Упс.. что-то пошло не так
          </h1>
        </div>
      ) : ( */}

      <Form.Root
        action=""
        onSubmit={e => {
          e.preventDefault();
          onFormSubmit();
        }}
      >
        <div className="flex flex-col justify-around items-center w-[360px] h-fit bg-light-gray-white">
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
                <Form.Field name="city" className="flex flex-col items-center">
                  <Form.Control asChild>
                    {/* <Select.Root  onValueChange={(e) => { handleFormFieldChange('city', e.target.value)}}>
		<Select.Trigger className='formField'>
			<Select.Value placeholder="Выберете город проживания"/>
			<Select.Icon className="SelectIcon">
				<ChevronDownIcon />
			</Select.Icon>
		</Select.Trigger>
		<Select.Portal>
        <Select.Content defaultValue="1" className="SelectContent">
				<Select.Viewport className="SelectViewport" >
					<Select.Group defaultValue='1'>
						<Select.SelectItem value="1" className='formField'>Москва</Select.SelectItem>
						<Select.SelectItem value="2" className='formField'>Санкт-Петербург</Select.SelectItem>
					</Select.Group>
			</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root> */}

                    <select
                      className="formField"
                      //placeholder="Город проживания"
                      // type="select"

                      defaultValue={localStorage.getItem('city') ?? ''}
                      onChange={e => {
                        handleFormFieldChange('city', String(e.target.value));
                        // localStorage.setItem("city", e.target.value)
                      }}
                    >
                      <option value={1} selected>
                        Москва
                      </option>
                      <option value={2}>Санкт-Петербург</option>
                    </select>
                  </Form.Control>
                  {/* <Form.Message match="valueMissing" className="error">
                      Пожалуйста выберете город проживания
                    </Form.Message> */}
                </Form.Field>
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
                <div className=" bg-light-gray-1 rounded-full flex justify-center items-center relative">
                  <img
                    src={uploadedPictureLink}
                    className="h-[142px] w-[142px] rounded-full"
                  />
                  <img
                    src="./../src/assets/icons/small_pencile_bg_gray.svg"
                    className="absolute bottom-0 right-0"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                </div>
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

      {/* )}  */}
    </>
  );
}

export default RegistrationPage;
