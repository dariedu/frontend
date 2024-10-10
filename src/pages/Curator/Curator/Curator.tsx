import React, { useState } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import avatar1 from '../../../assets/avatar.svg';
import { IUser } from '../../../core/types';

const users: IUser[] = [
  { id: 1, name: 'Осипова Юлия', avatar: avatar1 },
  { id: 2, name: 'Иванов Иван', avatar: avatar1 },
  { id: 3, name: 'Сидоров Алексей', avatar: avatar1 },
  { id: 4, name: 'Смирнова Анна', avatar: avatar1 },
  { id: 5, name: 'Петров Петр', avatar: avatar1 },
  { id: 6, name: 'Александрова Мария', avatar: avatar1 },
];

const Curator: React.FC = () => {
  const currentUserId = 1;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex-col min-h-[746px] bg-light-gray-1">
      <Search
        users={users}
        onUserClick={handleUserClick}
        showSearchInput={true}
        showInfoSection={true}
      />

      {selectedUser && (
        <ProfileUser
          user={selectedUser}
          currentUserId={currentUserId}
          onClose={closeProfile}
        />
      )}
    </div>
  );
};

export default Curator;
