import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import leftArrowIcon from '../../assets/icons/arrow_left.png';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../ui/VolunteerData/VolunteerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';
import { IUser, getUserById } from '../../api/userApi';

interface IProfileUserProps {
  userId: number; // Передаем только ID пользователя, а данные будем загружать
  onClose: () => void;
  currentUserId: number;
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  userId,
  onClose,
  currentUserId,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation(); // Получаем объект location
  const query = new URLSearchParams(location.search); // Извлекаем query параметры

  // const tgId = query.get('tg_id'); // Получаем tg_id из query
  const tgUsername = query.get('tg_nickname'); // Получаем tg_username из query
  const phone = query.get('phone_number'); // Получаем phone из query

  // Загружаем данные о пользователе с бэкенда
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

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
          {/* Передаем проверенные данные в компонент ProfilePic */}
          <ProfilePic
            user={{
              ...user,
              name: user.name ?? 'Неизвестный',
              is_adult: true,
              point: user.point ?? 0,
              rating:
                typeof user.rating === 'number'
                  ? { id: 0, level: `Уровень ${user.rating}`, hours_needed: 0 }
                  : (user.rating ?? {
                      id: 0,
                      level: 'Нет уровня',
                      hours_needed: 0,
                    }),
            }}
          />

          <VolunteerData
            geo={user.city ? `Город: ${user.city}` : 'Адрес не указан'}
            email={user.email || 'Эл. почта не указана'}
            birthday="01.01.1990" // Заменить на реальную дату рождения, если доступна
            phone={phone || 'Телефон не указан'} // Используем номер из query параметров
            telegram={`@${tgUsername}`} // Используем никнейм из query параметров
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
