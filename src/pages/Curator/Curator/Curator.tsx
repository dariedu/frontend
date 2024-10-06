import React, { useState } from 'react';
import Search from '../../../components/Search/Search';
// import ProfileOfVolunteer from '../../../components/ProfileOfVolunteer/ProfileOfVolunteer'; // Импорт компонента профиля волонтера
import avatar1 from '../../../assets/avatar.svg';

// Массив кураторов-заглушка
const curators = [
  { name: 'Осипова Юлия', avatar: avatar1 },
  { name: 'Иванов Иван', avatar: avatar1 },
  { name: 'Сидоров Алексей', avatar: avatar1 },
  { name: 'Смирнова Анна', avatar: avatar1 },
  { name: 'Петров Петр', avatar: avatar1 },
  { name: 'Александрова Мария', avatar: avatar1 },
];

const Curator: React.FC = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<{
    name: string;
    avatar: string;
  } | null>(null);

  // Обработчик нажатия на волонтера
  const handleVolunteerClick = (volunteer: {
    name: string;
    avatar: string;
  }) => {
    setSelectedVolunteer(volunteer);
  };

  // Обработчик закрытия профиля волонтера
  const closeProfile = () => {
    setSelectedVolunteer(null);
  };

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      {/* Передаем массив кураторов и функцию нажатия в Search */}
      <Search
        curators={curators}
        showSearchInput={true}
        showInfoSection={false}
        onVolunteerClick={handleVolunteerClick}
      />

      {/* Условное отображение компонента ProfileOfVolunteer */}
      {/* {selectedVolunteer && (
        <ProfileOfVolunteer
          name={selectedVolunteer.name}
          avatar={selectedVolunteer.avatar}
          onClose={closeProfile}
        />
      )} */}
    </div>
  );
};

export default Curator;
