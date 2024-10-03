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
      <img
        src={imageSrc}
        alt={title}
        className="w-[116px] h-[160px] rounded-[16px] object-cover"
      />

      {/* Текст поверх картинки */}
      <div className="absolute w-[116px] h-[160px] bottom-4 left-4 font-gerbera-sub2 text-light-gray-white px-2 py-1 rounded">
        {title}
      </div>
    </div>
  );
};

export default CardStories;
