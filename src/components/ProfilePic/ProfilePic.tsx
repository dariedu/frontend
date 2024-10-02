import React, { useState } from 'react';
import { getBallCorrectEndingName, getHourCorrectEndingName } from '../DetailedInfo/DetailedInfo.tsx';


interface IUser {
  name: string
  last_name: string
  rating: {
  id: number
  level: string
  hours_neded: number
  }
  point: number
  volunteer_hour: number
}

interface IProfilePicProps{
  user: IUser 
}

const user1: IUser = {
  name: "Марагарита",
  last_name: "Гончарова",
  rating: {
  id: 4,
  level: "Новичок",
  hours_neded: 15,
  },
  point: 5,
  volunteer_hour: 21
}

const ProfilePic: React.FC<IProfilePicProps> = ({user=user1}) => {
  function handleFileChange(e) {}

  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');

  return (
    <div className="flex flex-col items-center justify-between p-[32px] h-[275px] bg-light-gray-white rounded-2xl w-full border-2">
      <div className="h-[105px] w-[105px] bg-light-gray-1 rounded-full flex justify-center items-center relative">
        <img
          src={
            fileUploaded
              ? `${uploadedFileLink}`
              : './../src/assets/icons/photo.svg'
          }
          className={
            fileUploaded
              ? 'h-[142px] w-[140px] size-fit rounded-full'
              : 'h-[72px] w-[72px] cursor-pointer'
          }
        />

        {fileUploaded ? (
          ''
        ) : (
          <input
            onChange={e => handleFileChange(e)}
            type="file"
            accept="image/*;capture=camera"
            className="absolute opacity-0 h-[142px] w-[140px] rounded-full cursor-pointer"
          />
        )}
      </div>
      <div>
       <p className='font-gerbera-h3 text-light-gray-black '>{user.name}{" "}{user.last_name}</p>
      <p className='font-gerbera-sub1 text-light-gray-4'>{user.rating.level}</p>
      </div>
      
      <div className='w-[220px] h-[28px] flex justify-between items-center'>
        <p className='w-[96px] h-[28px] bg-light-brand-green font-gerbera-sub2 text-light-gray-white rounded-2xl flex justify-center items-center'>{user.point}{ " "}{getBallCorrectEndingName(user.point)}</p>
        <p className='w-[96px] h-[28px] bg-light-gray-1 font-gerbera-sub2 text-light-gray-8-text rounded-2xl flex justify-center items-center'>{user.volunteer_hour}{" "}{getHourCorrectEndingName(user.volunteer_hour)}</p>
      </div>
    </div>
  );
};

export default ProfilePic;
