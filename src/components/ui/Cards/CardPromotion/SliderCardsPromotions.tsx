import React, { useState, useRef, MouseEvent } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import CardPromotion from './CardPromotion';

// Тип для данных карточки
interface Promotion {
  id: number;
  image: string;
  points: string;
  date: string;
  title: string;
  address: string;
}

const SliderCardsPromotions: React.FC = () => {
  // Моковые данные для карточек
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      image: 'https://example.com/image1.jpg',
      points: '100 pts',
      date: '12/12',
      title: 'Promotion 1',
      address: '123 Main St',
    },
    {
      id: 2,
      image: 'https://example.com/image2.jpg',
      points: '200 pts',
      date: '12/15',
      title: 'Promotion 2',
      address: '456 Park Ave',
    },
    // Добавьте больше промоций, если нужно
  ]);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Функция для обработки drag-to-scroll
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    scrollArea.dataset.isDragging = 'true';
    scrollArea.dataset.startX = String(e.pageX - scrollArea.offsetLeft);
    scrollArea.dataset.scrollLeft = String(scrollArea.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || scrollArea.dataset.isDragging !== 'true') return;

    e.preventDefault();
    const startX = parseFloat(scrollArea.dataset.startX || '0');
    const walk = (e.pageX - scrollArea.offsetLeft - startX) * 2; // скорость скроллинга
    scrollArea.scrollLeft =
      parseFloat(scrollArea.dataset.scrollLeft || '0') - walk;
  };

  const handleMouseUp = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.dataset.isDragging = 'false';
    }
  };

  return (
    <ScrollArea.Root className="overflow-hidden w-full">
      <ScrollArea.Viewport
        className="flex space-x-4"
        style={{ width: '100%', height: 'auto' }}
        ref={scrollAreaRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {promotions.map(promotion => (
          <div key={promotion.id} className="w-[360px] shrink-0 snap-start">
            <CardPromotion {...promotion} />
          </div>
        ))}
      </ScrollArea.Viewport>
      {/* Добавим ScrollAreaScrollbar для прокрутки */}
      <ScrollArea.Scrollbar orientation="horizontal" className="h-2">
        <ScrollArea.Thumb className="bg-gray-300 rounded-full" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default SliderCardsPromotions;
