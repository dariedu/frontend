import React, { useState, useContext } from 'react';
import { UserContext } from '../../core/UserContext';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import LogoText from './../../assets/logoText.svg?react';
import ProfileUser from '../ProfileUser/ProfileUser';

interface INavigationBarProps {
  variant: 'volunteerForm' | 'mainScreen';
  title?: string;
  isVolunteer: boolean
}

const NavigationBar: React.FC<INavigationBarProps> = ({
  variant,
  title = '',
  isVolunteer
}) => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (isLoading) return <div>Загрузка...</div>;

  if (!currentUser) return <div>Пользователь не найден</div>;

  // Обработчик клика по аватарке
  const handleAvatarClick = () => {
    setIsProfileOpen(true);
  };

  // Функция для закрытия профиля
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
      <div className="relative w-full max-w-[400px] p-4 bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl flex items-center justify-between overflow-x-hidden">
        <div className="flex items-center space-x-2">
          {variant === 'volunteerForm' ? (
            <>
              <ChevronLeftIcon className="w-6 h-6 text-black dark:text-light-gray-white " />
              <h1 className="text-lg font-gerbera-h2 text-light-gray-8-text dark:text-light-gray-1">
                {title}
              </h1>
            </>
          ) : (
              <>
                <LogoText className="w-[130px] h-10 fill-[#1F1F1F]  dark:fill-[#F8F8F8] "/>
            </>
          )}
        </div>

        {variant === 'mainScreen' && currentUser && (
          <div className="flex items-center space-x-4">
            <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 bg-light-gray-1 dark:bg-dark-gray-1 rounded-full" onClick={handleAvatarClick}>
              <Avatar.Image
                src={currentUser.photo || ''}
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

      {isProfileOpen && (
        <ProfileUser
          onClose={handleCloseProfile}
          currentUserId={currentUser.id}
          IsVolunteer={isVolunteer}
        />
      )}
    </>
  );
};

export default NavigationBar;
