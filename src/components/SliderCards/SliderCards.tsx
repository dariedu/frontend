import React, { useState, useRef, useEffect, useContext } from 'react';
import CardTask from '../ui/Cards/CardTask/CardTask';
import { getAllDeliveries, type IDelivery } from '../../api/apiDeliveries';
import { UserContext } from '../../core/UserContext';

interface SliderCardsProps {
  showTitle?: boolean;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
}

const SliderCards: React.FC<SliderCardsProps> = ({
  showTitle = true,
  switchTab,
}) => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const { token } = useContext(UserContext);

  // Получение данных из API при монтировании компонента
  useEffect(() => {
    const fetchDeliveries = async () => {
      if (token) {
        try {
          const data = await getAllDeliveries(token);
          setDeliveries(data);
        } catch (error) {
          console.error('Ошибка при загрузке данных о доставках:', error);
        }
      }
    };

    fetchDeliveries();
  }, [token]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
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

  const handleMouseUp = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

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
      {showTitle && (
        <h2 className="font-gerbera-h1 text-light-gray-black text-left pl-4">
          Другие добрые дела
        </h2>
      )}

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
        {deliveries.map(delivery => (
          <div key={delivery.id} className="">
            <CardTask delivery={delivery} switchTab={switchTab} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCards;
