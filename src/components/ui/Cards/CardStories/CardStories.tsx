import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

// Интерфейс пропсов для компонента CardStories
interface CardStoriesProps {
  imageSrc: string;
  title: string;
  onClick: () => void;
}

const CardStories: React.FC<CardStoriesProps> = ({
  imageSrc,
  title,
  onClick,
}) => {
  return (
    <div
      className="relative w-[116px] h-[160px] cursor-pointer overflow-hidden"
      onClick={onClick}>
      {/* Изображение */}
      <Avatar.Root className='inline-flex items-center justify-center align-middle overflow-hidden w-fit h-fit rounded-2xl'>
            <Avatar.Image src={imageSrc} decoding='async'  loading='lazy' className='w-[116px] h-[160px] rounded-2xl object-cover' />
            <Avatar.Fallback delayMs={1000} className='bg-light-gray-2 dark:bg-light-gray-5 w-[116px] h-[160px] rounded-2xl'>
          </Avatar.Fallback>
        </Avatar.Root>
      {/* Текст поверх картинки */}
      <div className="absolute bottom-[12px] px-[12px] font-gerbera-sub2 text-light-gray-white w-full h-fit whitespace-normal text-left">
        {title}
      </div>
    </div>
  );
};

export default CardStories;
