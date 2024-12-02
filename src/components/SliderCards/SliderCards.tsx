import React, { useState, useRef, useEffect, useContext } from 'react';
//import CardTask from '../ui/Cards/CardTask/CardTask';
import { getAllDeliveries, type IDelivery } from '../../api/apiDeliveries';
import { TokenContext } from '../../core/TokenContext';

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
  const [hasMoved, setHasMoved] = useState<boolean>(false); // Новое состояние для отслеживания движения
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const { token } = useContext(TokenContext);

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
    setIsDragging(true); // Начинаем перетаскивание
    setHasMoved(false); // Сбрасываем флаг движения
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return; // Если не перетаскиваем, выходим
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;

    if (Math.abs(walk) > 5 && !hasMoved) {
      setHasMoved(true); // Пользователь начал двигать мышь
    }

    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Завершаем перетаскивание
    setTimeout(() => {
      setHasMoved(false); // Сбрасываем флаг движения после завершения события
    }, 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTimeout(() => {
      setHasMoved(false);
    }, 0);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      // Обрабатываем клик по карточке, если не было перетаскивания
      // Например, можно вызвать функцию для открытия карточки
      // onCardClick(e);
    }
  };

  // Обработчики для сенсорных устройств
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;

    if (Math.abs(walk) > 5 && !hasMoved) {
      setHasMoved(true);
    }

    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      setHasMoved(false);
    }, 0);
  };

  return (
    <div className="pt-[16px] w-full max-w-[400px]">
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
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          whiteSpace: 'nowrap',
        }}
      >
        {deliveries.map(delivery => (
          <div
            key={delivery.id}
            className=""
            onClickCapture={handleCardClick} // Добавили обработчик клика
          >
            {/* <CardTask delivery={delivery} switchTab={switchTab} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCards;
