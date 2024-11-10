import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getHourCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import { IUser } from '../../core/types';
import UserAvatar from '../../assets/icons/photo.svg?react';

interface IProfilePicProps {
  user: IUser;
}

const ProfilePic: React.FC<IProfilePicProps> = ({ user }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileLink(URL.createObjectURL(file));
      setFileUploaded(true);
    }
  }

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

  return (
    <div className="flex flex-col items-center justify-between p-[32px] h-[275px] bg-light-gray-white rounded-2xl w-full dark:bg-light-gray-7-logo">
      <div className="h-[105px] w-[105px] bg-light-gray-2 dark:bg-light-gray-5 rounded-full flex justify-center items-center relative">
        {fileUploaded ? (
        <img
        src={userAvatarSrc}
        className="h-[105px] w-[105px] rounded-full object-cover"
        alt={`${userName} ${userLastName}`}
      />
        ): (
          <UserAvatar className="h-[75px] w-[75px] rounded-full object-cover fill-light-gray-white dark:fill-light-gray-3"/>
      )}
        {!fileUploaded && (
          <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="absolute opacity-0 h-full w-full rounded-full cursor-pointer"
          />
        )}
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
  );
};

export default ProfilePic;
