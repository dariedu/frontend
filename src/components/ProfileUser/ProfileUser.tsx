import React from 'react';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunteerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';
import { IUser } from '../../core/types';

interface IProfileUserProps {
  user: IUser;
  onClose: () => void;
  currentUserId: number;
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  user,
  onClose,
  currentUserId,
}) => {
  const isCurrentUser = user.id === currentUserId;
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
          <ProfilePic user={user} />
          <VolunteerData
            geo="Адрес пользователя"
            email="example@example.com"
            birthday="01.01.1990"
            phone="+79999999999"
            telegram="@user"
          />
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

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default ProfileUser;
