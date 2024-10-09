import React, { useState } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import logoText from '../../assets/logoText.svg';
import bell from '../../assets/icons/Notifications.svg';
import ProfileUser from '../ProfileUser/ProfileUser'; // Импорт компонента профиля пользователя

interface INavigationBarProps {
  variant: 'volunteerForm' | 'mainScreen';
  title?: string;
  avatarUrl?: string;
}

const NavigationBar: React.FC<INavigationBarProps> = ({
  variant,
  title = '',
  avatarUrl = '',
}) => {
  // Моковый текущий пользователь
  const currentUser = {
    id: 1,
    name: 'Марагарита',
    avatarUrl: avatarUrl || '',
    role: 'curator',
  };

  // Состояние для отображения профиля
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Обработчик клика по аватарке
  const handleAvatarClick = () => {
    if (currentUser.id === 1) {
      // Проверка на соответствие текущему пользователю (моковый ID)
      setIsProfileOpen(true);
    }
  };

  // Функция для закрытия профиля
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
      {/* Основная навигация */}
      <div className="relative w-[360px] p-4 bg-light-gray-white dark:bg-dark-gray-white rounded-[16px] flex items-center justify-between">
        {/* Левая часть с иконкой или логотипом */}
        <div className="flex items-center space-x-2">
          {variant === 'volunteerForm' ? (
            <>
              <ChevronLeftIcon className="w-6 h-6 text-black dark:text-white" />
              <h1 className="text-lg font-gerbera-h2 text-light-gray-8-text dark:text-dark-gray-8-text">
                {title}
              </h1>
            </>
          ) : (
            <>
              <img src={logoText} alt="Logo" className="w-[130px] h-10" />
            </>
          )}
        </div>

        {/* Правая часть с аватаркой и иконкой */}
        {variant === 'mainScreen' && (
          <div className="flex items-center space-x-4">
            <img src={bell} className="w-10 h-10 text-black dark:text-white" />
            <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-dark-gray-1 rounded-full">
              <Avatar.Image
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                onClick={handleAvatarClick} // Открытие профиля по клику
              />
              <Avatar.Fallback
                className="text-black dark:text-white"
                onClick={handleAvatarClick}
              >
                {avatarUrl ? avatarUrl[0] : 'avatar'}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
        )}
      </div>

      {/* Условный рендеринг компонента ProfileUser */}
      {isProfileOpen && (
        <ProfileUser
          user={currentUser} // Передаем данные текущего пользователя в профиль
          onClose={handleCloseProfile} // Функция для закрытия профиля
          currentUserId={1}
        />
      )}
    </>
  );
};

export default NavigationBar;
