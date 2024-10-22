import React, { useState, useContext } from 'react';
import geoIcon from '../../../assets/icons/geo.svg';
import emailIcon from '../../../assets/icons/email.svg';
import birthdayIcon from '../../../assets/icons/birthday.svg';
import phoneIcon from '../../../assets/icons/phone.svg';
import telegramIcon from '../../../assets/icons/telegram.svg';
import big_pencilIcon from '../../../assets/icons/big_pencil.svg';
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
      const updatedUser = await patchUser(currentUser.id, {
        [field]: formData[field],
      });

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
    geoIcon,
    emailIcon,
    birthdayIcon,
    phoneIcon,
    telegramIcon,
  ];
  const changeIconLink = big_pencilIcon;

  return (
    <div className="w-[360px] h-[410px] bg-light-gray-white flex flex-col justify-between">
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
                <img src={iconsLinks[index]} className="w-[42px] h-[42px]" />
                <p className="ml-3.5">{item}</p>
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
                <img src={iconsLinks[index]} className="w-[42px] h-[42px]" />
                {isEditing[field] ? (
                  <input
                    className="ml-3.5 p-1 border rounded"
                    value={formData[field]}
                    onChange={e => handleInputChange(e, field)}
                    onBlur={() => handleSave(field)}
                  />
                ) : (
                  <p className="ml-3.5">{formData[field]}</p>
                )}
              </div>
              <img
                src={changeIconLink}
                className="w-[42px] h-[42px] cursor-pointer"
                onClick={() => toggleEdit(field)}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
