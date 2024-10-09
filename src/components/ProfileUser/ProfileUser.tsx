import React from 'react';
import leftArrowIcon from '../../../src/assets/icons/arrow_left.png';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunreerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';

interface IProfileUserProps {
  user: ICurator;
  onClose: () => void;
  currentUserId: number;
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  user,
  onClose,
  currentUserId,
}) => {
  // Проверка на то, является ли выбранный волонтер текущим пользователем
  const isCurrentUser = user.id === currentUserId;
  const profileTitle = isCurrentUser ? 'Мой профиль' : 'Профиль волонтёра';

  return (
    <>
      {/* Окно профиля волонтера */}
      <div className="fixed z-50 top-0 left-0 bg-white rounded-[16px] shadow-lg w-[360px] max-h-[100vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center mb-[4px] bg-white rounded-t-[16px] w-full h-[60px] p-[16px] flex-shrink-0">
          <button onClick={onClose} className="mr-2">
            <img src={leftArrowIcon} alt="back" className="w-9 h-9 mr-[8px]" />
          </button>
          <h2 className="font-gerbera-h2 text-light-gray-black">
            {profileTitle}
          </h2>
        </div>
        {/* Содержимое с прокруткой */}
        <div className="w-full flex-grow overflow-y-auto hide-scrollbar">
          <ProfilePic user={user} />
          <VolunteerData user={user} />
          {/* Логика отображения действий в зависимости от того, является ли пользователь текущим */}
          {isCurrentUser && (
            <ActionsVolunteer
              visibleActions={[
                'История',
                'Обо мне',
                'Пригласить друга',
                'Подать заявку на должность куратора',
                'Знаю того, кому нужна помощь',
                'Сделать пожертвование',
                'Вопросы и предложения',
              ]}
              showThemeToggle={true}
            />
          )}
        </div>
      </div>

      {/* Стили для скрытия полосы прокрутки */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE и Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default ProfileUser;
