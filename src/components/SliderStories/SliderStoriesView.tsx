import React, { useState } from 'react';
import closeIcon from '../../assets/icons/closeIcon.svg';
import imageStory from '../../assets/Story.jpg';

// Пример данных для сторис
const stories = [
  {
    id: 1,
    title: 'Поиск волонеров',
    date: '31 сент.',
    text: 'Не хватает волонтёров на доставку',
    imageSrc: imageStory,
  },
  {
    id: 2,
    title: 'Событие 2',
    date: '1 окт.',
    text: 'Описание события 2',
    imageSrc: imageStory,
  },
  {
    id: 3,
    title: 'Событие 3',
    date: '2 окт.',
    text: 'Описание события 3',
    imageSrc: imageStory,
  },
  {
    id: 4,
    title: 'Событие 4',
    date: '3 окт.',
    text: 'Описание события 4',
    imageSrc: imageStory,
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

  // Обработчики для листания сторис
  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="relative w-full h-full max-w-[360px] bg-white rounded-lg overflow-hidden">
        {/* Прогресс-бар и кнопка закрытия */}
        <div className="absolute top-[60px] left-0 w-full px-4 flex items-center justify-between z-20">
          {/* Прогресс-бар */}
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mr-4">
            <div
              className="h-full bg-light-gray-white transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / stories.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex justify-center items-center rounded-full"
          >
            <img src={closeIcon} alt="Close" className="w-8 h-8" />
          </button>
        </div>

        {/* Контент сторис */}
        <div className="flex flex-col items-center mt-[40px]">
          {/* Изображение */}
          <img
            src={stories[currentIndex].imageSrc}
            alt={stories[currentIndex].title}
            className="w-[360px] h-[634px] object-cover"
          />

          {/* Текст поверх картинки */}
          <div className="text-white absolute top-[120px] left-[15px]">
            <div className="flex bg-light-brand-green w-[112px] h-[28px] items-center justify-center font-gerbera-sub2 text-light-gray-white rounded-full mb-[14px]">
              {stories[currentIndex].date}
            </div>
            <p className="font-gerbera-st text-left">
              {stories[currentIndex].title}
            </p>
            <p className="font-gerbera-h1">{stories[currentIndex].text}</p>
          </div>

          {/* Кнопка "Записаться" */}
          <button
            className="w-[328px] h-[48px] text-center bg-light-brand-green font-gerbera-h3 text-white rounded-full mt-4"
            onClick={() => alert('Записаться')}
          >
            Записаться
          </button>
        </div>

        {/* Обработка прокрутки для листания сторис */}
        <div
          className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer z-10"
          onMouseDown={e => {
            const startX = e.clientX;
            const handleMouseMove = (e: MouseEvent) => {
              if (e.clientX - startX > 50) {
                handlePrev();
                window.removeEventListener('mousemove', handleMouseMove);
              } else if (e.clientX - startX < -50) {
                handleNext();
                window.removeEventListener('mousemove', handleMouseMove);
              }
            };
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', () => {
              window.removeEventListener('mousemove', handleMouseMove);
            });
          }}
        />
      </div>
    </div>
  );
};

export default SliderStoriesView;
