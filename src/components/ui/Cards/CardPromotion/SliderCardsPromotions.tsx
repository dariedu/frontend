import React, { useRef, useState, useEffect } from 'react';
import CardPromotion from './CardPromotion';
import image from '../../../../assets/avatar.svg';

// Example data for promotions
const promotionsData = [
  {
    image: image,
    points: '2 балла',
    date: '2.10',
    title: 'Концерт в Филармонии',
    address: 'Мск, ул. Бобруйская д.6 к.2',
  },
  {
    image: image,
    points: '5 баллов',
    date: '10.10',
    title: 'Встреча в парке',
    address: 'Спб, ул. Ленина д.14 к.3',
  },
  {
    image: image,
    points: '5 баллов',
    date: '10.10',
    title: 'Встреча в парке',
    address: 'Спб, ул. Ленина д.14 к.3',
  },
  {
    image: image,
    points: '5 баллов',
    date: '10.10',
    title: 'Встреча в парке',
    address: 'Спб, ул. Ленина д.14 к.3',
  },
  // Add more promotions as needed
];

const SliderCardsPromotions: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  // Dragging movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Adjust scroll speed as needed
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Stop dragging
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Add global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUpOrLeave);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    };
  }, [isDragging]);

  return (
    <div
      ref={sliderRef}
      className={`overflow-x-scroll flex space-x-4 py-2 scrollbar-hide w-[360px] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } select-none`}
      onMouseDown={handleMouseDown}
      onDragStart={e => e.preventDefault()}
    >
      {/* Render each CardPromotion */}
      {promotionsData.map((promo, index) => (
        <div key={index} className="flex-shrink-0">
          <CardPromotion
            image={promo.image}
            points={promo.points}
            date={promo.date}
            title={promo.title}
            address={promo.address}
          />
        </div>
      ))}
    </div>
  );
};

export default SliderCardsPromotions;
