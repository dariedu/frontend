import React, { useContext } from 'react';
import { UserContext } from '../../core/UserContext';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunteerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';
import leftArrowIcon from '../../assets/icons/arrow_left.png';

interface IProfileUserProps {
  userId: number;
  onClose: () => void;
  currentUserId: number;
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  onClose,
  currentUserId,
}) => {
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  const isCurrentUser = currentUser.id === currentUserId;
  const profileTitle = isCurrentUser ? 'Мой профиль' : 'Профиль пользователя';

  return (
    <>
      <div className="fixed z-50 top-0 bg-white rounded-[16px] shadow-lg w-[360px] max-h-[100vh] flex flex-col">
        <div className="flex items-center mb-[4px] bg-white rounded-t-[16px] w-full h-[60px] p-[16px] flex-shrink-0">
          <button onClick={onClose} className="mr-2">
            <img src={leftArrowIcon} alt="back" className="w-9 h-9 mr-[8px]" />
          </button>
          <h2 className="font-gerbera-h2 text-light-gray-black">
            {profileTitle}
          </h2>
        </div>
        <div className="w-full flex-grow overflow-y-auto hide-scrollbar">
          <ProfilePic user={currentUser} />
          <VolunteerData
            geo={
              currentUser.city
                ? `Город: ${currentUser.city}`
                : 'Адрес не указан'
            }
            email={currentUser.email || 'Эл. почта не указана'}
            birthday="01.01.1990"
            phone={currentUser.phone || 'Телефон не указан'}
            telegram={currentUser.tg_username || 'Telegram не указан'}
          />
          {isCurrentUser && (
            <ActionsVolunteer
              visibleActions={['История', 'Обо мне', 'Пригласить друга']}
              showThemeToggle={true}
            />
          )}
        </div>
      </div>

      <style>{`
        /* Скрываем вертикальную полосу прокрутки */
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE и Edge */
        }

        /* Для WebKit-браузеров (Chrome, Safari) */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default ProfileUser;
