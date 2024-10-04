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
      className="relative w-[160px] h-[240px] cursor-pointer rounded-lg overflow-hidden"
      onClick={onClick}
    >
      {/* Изображение */}
      <img src={imageSrc} alt={title} className="w-full h-full object-cover" />

      {/* Текст поверх картинки */}
      <div className="absolute bottom-4 left-4 text-white font-bold text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
        {title}
      </div>
    </div>
  );
};

export default CardStories;
