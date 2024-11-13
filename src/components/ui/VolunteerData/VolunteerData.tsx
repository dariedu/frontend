import React, { useState, useContext } from 'react';
import GeoIcon from '../../../assets/icons/geo.svg?react';
import EmailIcon from '../../../assets/icons/email.svg?react';
import BirthdayIcon from '../../../assets/icons/birthday.svg?react';
import PhoneIcon from '../../../assets/icons/phone.svg?react';
import TelegramIcon from '../../../assets/icons/telegram.svg?react';
import Big_pencilIcon from '../../../assets/icons/big_pencil.svg?react';
import { UserContext } from '../../../core/UserContext';
import { patchUser } from '../../../api/userApi';

interface IVolunteerDataProps {
  geo: string;
  email: string;
  birthday: string;
  phone: string;
  telegram: string;
}

export const VolunteerData: React.FC<IVolunteerDataProps> = ({
  geo,
  email,
  phone,
  telegram,
}) => {
  const { currentUser, token } = useContext(UserContext);

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  const birthdayFormatted = currentUser.birthday
    ? new Date(currentUser.birthday).toLocaleDateString()
    : 'Дата рождения не указана';

  const [formData, setFormData] = useState({
    geo,
    email,
    birthday: birthdayFormatted,
    phone,
  });

  const [isEditing, setIsEditing] = useState({
    geo: false,
    email: false,
    birthday: false,
    phone: false,
  });

  // Обработчик для изменения значений полей
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData,
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  // Функция для переключения режима редактирования
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Функция для отправки обновленных данных на сервер
  const handleSave = async (field: keyof typeof formData) => {
    if (!currentUser || !token) return;

    try {
      // Отправляем обновленные данные на бэкенд
      const updatedUser = await patchUser(
        currentUser.id,
        {
          [field]: formData[field],
        },
        token,
      );

      console.log('Пользователь успешно обновлен:', updatedUser);

      // Выключаем режим редактирования
      setIsEditing(prev => ({
        ...prev,
        [field]: false,
      }));
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  const items = [
    formData.geo,
    formData.email,
    formData.birthday,
    formData.phone,
    telegram,
  ];
  const iconsLinks = [
    <GeoIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <EmailIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <BirthdayIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <PhoneIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
    <TelegramIcon className="w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black" />,
  ];

  return (
    <div className="w-[360px] h-[410px] bg-light-gray-white dark:bg-light-gray-7-logo flex flex-col justify-between mt-1 rounded-2xl">
      {items.map((item, index) => {
        const field = Object.keys(isEditing)[index] as keyof typeof formData;
        // Если это поле telegram (последний элемент), не делаем его редактируемым
        if (index === 4) {
          return (
            <div
              className="w-[360px] h-[66px] flex items-center justify-between px-3.5"
              key={index}
            >
              <div className="inline-flex items-center justify-start">
                {iconsLinks[index]}
                <p className="ml-3.5 dark:text-light-gray-1">{item}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div
              className="w-[360px] h-[66px] flex items-center justify-between px-3.5"
              key={index}
            >
              <div className="inline-flex items-center justify-start">
                {iconsLinks[index]}
                {isEditing[field] ? (
                  <input
                    className="ml-3.5 p-1 border rounded"
                    value={formData[field]}
                    onChange={e => handleInputChange(e, field)}
                    onBlur={() => handleSave(field)}
                  />
                ) : (
                  <p className="ml-3.5 dark:text-light-gray-1">
                    {formData[field]}
                  </p>
                )}
              </div>
              <Big_pencilIcon
                className="w-[42px] h-[42px] cursor-pointer fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"
                onClick={() => toggleEdit(field)}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
