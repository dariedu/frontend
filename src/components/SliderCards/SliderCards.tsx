import React, { useState, useRef } from 'react';
import CardTask from '../ui/Cards/CardTask/CardTask';

// Пример данных для карточек
const cardTasks = [
  {
    id: 1,
    title: 'Ст. Молодежная',
    subtitle: 'Мск, ул. Бобруйская д.6 к.2',
    timeOrPeriod: '15:00',
    points: '+2 балла',
    type: 'time-based',
  },
  {
    id: 2,
    title: 'Написать текст',
    subtitle: 'Онлайн',
    timeOrPeriod: 'За две недели',
    points: '+14 баллов',
    type: 'period-based',
  },
  {
    id: 3,
    title: 'Уборка территории',
    subtitle: 'Мск, ул. Бобруйская д.6 к.2',
    timeOrPeriod: '15:00',
    additionalTime: '25.08',
    points: '+2 балла',
    type: 'time-based',
  },
];

interface SliderCardsProps {
  showTitle?: boolean;
}

const SliderCards: React.FC<SliderCardsProps> = ({ showTitle = true }) => {
  // Начальные позиции для перетаскивания
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

    // Если перемещение больше 5 пикселей, считаем это перетаскиванием
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
    <div className="pt-[16px] w-[360px]">
      {/* Заголовок - отображается только если showTitle === true */}
      {showTitle && (
        <h2 className="font-gerbera-h1 text-light-gray-black text-left">
          Другие добрые дела
        </h2>
      )}

      {/* Слайдер для карточек */}
      <div
        className="flex overflow-x-hidden space-x-4 pt-4 w-[360px]"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: 'grab', whiteSpace: 'nowrap' }}
      >
        {/* Отображение карточек через map */}
        {cardTasks.map(task => (
          <div key={task.id} className="">
            <CardTask
              title={task.title}
              subtitle={task.subtitle}
              timeOrPeriod={task.timeOrPeriod}
              points={task.points}
              typeTask={task.type}
              additionalTime={task.additionalTime}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCards;
