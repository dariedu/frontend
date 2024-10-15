import React, { useState, useEffect } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { IUser, getUsers } from '../../../api/userApi';

const Curator: React.FC = () => {
  const currentUserId = 1; // Пример ID текущего пользователя
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получение данных пользователей из API при загрузке компонента
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить данные пользователей');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          userId={selectedUser.id}
          currentUserId={currentUserId}
          onClose={closeProfile}
        />
      )}
    </div>
  );
};

export default Curator;
