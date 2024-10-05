import React from 'react';

interface IStoriesViewProps {
  imageSrc: string;
  onClose: () => void;
}

const StoriesView: React.FC<IStoriesViewProps> = ({ imageSrc, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Полноэкранное изображение */}
      <img
        src={imageSrc}
        alt="Story"
        className="w-full h-full object-contain"
      />
      {/* Кнопка для закрытия полноэкранного режима */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default StoriesView;
