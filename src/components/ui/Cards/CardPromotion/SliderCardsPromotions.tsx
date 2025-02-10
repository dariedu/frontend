import React from 'react';
import CardPromotion from './CardPromotion';
import { type IPromotion, type TPromotionCategory } from '../../../../api/apiPromotions';
import './SliderCardStyles.css';

type TSliderCardsPromotionsProps = {
  promotions: IPromotion[]
  optional: boolean
  reserved: boolean
  makeReservationFunc?: (promotion: IPromotion) => void
  cancelPromotion?: (promotion: IPromotion) => void
  filterCategory?:TPromotionCategory[]
}

const SliderCardsPromotions: React.FC<TSliderCardsPromotionsProps> = ({promotions, optional, reserved, makeReservationFunc, filterCategory, cancelPromotion}) => {
  // const sliderRef = useRef<HTMLDivElement>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);
  // const [scrollLeft, setScrollLeft] = useState(0);

  // // Start dragging
  // const handleMouseDown = (e: React.MouseEvent) => {
  //   setIsDragging(true);
  //   setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
  //   setScrollLeft(sliderRef.current?.scrollLeft || 0);
  // };

  // // Dragging movement
  // const handleMouseMove = (e: MouseEvent) => {
  //   if (!isDragging) return;
  //   e.preventDefault();
  //   const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
  //   const walk = (x - startX) * 2; // Adjust scroll speed as needed
  //   if (sliderRef.current) {
  //     sliderRef.current.scrollLeft = scrollLeft - walk;
  //   }
  // };

  // // Stop dragging
  // const handleMouseUpOrLeave = () => {
  //   setIsDragging(false);
  // };

  // // Add global event listeners when dragging
  // useEffect(() => {
  //   if (isDragging) {
  //     window.addEventListener('mousemove', handleMouseMove);
  //     window.addEventListener('mouseup', handleMouseUpOrLeave);
  //   } else {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //     window.removeEventListener('mouseup', handleMouseUpOrLeave);
  //   }
  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //     window.removeEventListener('mouseup', handleMouseUpOrLeave);
  //   };
  // }, [isDragging]);


  return (
    <div
      className='sliderPromotionsScrollbar py-2 flex justify-start overflow-x-auto w-full max-w-[500px] px-4 space-x-2 '
      //ref={sliderRef}
      // className={`overflow-x-hidden flex space-x-4 py-2 scrollbar-hide w-[360px] ${
      //   isDragging ? 'cursor-grabbing' : 'cursor-grab'
      // } select-none`}
      //onMouseDown={handleMouseDown}
      onDragStart={e => e.preventDefault()}
    >
      {/* Render each CardPromotion */}
      {filterCategory && filterCategory.length > 0 ? (
        promotions.filter((promo) => {
          if (promo.category) {
           if (filterCategory.find(i => i.id === promo.category.id)
          ) return promo
        }}
          ).map((promo, index) => (
        <div key={index} className="flex-shrink-0">
          <CardPromotion promotion={promo} optional={optional} reserved={reserved} makeReservationFunc={makeReservationFunc} cancelPromotion={cancelPromotion}
          />
        </div>
        ))
      ): (
        promotions.map((promo, index) => (
          <div key={index} className="flex-shrink-0">
            <CardPromotion promotion={promo} optional={optional} reserved={reserved} makeReservationFunc={makeReservationFunc} cancelPromotion={cancelPromotion}
            />
          </div>
          ))
      )

      }
    </div>
  );
};

export default SliderCardsPromotions;
