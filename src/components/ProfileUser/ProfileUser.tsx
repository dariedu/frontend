import React, { useContext, useState } from 'react';
import { UserContext } from '../../core/UserContext';
import ProfilePic from '../ProfilePic/ProfilePic';
import { VolunteerData } from '../VolunteerData/VolunteerData';
import ActionsVolunteer from '../ActionsVolunteer/ActionsVolunteer';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import { Modal} from '../ui/Modal/Modal';


interface IProfileUserProps {
  onClose: () => void
  currentUserId: number
  IsVolunteer: boolean
}

const ProfileUser: React.FC<IProfileUserProps> = ({
  onClose,
  currentUserId,
  IsVolunteer
}) => {
  const { currentUser, isLoading } = useContext(UserContext);


  if (isLoading) return <div className='loader'></div>;
  if (!currentUser) return <div>Пользователь не найден</div>;
  
  const [uploadingPic, setUploadingPic] = useState<boolean>(false);
  
  const isCurrentUser = currentUser?.id === currentUserId;
  const profileTitle = isCurrentUser ? 'Мой профиль' : 'Профиль пользователя';

  return (currentUser && (
    <div className="fixed pb-10 z-50 top-0 bg-light-gray-1  dark:bg-light-gray-black rounded-b-2xl shadow-lg w-full max-w-[500px] max-h-screen flex flex-col overflow-x-hidden">
    <div className="flex items-center mb-[4px] bg-white dark:bg-light-gray-7-logo dark:text-light-gray-1 rounded-b-2xl w-full h-[60px] p-[16px]">
      <button onClick={onClose} className="mr-2">
        <RightArrowIcon className='rotate-180 w-9 h-9 mr-[8px] stroke-[#D7D7D7] dark:stroke-[#575757] ' />
      </button>
      <h2>{profileTitle}</h2>
    </div>
    <div className="w-full flex-grow overflow-y-auto ">
      <ProfilePic user={currentUser} setUploadingPic={setUploadingPic} />
      <VolunteerData
        geo={currentUser.city ? `${currentUser.city.city}` : 'Город не указан'}
        geoIndex={currentUser.city? currentUser.city.id as number: 0}
        email={currentUser.email || 'Эл. почта не указана'}
        birthday={
         currentUser.birthday
            ? new Date(currentUser.birthday).toLocaleDateString()
            : 'Дата рождения не указана'
        }
        phone={currentUser.phone || 'Телефон не указан'}
        telegram={currentUser.tg_username || 'Telegram не указан'}
      />
      {IsVolunteer ? (
      isCurrentUser && (
        <ActionsVolunteer
          visibleActions={['История', 'Обо мне', 'Подать заявку на должность куратора', 'Вопросы и предложения','Техническая поддержка']}
            showThemeToggle={true}
            isVolunteer={IsVolunteer}
        />
      )
      ) : (
        isCurrentUser && (
          <ActionsVolunteer
            visibleActions={['История', 'Обо мне', 'Вопросы и предложения', 'Техническая поддержка']}
              showThemeToggle={true}
              isVolunteer={IsVolunteer}
          />
        )
      )}
    </div>
      <Modal zIndex={true} onOpenChange={()=>{}} isOpen={uploadingPic}><div className='h-full flex flex-col items-center justify-center'><div className='loader'></div></div></Modal>
    </div>  
    
  )
       
  );
};

export default ProfileUser;
