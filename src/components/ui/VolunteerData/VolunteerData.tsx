import React, { useState, useContext, useEffect } from 'react';
import GeoIcon from '../../../assets/icons/geo.svg?react';
import EmailIcon from '../../../assets/icons/email.svg?react';
import BirthdayIcon from '../../../assets/icons/birthday.svg?react';
import PhoneIcon from '../../../assets/icons/phone.svg?react';
import TelegramIcon from '../../../assets/icons/telegram.svg?react';
import Big_pencilIcon from '../../../assets/icons/big_pencil.svg?react';
import { UserContext } from '../../../core/UserContext';
import { patchUser} from '../../../api/userApi';
import { TokenContext } from '../../../core/TokenContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { fetchCities, type TCity } from '../../../api/cityApi';
import InputOptions, {type T} from '../../../pages/Registration/InputOptions';

interface IVolunteerDataProps {
  geo: string
  geoIndex:number
  email: string
  birthday: string
  phone: string
  telegram: string
}

export const VolunteerData: React.FC<IVolunteerDataProps> = ({
  geo,
  geoIndex,
  email,
  phone,
  telegram,
}) => {
  const { currentUser } = useContext(UserContext);
  const { token } = useContext(TokenContext)
  const [nik, setNik] = useState<string>('');
  const [updateNikFail, setUpdateNikFail] = useState(false);
  const [noNeedToUpdateNik, setNoNeedToUpdateNik] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [updateDataSuccess, setUpdateDataSuccess] = useState(false);
  const [updateDataFail, setUpdateDataFail] = useState(false);
  const [askUpdateCity, setAskUpdateCity] = useState(false);
  const [userEmail, setUserEmail] = useState(email)
  const [askUpdateEmail, setAskUpdateEmail] = useState(false);
  

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

   ///// данные для инпута для выбора города
   const [clickedCity, setClickedCity] = useState(false);
   const [cityOptions, setCityOptions] = useState<[number, string][]>([
     [1, 'Москва'],
     [3, 'другой'],
   ]);
  const [cityIndex, setCityIndex] = useState<T>(1);
  const [updatePhoneModal, setUpdatePhoneModal] = useState(false)
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
 

  const birthdayFormatted = currentUser.birthday
    ? new Date(currentUser.birthday).toLocaleDateString()
    : 'Дата рождения не указана';

  const formData = {
    geo,
    email,
    phone,
    telegram,
    birthday: birthdayFormatted,
  }


  const [isEditing, setIsEditing] = useState({
    geo: false,
    email: false,
    phone: false,
    telegram: false,
    birthday: false,
  });

  // Обработчик для изменения значений полей
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserEmail(e.currentTarget.value)
  };

  // Функция для переключения режима редактирования
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };




  async function handleSave(field: "email" | "geo", value: string) {
    if (currentUser && token) {
      // const formData = new FormData(); // создаем объект FormData для передачи файла
      // formData.set(field, value);
      try {
        // Отправляем обновленные данные на бэкенд
        const updatedUser = await patchUser(currentUser.id, {[field]: value}, token,);
        if (updatedUser) {
          //console.log(updatedUser)
          setUpdateDataSuccess(true)
        }
      } catch (err) {
        setUpdateDataFail(true)
        console.log(err, "handleSave")
      }
    }
  };

  const handleSaveTelegramNik = async (data: string) => {
    if (!currentUser || !token) return;
    try {
      // Отправляем обновленные данные на бэкенд
      const updatedUser = await patchUser(
        currentUser.id,
        {
          [telegram]: data.toLowerCase(),
        },
        token,
      );
      if (updatedUser) {
        //console.log(updatedUser, "handleSaveTelegramNik")
        setUpdateDataSuccess(true)
      }
    } catch (error) {
      setUpdateDataFail(true)
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  function updateTelegram() {
    if (window.Telegram?.WebApp?.initDataUnsafe) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      const tgNik = initData.user?.username
      if (tgNik) {
        if (tgNik.toLowerCase() == currentUser?.tg_username.toLowerCase()) {
          setNoNeedToUpdateNik(true)
        }
        setNik(tgNik.toLowerCase());
        setConfirmUpdate(true)
      } else {
        setUpdateNikFail(true)
      }
    }
  };

  function updatePhone() {
    setUpdatePhoneModal(true)
  };

  const items = [
    formData.geo,
    formData.email,
    formData.phone,
    telegram,
    formData.birthday,
  ];
  const iconsLinks = [
    <GeoIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <EmailIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <PhoneIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <TelegramIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <BirthdayIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
  ];


  return (
    <div className="w-full max-w-[500px] h-[410px] bg-light-gray-white dark:bg-light-gray-7-logo flex flex-col justify-between mt-1 rounded-2xl">
      {items.map((_, index) => {
        const field = Object.keys(isEditing)[index] as keyof typeof formData;
        if (index === 3 || index === 2) {
          return (
            <div
              className="w-full min-w-[346px] h-[66px] flex items-center justify-between px-4"
              key={index}
            >
              <div className="inline-flex items-center justify-start">
                {iconsLinks[index]}
                <p className="ml-3.5 dark:text-light-gray-1">
                    {formData[field]}
                  </p>
              </div>
              <Big_pencilIcon
                className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] cursor-pointer fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"
                onClick={() => {index == 2 ? updatePhone() : updateTelegram()}}
              />
            </div>
          );
        } else if (index === 4) {
          return (
            <div
              className="w-full min-w-[346px] h-[66px] flex items-center justify-between px-4"
              key={index}
            >
              <div className="inline-flex items-center justify-start">
                {iconsLinks[index]}
                  <p className="ml-3.5 dark:text-light-gray-1">
                    {formData[field]}
                  </p>
              </div>
            </div>
          )
        } else if (index == 0) {
          return (
            <div
          className="w-full min-w-[346px] relative h-[66px] flex items-center justify-between px-4"
          key={index}
        >
          <div className="inline-flex items-center justify-start ">
            {iconsLinks[index]}
            {isEditing[field] ? (
             <div className='w-[240px]'>
             <InputOptions
               options={cityOptions}
               clicked={clickedCity}
               setClicked={setClickedCity}
               choiceMade={cityIndex}
               setChoiceMade={setCityIndex}
               style={true}
                  />
              </div>
            ) : (
              <p className="ml-3.5 dark:text-light-gray-1">
                {formData[field]}
              </p>
            )}
          </div>
          <Big_pencilIcon
            className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] cursor-pointer fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"
                onClick={() => {
                  toggleEdit(field); if (isEditing.geo) {
                    if (geoIndex != cityIndex) {
                    setAskUpdateCity(true)
                  }
                } } }
          />
        </div>
 )} else {
          return (
            <div
              className="w-full min-w-[346px] h-[66px] flex items-center justify-between px-4"
              key={index}
            >
              <div className="inline-flex items-center justify-start">
                {iconsLinks[index]}
                {isEditing[field] ? (
                  <input
                    className="px-4 rounded-2xl outline-none py-[18px] w-[240px] h-[54px] bg-light-gray-1 text-light-gray-8-text dark:text-light-gray-white dark:bg-light-gray-6 font-gerbera-h3 text-left"
                    value={userEmail}
                    onChange={e => handleInputChange(e)}
                  />
                ) : (
                  <p className="ml-3.5 dark:text-light-gray-1 ">
                    {userEmail}
                  </p>
                )}
              </div>
              <Big_pencilIcon
                className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] cursor-pointer fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"
                onClick={() => {
                  toggleEdit(field); 
                  if (isEditing.email) {
                    if (email !== userEmail) {
                    setAskUpdateEmail(true)
                  }
                } 
                }}
              />
            </div>
          );
        }
      })}
      {nik ? 
       <ConfirmModal
       isOpen={confirmUpdate}
       onOpenChange={setConfirmUpdate}
        onConfirm={() => { handleSaveTelegramNik(nik); setConfirmUpdate(false) }}
        onCancel={() => setConfirmUpdate(false)}
       title={
         <p>
           Ваш новый Telegram ник: {nik}.
           <br /> Обновить?
         </p>
       }
       description=""
        confirmText="Обновить"
        cancelText='Закрыть'
        isSingleButton={false}
        zIndex={true}
        /> : 
        <ConfirmModal
       isOpen={updateNikFail}
       onOpenChange={setUpdateNikFail}
        onConfirm={() => { setUpdateNikFail(false) }}
       title={
         <p>
           Упс, нет доступа к <br/>Вашему нику в Telegram.
           <br />Попробуйте позже.
         </p>
       }
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
        />}
       <ConfirmModal
       isOpen={noNeedToUpdateNik}
       onOpenChange={setNoNeedToUpdateNik}
       onConfirm={() => { setNoNeedToUpdateNik(false); setConfirmUpdate(false) }}
       title={
         <p>
          Ваш Telegram ник <br />в приложении "Дари Еду"<br />
          совпадает с ником в Telegram.
         </p>
       }
       description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
        /> 
      <ConfirmModal
        isOpen={updatePhoneModal}
        onOpenChange={setUpdatePhoneModal}
        onConfirm={() => {setUpdatePhoneModal(false) }}
        title={
          <p>
            Обновить номер телефона <br/> можно 
           только через <br/>Telegram бот.
          </p>
        }
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
         />
        {cityIndex && cityOptions.find(i => i[0] == cityIndex) &&
       <ConfirmModal
       isOpen={askUpdateCity}
       onOpenChange={setAskUpdateCity}
        onConfirm={() => { setAskUpdateCity(false); handleSave('geo', `${cityIndex}`) }}
        onCancel={() => setAskUpdateCity(false)}
       title={
         <p>
           Ваш новый город: {cityOptions.find(i => i[0] == cityIndex)?.[1]}.
           <br /> Обновить?
         </p>
       }
       description=""
        confirmText="Обновить"
        cancelText='Закрыть'
        isSingleButton={false}
        zIndex={true}
        />}
              <ConfirmModal
       isOpen={askUpdateEmail}
       onOpenChange={setAskUpdateEmail}
       onConfirm={() => { setAskUpdateEmail(false); handleSave('email', userEmail) }}
        onCancel={() => { setAskUpdateEmail(false); setUserEmail(email) }}
       title={
         <p>
           Ваш новый имейл: {userEmail}.
           <br /> Обновить?
         </p>
       }
       description=""
        confirmText="Обновить"
        cancelText='Сбросить'
        isSingleButton={false}
        zIndex={true}
        />
      <ConfirmModal
       isOpen={updateDataSuccess}
       onOpenChange={setUpdateDataSuccess}
        onConfirm={() => {setUpdateDataSuccess(false) }}
        title={<p>Отлично!<br /> Данные обновлены!</p>}
       description=""
       confirmText="Закрыть"
        isSingleButton={true}
        zIndex={true}
      />
      <ConfirmModal
       isOpen={updateDataFail}
       onOpenChange={setUpdateDataFail}
        onConfirm={() => {setUpdateDataFail(false)}}
       title={
         <p>
           Упс, что-то пошло не так!
           <br /> Попробуйте позже.
         </p>
       }
       description=""
       confirmText="Закрыть"
        isSingleButton={true}
        zIndex={true}
     />
       
    </div>
  );
};
