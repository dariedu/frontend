import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../core/UserContext';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import LogoText from './../../assets/logoText.svg?react';
import ProfileUser from '../ProfileUser/ProfileUser';
import Notifications from '../../assets/icons/notifications_1.svg?react';
import { getMyDeliveries, getAllMyTasks } from './helperFunctions';
import { IDelivery } from '../../api/apiDeliveries';
import { ITask } from '../../api/apiTasks';
import { TokenContext } from '../../core/TokenContext';

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
  const [haveNotifications, setHaveNotifications] = useState(false);

  const [myCurrent, setMyCurrent] = useState<IDelivery[]>([]) ////доставки записанные на меня
  const [allMyTasks, setAllMyTasks] = useState<ITask[]>([])

    ///// используем контекст токена
  const { token } = useContext(TokenContext);
  
  ////запрашиваем таски и доставки
  useEffect(() => {
    if (token) {
    getMyDeliveries(token, setMyCurrent)
    getAllMyTasks(token, setAllMyTasks) 
    }
  }, [])

    ////если есть таски или доставки требующие подтверждения то ставим статус haveNotifications в true
  useEffect(() => {
    if (myCurrent.length > 0 || allMyTasks.length > 0) {
      setHaveNotifications(true)
    }
  },[myCurrent, allMyTasks])

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
      <div className="relative w-full max-w-[500px] p-4 bg-light-gray-white dark:bg-light-gray-7-logo rounded-b-2xl flex items-center justify-between overflow-x-hidden">
        <div className="flex items-center space-x-2">
          {variant === 'volunteerForm' ? (
            <>
              <ChevronLeftIcon className="w-6 h-6 min-w-6 min-h-6 text-black dark:text-light-gray-white " />
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
          <div className='w-[84px] flex items-center justify-between'>
           <div className='rounded-full bg-light-gray-1 dark:bg-light-gray-6 w-8 min-w-8 h-8 min-h-8 flex items-center justify-center relative '>
              <Notifications className='fill-light-gray-7-logo dark:fill-light-gray-1' />
              {haveNotifications && <div className='bg-light-brand-green w-2 h-2 min-w-2 min-h-2 rounded-full top-[23px] left-[23px] absolute'></div>}
           </div>
          <div className="flex items-center space-x-4">
            <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 min-w-10 min-h-10 bg-light-gray-1 dark:bg-light-gray-5 rounded-full" onClick={handleAvatarClick}>
              <Avatar.Image
                src={currentUser.photo || ''}
                alt="Avatar"
                className="w-10 h-10 min-w-10 min-h-10 object-cover rounded-full cursor-pointer"
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
