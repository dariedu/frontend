import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import logoText from '../../assets/logoText.svg';
import bell from '../../assets/icons/Notifications.svg';

interface INavigationBarProps {
  variant: 'volunteerForm' | 'mainScreen';
  title?: string;
  avatarUrl?: string;
}

const NavigationBar: React.FC<INavigationBarProps> = ({
  variant,
  title = '',
  avatarUrl = '',
}) => {
  return (
    <div className="relative w-[360px] p-4 bg-light-gray-white dark:bg-dark-gray-white rounded-[16px] flex items-center justify-between">
      {/* Левая часть с иконкой или логотипом */}
      <div className="flex items-center space-x-2">
        {variant === 'volunteerForm' ? (
          <>
            <ChevronLeftIcon className="w-6 h-6 text-black dark:text-white" />
            <h1 className="text-lg font-gerbera-h2 text-light-gray-8-text dark:text-dark-gray-8-text">
              {title}
            </h1>
          </>
        ) : (
          <>
            <img src={logoText} alt="Logo" className="w-[130px] h-10" />
            {/* <h1 className="text-lg font-gerbera-h2 text-light-gray-8-text dark:text-dark-gray-8-text">
              дари еду
            </h1> */}
          </>
        )}
      </div>
      {/* Правая часть с аватаркой и иконкой */}
      {variant === 'mainScreen' && (
        <div className="flex items-center space-x-4">
          <img src={bell} className="w-10 h-10 text-black dark:text-white" />
          <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-dark-gray-1 rounded-full">
            <Avatar.Image
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 object-cover rounded-full"
            />
            <Avatar.Fallback className="text-black dark:text-white">
              {avatarUrl ? avatarUrl[0] : 'U'}
            </Avatar.Fallback>
          </Avatar.Root>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
