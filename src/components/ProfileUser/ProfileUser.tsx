import React, { useContext } from 'react';
import { UserContext } from '../../core/UserContext';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunteerData';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import historyIcon from '../../assets/icons/history.svg';
import aboutIcon from '../../assets/icons/about.svg';
import inviteIcon from '../../assets/icons/invite_friend.svg';

interface IProfileUserProps {
  userId: number;
  onClose: () => void;
  currentUserId: number;
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  onClose,
  currentUserId,
}) => {
  const { currentUser, isLoading } = useContext(UserContext);

  if (isLoading) {
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
                : 'Город не указан'
            }
            email={currentUser.email || 'Эл. почта не указана'}
            birthday={
              currentUser.birthday
                ? new Date(currentUser.birthday).toLocaleDateString()
                : 'Дата рождения не указана'
            }
            phone={currentUser.phone || 'Телефон не указан'}
            telegram={currentUser.tg_username || 'Telegram не указан'}
          />

          {/* Переключатель темы */}
          <div className="space-y-[4px] bg-light-gray-1 rounded-[16px] w-[360px]">
            <div className="relative bg-light-gray-1 rounded-[16px]">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-light-gray-1 rounded-t-[16px]"></div>
              <div className="flex items-center justify-between p-4 bg-light-gray-white shadow h-[66px] rounded-[16px]">
                <ThemeToggle />
              </div>
            </div>

            {/* Блоки "История", "Обо мне" и "Пригласить друга" */}
            <a
              href="#"
              className="flex items-center justify-between p-4 bg-light-gray-white rounded-[16px] shadow hover:bg-gray-50 h-[66px]"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={historyIcon}
                  alt="История"
                  className="w-[42px] h-[42px]"
                />
                <span className="font-gerbera-h3 text-light-gray-black m-0">
                  История
                </span>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center justify-between p-4 bg-light-gray-white rounded-[16px] shadow hover:bg-gray-50 h-[66px]"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={aboutIcon}
                  alt="Обо мне"
                  className="w-[42px] h-[42px]"
                />
                <span className="font-gerbera-h3 text-light-gray-black m-0">
                  Обо мне
                </span>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center justify-between p-4 bg-light-gray-white rounded-[16px] shadow hover:bg-gray-50 h-[66px]"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={inviteIcon}
                  alt="Пригласить друга"
                  className="w-[42px] h-[42px]"
                />
                <span className="font-gerbera-h3 text-light-gray-black m-0">
                  Пригласить друга
                </span>
                <span className="font-gerbera-sub2 text-light-brand-green w-[129px]">
                  +3 балла
                </span>
              </div>
            </a>
          </div>
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
