import React, { useState, useContext } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { UserContext } from '../../../core/UserContext';
import { IUser } from '../../../core/types';

const Curator: React.FC = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  const handleUserClick = (user: IUser) => {
    setSelectedUserId(user.id); // Передаем ID выбранного пользователя
  };

  const closeProfile = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
      <Search
        users={[currentUser]}
        onUserClick={handleUserClick}
        showSearchInput={true}
        showInfoSection={false}
      />

      {selectedUserId && (
        <ProfileUser currentUserId={selectedUserId} onClose={closeProfile} />
      )}
    </div>
  );
};

export default Curator;
