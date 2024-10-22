import React, { useState, useRef } from 'react';
import CardStories from '../ui/Cards/CardStories/CardStories';
import SliderStoriesView from './SliderStoriesView';
import storyImage1 from '../../assets/Storie.png';
import storyImage2 from '../../assets/Storie1.png';
import storyImage3 from '../../assets/Storie2.png';
import storyImage4 from '../../assets/Storie3.png';

// Моковые данные для сторис
const stories = [
  {
    id: 1,
    title: 'Поиск волонтёров',
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
    title: 'Событие 3',
    date: '2 окт.',
    text: 'Описание события 3',
    imageSrc: storyImage3,
  },
  {
    id: 4,
    title: 'Событие 4',
    date: '3 окт.',
    text: 'Описание события 4',
    imageSrc: storyImage4,
  },
];

const SliderStories: React.FC = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Начальные позиции для перетаскивания
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  // Реф на контейнер слайдера
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Обработчик начала перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  // Обработчик движения мыши
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Только при зажатой левой кнопке мыши
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;

    if (Math.abs(walk) > 5 && !isDragging) {
      setIsDragging(true);
    }

    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Обработчик окончания перетаскивания
  const handleMouseUp = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  // Обработчики для touch-событий (мобильные устройства)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(false);
    setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;

    if (Math.abs(walk) > 5 && !isDragging) {
      setIsDragging(true);
    }

    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  return (
    <>
      {/* Слайдер для историй */}
      <div
        className="flex overflow-x-hidden space-x-4 p-4 w-[360px]"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: 'grab', whiteSpace: 'nowrap' }}
      >
        {stories.map((story, index) => (
          <div key={story.id} className="inline-block">
            <CardStories
              imageSrc={story.imageSrc}
              title={story.title}
              onClick={() => {
                if (!isDragging) {
                  setCurrentStoryIndex(index);
                }
              }}
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

// import React, { useState, useRef, useEffect } from 'react';
// import CardStories from '../ui/Cards/CardStories/CardStories';
// import SliderStoriesView from './SliderStoriesView';
// import { getStories, IStory } from '../../api/storiesApi';

// const SliderStories: React.FC = () => {
//   const [stories, setStories] = useState<IStory[]>([]); // Состояние для данных историй
//   const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(
//     null,
//   );
//   const [loading, setLoading] = useState<boolean>(true); // Состояние для индикации загрузки
//   const [error, setError] = useState<string | null>(null); // Состояние для обработки ошибок

//   // Эффект для загрузки историй при монтировании компонента
//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const fetchedStories = await getStories(); // Вызов функции API
//         setStories(fetchedStories);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load stories');
//         setLoading(false);
//       }
//     };

//     fetchStories(); // Вызов функции загрузки историй
//   }, []);

//   // Начальные позиции для перетаскивания
//   const [dragStart, setDragStart] = useState<number>(0);
//   const [scrollLeft, setScrollLeft] = useState<number>(0);
//   const [isDragging, setIsDragging] = useState<boolean>(false);

//   // Реф на контейнер слайдера
//   const sliderRef = useRef<HTMLDivElement | null>(null);

//   // Обработчик начала перетаскивания
//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
//     setScrollLeft(sliderRef.current?.scrollLeft || 0);
//   };

//   // Обработчик движения мыши
//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (e.buttons !== 1) return; // Только при зажатой левой кнопке мыши
//     e.preventDefault();
//     const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
//     const walk = x - dragStart;

//     // Если перемещение больше 5 пикселей, считаем это перетаскиванием
//     if (Math.abs(walk) > 5 && !isDragging) {
//       setIsDragging(true);
//     }

//     if (sliderRef.current) {
//       sliderRef.current.scrollLeft = scrollLeft - walk;
//     }
//   };

//   // Обработчик окончания перетаскивания
//   const handleMouseUp = () => {
//     setTimeout(() => {
//       setIsDragging(false);
//     }, 0);
//   };

//   // Обработчики для touch-событий (мобильные устройства)
//   const handleTouchStart = (e: React.TouchEvent) => {
//     setIsDragging(false);
//     setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
//     setScrollLeft(sliderRef.current?.scrollLeft || 0);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
//     const walk = x - dragStart;

//     if (Math.abs(walk) > 5 && !isDragging) {
//       setIsDragging(true);
//     }

//     if (sliderRef.current) {
//       sliderRef.current.scrollLeft = scrollLeft - walk;
//     }
//   };

//   const handleTouchEnd = () => {
//     setTimeout(() => {
//       setIsDragging(false);
//     }, 0);
//   };

//   if (loading) {
//     return <div>Loading stories...</div>; // Индикатор загрузки
//   }

//   if (error) {
//     return <div>{error}</div>; // Вывод ошибки
//   }

//   return (
//     <>
//       {/* Слайдер для историй */}
//       <div
//         className="flex overflow-x-hidden space-x-4 p-4 w-[360px]"
//         ref={sliderRef}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//         style={{ cursor: 'grab', whiteSpace: 'nowrap' }}
//       >
//         {stories.map((story, index) => (
//           <div key={story.id} className="inline-block">
//             <CardStories
//               imageSrc={story.cover || ''}
//               title={story.title || 'No title'}
//               onClick={() => {
//                 if (!isDragging) {
//                   setCurrentStoryIndex(index);
//                 }
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Полноэкранное отображение истории */}
//       {currentStoryIndex !== null && (
//         <SliderStoriesView
//           currentStoryIndex={currentStoryIndex}
//           onClose={() => setCurrentStoryIndex(null)}
//         />
//       )}
//     </>
//   );
// };

// export default SliderStories;
