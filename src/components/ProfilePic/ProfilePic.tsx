import React, { useState } from 'react';
import {
  getBallCorrectEndingName,
  getHourCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import { IUser } from '../../core/types';

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

  return (
    <div className="flex flex-col items-center justify-between p-[32px] h-[275px] bg-light-gray-white rounded-2xl w-full border-2">
      <div className="h-[105px] w-[105px] bg-light-gray-1 rounded-full flex justify-center items-center relative">
        <img
          src={
            fileUploaded
              ? uploadedFileLink
              : user.avatar || './../src/assets/icons/photo.svg'
          }
          className="h-[105px] w-[105px] rounded-full object-cover"
          alt={`${user.name} ${user.last_name}`}
        />
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
        <p className="font-gerbera-h3 text-light-gray-black ">
          {user.name} {user.last_name}
        </p>
        <p className="font-gerbera-sub1 text-light-gray-4">
          {user.rating?.level ?? 'Нет уровня'}
        </p>
      </div>

      <div className="w-[220px] h-[28px] flex justify-between items-center">
        <p className="w-[96px] h-[28px] bg-light-brand-green font-gerbera-sub2 text-light-gray-white rounded-2xl flex justify-center items-center">
          {user.point ?? 0} {getBallCorrectEndingName(user.point ?? 0)}
        </p>
        <p className="w-[96px] h-[28px] bg-light-gray-1 font-gerbera-sub2 text-light-gray-8-text rounded-2xl flex justify-center items-center">
          {user.volunteer_hour ?? 0}{' '}
          {getHourCorrectEndingName(user.volunteer_hour ?? 0)}
        </p>
      </div>
    </div>
  );
};

export default ProfilePic;
