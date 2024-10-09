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
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-lg w-[360px]">
        <div className="flex items-center mb-[4px] bg-white rounded-[16px] w-full h-[60px] p-[16px]">
          <button onClick={onClose} className="mr-2">
            <img src={leftArrowIcon} alt="back" className="w-9 h-9 mr-[8px]" />
          </button>
          <h2 className="font-gerbera-h2 text-light-gray-black">
            {profileTitle}
          </h2>
        </div>
        <div className="w-full">
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
    </>
  );
};

export default ProfileUser;
