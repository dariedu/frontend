import React, { useState } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser'; // Импорт компонента профиля волонтера
import avatar1 from '../../../assets/avatar.svg';

// Массив кураторов
const curators = [
  { id: 1, name: 'Осипова Юлия', avatar: avatar1 },
  { id: 2, name: 'Иванов Иван', avatar: avatar1 },
  { id: 3, name: 'Сидоров Алексей', avatar: avatar1 },
  { id: 4, name: 'Смирнова Анна', avatar: avatar1 },
  { id: 5, name: 'Петров Петр', avatar: avatar1 },
  { id: 6, name: 'Александрова Мария', avatar: avatar1 },
];

const Curator: React.FC = () => {
  const currentUserId = 1; // ID текущего пользователя
  const [selectedVolunteer, setSelectedVolunteer] = useState<ICurator | null>(
    null,
  );

  // Обработчик нажатия на волонтера
  const handleVolunteerClick = (volunteer: ICurator) => {
    setSelectedVolunteer(volunteer); // Устанавливаем выбранного волонтера
  };

  // Обработчик закрытия профиля волонтера
  const closeProfile = () => {
    setSelectedVolunteer(null); // Закрываем окно профиля
  };

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      {/* Передаем массив кураторов и функцию нажатия в Search */}
      <Search
        curators={curators}
        onVolunteerClick={handleVolunteerClick}
        showSearchInput={true}
        showInfoSection={true}
      />

      {/* Условное отображение компонента ProfileUser */}
      {selectedVolunteer && (
        <ProfileUser
          user={selectedVolunteer} // Передаем данные выбранного волонтера
          currentUserId={currentUserId} // Передаем ID текущего пользователя
          onClose={closeProfile} // Функция закрытия окна профиля
        />
      )}
    </div>
  );
};

export default Curator;
