import React from 'react';

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
      className="relative w-[116px] h-[160px] cursor-pointer rounded-lg overflow-hidden"
      onClick={onClick}
    >
      {/* Изображение */}
      <img src={imageSrc} alt={title} className="w-full h-full object-cover" />

      {/* Текст поверх картинки */}
      <div className="absolute bottom-4 left-4 font-gerbera-sub2 text-light-gray-white w-[92px] h-[32px] break-words whitespace-normal text-left">
        {title}
      </div>
    </div>
  );
};

export default CardStories;
