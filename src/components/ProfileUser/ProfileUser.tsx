import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../core/UserContext';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunteerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import { IUser } from '../../core/types';
import { getUserById } from '../../api/userApi';
import { TokenContext } from '../../core/TokenContext';

interface IProfileUserProps {
  onClose: () => void
  currentUserId: number
  IsVolunteer: boolean
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  onClose,
  currentUserId,
  IsVolunteer
}) => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [user, setUser] = useState<IUser | null>(null);
   ///// используем контекст токена
   const tokenContext = useContext(TokenContext);
   const token = tokenContext.token;
  ////// используем контекст

  useEffect(() => {
    const fetchUser = async () => {
      if (token){
        if (currentUser?.id === currentUserId) {
          setUser(currentUser);
        } else {
          try {
            const fetchedUser = await getUserById(currentUserId, token);
            setUser(fetchedUser);
          } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
            setUser(null);
          }
        }
      }
    };

    fetchUser();
  }, [currentUser, currentUserId]);

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <div>Пользователь не найден</div>;

  const isCurrentUser = currentUser?.id === currentUserId;
  const profileTitle = isCurrentUser ? 'Мой профиль' : 'Профиль пользователя';

  return (
      <div className="fixed z-50 top-0 bg-light-gray-1  dark:bg-light-gray-black rounded-[16px] shadow-lg w-[360px] max-h-[100vh] flex flex-col overflow-x-hidden">
      <div className="flex items-center mb-[4px] bg-white dark:bg-light-gray-7-logo dark:text-light-gray-1 rounded-b-2xl w-full h-[60px] p-[16px]">
        <button onClick={onClose} className="mr-2">
          <RightArrowIcon className='rotate-180 w-9 h-9 mr-[8px] stroke-[#D7D7D7] dark:stroke-[#575757] ' />
        </button>
        <h2>{profileTitle}</h2>
      </div>
      <div className="w-full flex-grow overflow-y-auto ">
        <ProfilePic user={user} />
        <VolunteerData
          geo={user.city ? `Город: ${user.city.city}` : 'Город не указан'}
          email={user.email || 'Эл. почта не указана'}
          birthday={
            user.birthday
              ? new Date(user.birthday).toLocaleDateString()
              : 'Дата рождения не указана'
          }
          phone={user.phone || 'Телефон не указан'}
          telegram={user.tg_username || 'Telegram не указан'}
        />
        {IsVolunteer ? (
        isCurrentUser && (
          <ActionsVolunteer
            visibleActions={['История', 'Обо мне', 'Подать заявку на должность куратора', 'Вопросы и предложения']}
              showThemeToggle={true}
              isVolunteer={IsVolunteer}
          />
        )
        ) : (
          isCurrentUser && (
            <ActionsVolunteer
              visibleActions={['История', 'Обо мне', 'Вопросы и предложения']}
                showThemeToggle={true}
                isVolunteer={IsVolunteer}
            />
          )
        )}
      </div>
    </div>    
  );
};

export default ProfileUser;
