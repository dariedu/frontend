import React, { useState, useContext } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { UserContext } from '../../../core/UserContext';
import { IUser } from '../../../core/types';

const Curator: React.FC = () => {
  const { currentUser, loading } = useContext(UserContext);
  const currentUserId = currentUser?.id || 1;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      <Search
        users={[currentUser]}
        onUserClick={handleUserClick}
        showSearchInput={true}
        showInfoSection={false}
      />

      {selectedUser && (
        <ProfileUser
          userId={selectedUser.id}
          currentUserId={currentUserId}
          onClose={closeProfile}
        />
      )}
    </div>
  );
};

export default Curator;
