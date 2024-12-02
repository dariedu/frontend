import React, { useState} from 'react';
import closeIcon from '../../assets/icons/closeIcon.svg';
import { IStory } from '../../api/storiesApi';
import * as Avatar from '@radix-ui/react-avatar';

interface SliderStoriesViewProps {
  currentStoryIndex: number;
  onClose: () => void;
  stories:IStory[]
}

const SliderStoriesView: React.FC<SliderStoriesViewProps> = ({
  currentStoryIndex,
  onClose,
  stories
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentStoryIndex);
  // const touchStartX = useRef<number | null>(null);
  // const touchEndX = useRef<number | null>(null);
  // const mouseStartX = useRef<number | null>(null);
  // const mouseEndX = useRef<number | null>(null);

  // const minSwipeDistance = 50; // Минимальное расстояние свайпа в пикселях

  //  Функции для перехода между сторис
  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1,
    );
  };

  // // Обработчики сенсорных событий
  // const onTouchStartHandler = (e: React.TouchEvent) => {
  //   touchStartX.current = e.changedTouches[0].clientX;
  // };

  // const onTouchMoveHandler = (e: React.TouchEvent) => {
  //   touchEndX.current = e.changedTouches[0].clientX;
  // };

  // const onTouchEndHandler = () => {
  //   if (!touchStartX.current || !touchEndX.current) return;
  //   const distance = touchStartX.current - touchEndX.current;
  //   if (distance > minSwipeDistance) {
  //     // Свайп влево
  //     handleNext();
  //   } else if (distance < -minSwipeDistance) {
  //     // Свайп вправо
  //     handlePrev();
  //   }
  //   touchStartX.current = null;
  //   touchEndX.current = null;
  // };

  // // Обработчики мышиных событий
  // const onMouseDownHandler = (e: React.MouseEvent) => {
  //   mouseStartX.current = e.clientX;
  //   window.addEventListener('mousemove', onMouseMoveHandler);
  //   window.addEventListener('mouseup', onMouseUpHandler);
  // };

  // const onMouseMoveHandler = (e: MouseEvent) => {
  //   mouseEndX.current = e.clientX;
  // };

  // const onMouseUpHandler = () => {
  //   if (!mouseStartX.current || !mouseEndX.current) {
  //     window.removeEventListener('mousemove', onMouseMoveHandler);
  //     window.removeEventListener('mouseup', onMouseUpHandler);
  //     return;
  //   }
  //   const distance = mouseStartX.current - mouseEndX.current;
  //   if (distance > minSwipeDistance) {
  //     // Свайп влево
  //     handleNext();
  //   } else if (distance < -minSwipeDistance) {
  //     // Свайп вправо
  //     handlePrev();
  //   }
  //   mouseStartX.current = null;
  //   mouseEndX.current = null;
  //   window.removeEventListener('mousemove', onMouseMoveHandler);
  //   window.removeEventListener('mouseup', onMouseUpHandler);
  // };

  // // Обработчик клавиатурных событий для доступности
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === 'ArrowLeft') {
  //       handlePrev();
  //     } else if (e.key === 'ArrowRight') {
  //       handleNext();
  //     } else if (e.key === 'Escape') {
  //       onClose();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-light-gray-white dark:bg-light-gray-black bg-opacity-80 flex justify-center items-center z-50 rounded-xl "
      // onTouchStart={onTouchStartHandler}
      // onTouchMove={onTouchMoveHandler}
      // onTouchEnd={onTouchEndHandler}
      // onMouseDown={onMouseDownHandler}
    >
      <div className="relative h-full w-full max-w-[400px]  dark:bg-light-gray-black rounded-2xl overflow-hidden bg-light-gray-white">
        {/* Прогресс-бар и кнопка закрытия */}
        <div className="absolute top-[60px] left-0 w-full px-4 flex items-center justify-between z-20">
          {/* Прогресс-бар */}
          <div className="w-full h-2 bg-light-gray-3 rounded-full overflow-hidden mr-4">
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
        <div className="flex flex-col items-center mt-[40px] bg-light-gray-2 rounded-2xl ">
          {/* Изображение */}
          <Avatar.Root className='inline-flex items-center justify-center align-middle overflow-hidden w-full max-w-[400px] h-[734px] rounded-2xl bg-light-gray-2 dark:bg-light-gray-5'>{
           stories[currentIndex].cover && (
            <Avatar.Image src={stories[currentIndex].cover} decoding='async'  loading='lazy' className='w-full max-w-[400px] h-[734px] rounded-2xl object-cover' />
        )}
            <Avatar.Fallback delayMs={1000} className='bg-light-gray-2 dark:bg-light-gray-5 w-full max-w-[400px] h-[734px] rounded-2xl'>
          </Avatar.Fallback>
        </Avatar.Root>
          {/* Текст поверх картинки */}
          <div className="text-light-gray-white font-gerbera-h2 bottom-28 absolute pl-[15px]">
            <div className="flex bg-light-brand-green w-[112px] h-[28px] items-center justify-center font-gerbera-sub2 text-light-gray-white rounded-full mb-[14px]">
              {new Date(stories[currentIndex].date).toLocaleDateString()}
            </div>
            <p className="font-gerbera-st text-left mb-3">
              {stories[currentIndex].title}
            </p>
            <p className="font-gerbera-h2 text-left ">{stories[currentIndex].text}</p>
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
