import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import Small_sms from "./../../assets/icons/small_sms.svg?react";
import { IUser } from '../../core/types';
 


interface ListOfVolunteersProps {
  listOfVolunteers: IUser[]
  onOpenChange:React.Dispatch<React.SetStateAction<boolean>>
}

const ListOfVolunteersTasks: React.FC<ListOfVolunteersProps> = ({
  listOfVolunteers,
  onOpenChange,
}) => {


  return (
    <div className={"space-y-4 w-[360px] pt-10 pb-5 rounded-[16px] flex flex-col items-center mt-3 bg-light-gray-white dark:bg-light-gray-7-logo"} onClick={e => {e.stopPropagation() }
}>
      {
        listOfVolunteers.map((volunteer, index) => (
          <div
          key={index}
          className={"flex items-center justify-between space-x-4 p-4 bg-light-gray-1 dark:bg-light-gray-6 rounded-[16px] shadow cursor-pointer w-[328px]" }
         >
          <div className='flex w-fit items-center'>
            <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 rounded-full bg-light-gray-2 dark:bg-light-gray-5">
                {volunteer.photo &&
              <Avatar.Image
                className="w-[40px] h-[40px] object-cover"
                src={volunteer.photo}
              />
              }
              <Avatar.Fallback
                className="w-full h-full flex items-center justify-center text-white bg-black"
                delayMs={600}
              >
                {volunteer.name?.charAt(0)}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-1  ml-[10px]">
              {`${volunteer.last_name} ${volunteer.name}`}
            </span>
          </div>
        
           {volunteer.tg_username ? (
            <a href={'https://t.me/' + (volunteer.tg_username.includes('@') ? volunteer.tg_username.slice(1) : volunteer.tg_username)} target="_blank" onClick={(e => e.stopPropagation())}>
              <Small_sms className="w-[36px] h-[35px]" />
            </a>
            ) : ""}
           
        </div>
      ))
      }
       <button
            className={'btn-B-GreenDefault'}
            onClick={()=>onOpenChange(false)}
          >
            Закрыть
          </button>
      </div> 
  );
};

export default ListOfVolunteersTasks;
