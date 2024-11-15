import React, { useState, useContext } from 'react';
import Search from '../../../components/Search/Search';
import ProfileUser from '../../../components/ProfileUser/ProfileUser';
import { UserContext } from '../../../core/UserContext';
import { IUser } from '../../../core/types';
import { Modal } from '../../../components/ui/Modal/Modal';

const Curator: React.FC = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  const handleUserClick = (user: IUser) => {
    setSelectedUserId(user.id); // Передаем ID выбранного пользователя
    setProfileModalOpen(true); // Открыть модальное окно
  };

  const closeProfile = () => {
    setSelectedUserId(null);
    setProfileModalOpen(false); // Закрыть модальное окно
  };

  return (
    <div className="flex-col min-h-[80vh] bg-light-gray-1">
      <Search
        users={[currentUser]}
        onUserClick={handleUserClick}
        showSearchInput={true}
        showInfoSection={false}
      />

      <Modal isOpen={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
        {selectedUserId && (
          <ProfileUser
            currentUserId={selectedUserId}
            onClose={closeProfile}
            IsVolunteer={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default Curator;
