import React, { useState } from 'react';
import CardStories from '../ui/Cards/CardStories/CardStories';
import SliderStoriesView from './SliderStoriesView';
import imageStory from '../../assets/Story.jpg';

// Пример данных для слайдера
const stories = [
  { id: 1, title: 'Расписание доставок', imageSrc: imageStory },
  { id: 2, title: 'Расписание доставок', imageSrc: imageStory },
  { id: 3, title: 'Расписание доставок', imageSrc: imageStory },
  { id: 4, title: 'Расписание доставок', imageSrc: imageStory },
];

const SliderStories: React.FC = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(
    null,
  );

  // Начальные позиции для перетаскивания
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  // Реф на контейнер слайдера
  const sliderRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // только при зажатой левой кнопке мыши
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      {/* Слайдер для историй */}
      <div
        className="flex overflow-x-scroll space-x-4 p-4 w-[360px]"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'grab', whiteSpace: 'nowrap' }}
      >
        {stories.map((story, index) => (
          <div key={story.id} className="inline-block">
            <CardStories
              imageSrc={story.imageSrc}
              title={story.title}
              onClick={() => setCurrentStoryIndex(index)}
            />
          </div>
        ))}
      </div>

      {/* Полноэкранное отображение истории */}
      {currentStoryIndex !== null && (
        <SliderStoriesView
          currentStoryIndex={currentStoryIndex}
          onClose={() => setCurrentStoryIndex(null)}
        />
      )}
    </>
  );
};

export default SliderStories;
