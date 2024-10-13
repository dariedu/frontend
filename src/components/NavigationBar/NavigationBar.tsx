import React, { useState, useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import logoText from '../../assets/logoText.svg';
import bell from '../../assets/icons/Notifications.svg';
import ProfileUser from '../ProfileUser/ProfileUser';
import { IUser, getUserById } from '../../api/userApi'; // Подключаем функцию для получения пользователя

interface INavigationBarProps {
  variant: 'volunteerForm' | 'mainScreen';
  title?: string;
  tgId: number; // Передаем tgId как пропс
}

const tgId = 205758925; // Передаем ID
const currentUser = 205758925; // Передаем ID

const NavigationBar: React.FC<INavigationBarProps> = ({
  variant,
  title = '',
  tgId,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем данные пользователя по tgId
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await getUserById(tgId); // Используем tgId для загрузки пользователя
        setCurrentUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user:', error);
        setLoading(false);
      }
    };

    loadUser();
  }, [tgId]);

  // Обработчик клика по аватарке
  const handleAvatarClick = () => {
    setIsProfileOpen(true);
  };

  // Функция для закрытия профиля
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  if (loading) return <div>Загрузка...</div>;

  if (!currentUser) return <div>Пользователь не найден</div>;

  return (
    <>
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
        {variant === 'mainScreen' && currentUser && (
          <div className="flex items-center space-x-4">
            <img
              src={bell}
              className="w-10 h-10 text-black dark:text-white"
              alt="Notifications"
            />
            <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-dark-gray-1 rounded-full">
              <Avatar.Image
                src={currentUser.avatar || ''}
                alt="Avatar"
                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                onClick={handleAvatarClick}
              />
              <Avatar.Fallback
                className="text-black dark:text-white"
                onClick={handleAvatarClick}
              >
                {currentUser.name ? currentUser.name[0] : 'A'}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
        )}
      </div>

      {/* Условный рендеринг компонента ProfileUser */}
      {isProfileOpen && (
        <ProfileUser
          user={currentUser} // Передаем текущего пользователя в компонент профиля
          onClose={handleCloseProfile}
          currentUserId={currentUser.id}
        />
      )}
    </>
  );
};

export default NavigationBar;
