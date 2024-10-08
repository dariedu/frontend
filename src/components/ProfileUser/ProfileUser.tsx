import React from 'react';
import leftArrowIcon from '../../../src/assets/icons/arrow_left.png';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunreerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';

interface IProfileUser {
  onClose: () => void;
}

const user1: IUser = {
  name: 'Марагарита',
  last_name: 'Гончарова',
  rating: {
    id: 4,
    level: 'Новичок',
    hours_neded: 15,
  },
  point: 5,
  volunteer_hour: 21,
};

export const ProfileUser: React.FC = ({ onClose }) => {
  return (
    <>
      <div className="flex items-center mb-[4px] bg-white rounded-[16px] w-[360px] h-[60px] p-[16px]">
        <button onClick={onClose} className="mr-2">
          <img src={leftArrowIcon} alt="back" className="w-9 h-9 mr-[8px]" />
        </button>
        <h2 className="font-gerbera-h2 text-light-gray-black">
          Профиль волонтёра
        </h2>
      </div>
      <div className="w-[360px]">
        <ProfilePic user={user1} />
        <VolunteerData user={user1} />
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
      </div>
    </>
  );
};
