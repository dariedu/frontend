import React, { useState, useEffect, useRef } from 'react';
import closeIcon from '../../assets/icons/closeIcon.svg';
import storyImage1 from '../../assets/Text.png';
import storyImage2 from '../../assets/Text (1).png';

// Пример данных для сторис
const stories = [
  {
    id: 1,
    title: 'Поиск волонеров',
    date: '31 сент.',
    text: 'Не хватает волонтёров на доставку',
    imageSrc: storyImage1,
  },
  {
    id: 2,
    title: 'Событие 2',
    date: '1 окт.',
    text: 'Описание события 2',
    imageSrc: storyImage2,
  },
  {
    id: 3,
    title: 'Поиск волонеров',
    date: '31 сент.',
    text: 'Не хватает волонтёров на доставку',
    imageSrc: storyImage1,
  },
  {
    id: 4,
    title: 'Событие 2',
    date: '1 окт.',
    text: 'Описание события 2',
    imageSrc: storyImage2,
  },
];

interface SliderStoriesViewProps {
  currentStoryIndex: number;
  onClose: () => void;
}

const SliderStoriesView: React.FC<SliderStoriesViewProps> = ({
  currentStoryIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentStoryIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);

  const minSwipeDistance = 50; // Минимальное расстояние свайпа в пикселях

  // Функции для перехода между сторис
  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1,
    );
  };

  // Обработчики сенсорных событий
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      // Свайп влево
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Свайп вправо
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Обработчики мышиных событий
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    mouseEndX.current = e.clientX;
  };

  const onMouseUp = () => {
    if (!mouseStartX.current || !mouseEndX.current) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      return;
    }
    const distance = mouseStartX.current - mouseEndX.current;
    if (distance > minSwipeDistance) {
      // Свайп влево
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Свайп вправо
      handlePrev();
    }
    mouseStartX.current = null;
    mouseEndX.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  // Обработчик клавиатурных событий для доступности
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      <div className="relative w-full h-full max-w-[360px] bg-white rounded-lg overflow-hidden">
        {/* Прогресс-бар и кнопка закрытия */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          {/* Прогресс-бар */}
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mr-4">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / stories.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-700"
          >
            <img src={closeIcon} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        {/* Контент сторис */}
        <div className="flex flex-col items-center mt-16">
          {/* Изображение */}
          <img
            src={stories[currentIndex].imageSrc}
            alt={stories[currentIndex].title}
            className="w-full h-auto rounded-lg object-cover"
          />

          {/* Текст поверх картинки */}
          <div className="text-white absolute top-24 left-4 right-4">
            <div className="flex bg-red-500 w-28 h-7 items-center justify-center font-sans text-sm rounded-full mb-4">
              {stories[currentIndex].date}
            </div>
            <p className="text-xl font-semibold">
              {stories[currentIndex].title}
            </p>
            <p className="text-md">{stories[currentIndex].text}</p>
          </div>
        </div>

        {/* Навигационные стрелки */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SliderStoriesView;
