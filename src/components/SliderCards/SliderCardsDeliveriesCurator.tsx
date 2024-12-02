import React, { useState, useRef } from 'react';
import CardDelivery from '../ui/Cards/CardTask/CardDelivery';
import { type IDelivery } from '../../api/apiDeliveries';
import './../../components/ui/Cards/CardPromotion/SliderCardStyles.css';

type TSliderCardsDeliveriesCuratorProps = {
  deliveries: IDelivery[];
  myDeliveries: IDelivery[];
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getDelivery: (delivery: IDelivery) => {};
  stringForModal: string;
  takeDeliverySuccess: boolean;
  setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const SliderCardsDeliveriesCurator: React.FC<
  TSliderCardsDeliveriesCuratorProps
> = ({
  deliveries,
  myDeliveries,
  switchTab,
  getDelivery,
  stringForModal,
  takeDeliverySuccess,
  setTakeDeliverySuccess,
}) => {
  let arrOfMyDeliveriesId: number[] = [];
  myDeliveries.forEach(i => arrOfMyDeliveriesId.push(i.id));

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="pt-3 w-full max-w-[400px]">
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-[360px] pl-4 space-x-2"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {deliveries.map((delivery: IDelivery) => {
          const canBook = !arrOfMyDeliveriesId.includes(delivery.id);
          return (
            <div key={delivery.id} className="">
              <CardDelivery
                delivery={delivery}
                canBook={canBook}
                switchTab={switchTab}
                getDelivery={getDelivery}
                stringForModal={stringForModal}
                takeDeliverySuccess={takeDeliverySuccess}
                setTakeDeliverySuccess={setTakeDeliverySuccess}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SliderCardsDeliveriesCurator;
