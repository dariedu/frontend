import React, { useContext, useState } from 'react';
import {
  getBallCorrectEndingName,
  getHourCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import { IUser } from '../../core/types';
import UserAvatar from '../../assets/icons/photo.svg?react';
import Big_pencil from '../../assets/icons/big_pencil.svg?react'
import * as Avatar from '@radix-ui/react-avatar';
import { UploadPicture } from '../UploadPicture/UploadPicture';
import { Modal } from '../ui/Modal/Modal';
import { TokenContext } from '../../core/TokenContext';
import { UserContext } from '../../core/UserContext';
import { patchUserPicture } from '../../api/userApi';


interface IProfilePicProps {
  user: IUser;
}


const ProfilePic: React.FC<IProfilePicProps> = ({ user }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState<string>();
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false)

  // Обработка значений по умолчанию
  const userName = user.name ?? 'Неизвестный';
  const userLastName = user.last_name ?? '';
  const userAvatarSrc = uploadedFileLink;
  const userRating =
    typeof user.rating === 'object' && user.rating !== null
      ? (user.rating.level ?? 'Нет уровня')
      : `Уровень ${user.rating ?? 'Нет уровня'}`;
  const userPoints = user.point ?? 0;
  const userVolunteerHours = user.volunteer_hour ?? 0;

 const {token} = useContext(TokenContext)
  const { currentUser } = useContext(UserContext);


  async function updateUserAvatar() {
    if (token && currentUser?.id && uploadedFileLink) {
      let fileToSend = await fetch(uploadedFileLink)
      .then(res => res.blob())
      .then(blob => {
        return blob
      }); 
      const formData = new FormData(); // создаем объект FormData для передачи файла
      formData.set('photo', fileToSend, `selfie-${user.tg_id}.jpeg`);
        try {
        let result = await patchUserPicture(currentUser.id, formData, token)
          console.log(" updateUserAvatar() success", result)
        } catch (err) {
        console.log(err, "updateUserAvatar() error")
    }
  }
}



  return (
    <>
       <div className="flex flex-col items-center justify-between p-[32px] h-[275px] bg-light-gray-white rounded-2xl w-full max-w-[400px] dark:bg-light-gray-7-logo">
      <div className="h-[105px] w-[105px] bg-light-gray-2 dark:bg-light-gray-5 rounded-full flex justify-center items-center relative">
        <Avatar.Root>{
          fileUploaded && userAvatarSrc!==undefined ? (
            <Avatar.Image src={userAvatarSrc}  className='h-[105px] w-[105px] min-h-[105px] min-w-[105px] rounded-full object-cover' />
          ): user.photo && (
            <Avatar.Image src={user.photo} decoding='async'  loading='lazy' className='h-[105px] w-[105px] min-h-[105px] min-w-[105px] rounded-full object-cover' />
        )}
          <Avatar.Fallback delayMs={1000}>
          <UserAvatar className="h-[75px] w-[75px] rounded-full object-cover fill-light-gray-white dark:fill-light-gray-3"/>
          </Avatar.Fallback>
        </Avatar.Root>
          <Big_pencil className="ml-20 mt-20 absolute w-[32px] h-[32px] min-h-[32px] min-w-[32px]  fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6" onClick={() => setUploadFileModalOpen(true)} />
      </div>
      <div>
        <p className="font-gerbera-h3 text-light-gray-black dark:text-light-gray-1">
          {userName} {userLastName}
        </p>
        <p className="font-gerbera-sub1 text-light-gray-4 mt-1">{userRating}</p>
      </div>

      <div className="w-[220px] h-[28px] flex justify-between items-center">
        <p className="w-[96px] h-[28px] bg-light-brand-green font-gerbera-sub2 text-light-gray-white rounded-2xl flex justify-center items-center">
          {userPoints} {getBallCorrectEndingName(userPoints)}
        </p>
        <p className="w-[96px] h-[28px] bg-light-gray-1 dark:bg-light-gray-6 dark:text-light-gray-1 font-gerbera-sub2 text-light-gray-8-text rounded-2xl flex justify-center items-center">
          {userVolunteerHours} {getHourCorrectEndingName(userVolunteerHours)}
        </p>
      </div>
      </div>
      <Modal isOpen={uploadFileModalOpen} onOpenChange={setUploadFileModalOpen} zIndex={true}>
        <UploadPicture
          text={"Загрузите Ваше новое фото"}
          onOpenChange={setUploadFileModalOpen}
          uploadedFileLink={uploadedFileLink}
          setUploadedFileLink={setUploadedFileLink}
          fileUploaded={fileUploaded}
          setFileUploaded={setFileUploaded}
          updateUserAvatar={updateUserAvatar}
        />
      </Modal>
   </>
   
  );
};

export default ProfilePic;
