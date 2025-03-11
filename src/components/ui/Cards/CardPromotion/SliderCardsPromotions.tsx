import React from 'react';
import CardPromotion from './CardPromotion';
import {
  type IPromotion,
  type TPromotionCategory,
} from '../../../../api/apiPromotions';
import './SliderCardStyles.css';

type TSliderCardsPromotionsProps = {
  promotions: IPromotion[];
  optional: boolean;
  reserved: boolean;
  makeReservationFunc?: (
    promotion: IPromotion,
    token: string | null,
    setRedeemPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>,
    setRedeemPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>,
    userValue: any,
    setRedeemPromotionErr: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {};
  cancelPromotion?: (
    promotion: IPromotion,
    token: string | null,
    setCancelPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>,
    setCancelPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>,
    userValue: any,
    setCancelPromotionErr: React.Dispatch<React.SetStateAction<string>>,
    setCancelError: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {};
  filterCategory?: TPromotionCategory[];
  setRedeemPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>;
  setRedeemPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRedeemPromotionErr: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setCancelPromotionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setCancelPromotionSuccessName: React.Dispatch<React.SetStateAction<string>>;
  setCancelPromotionErr: React.Dispatch<React.SetStateAction<string>>;
  setCancelError: React.Dispatch<React.SetStateAction<boolean>>;
  allPromoNotConfirmed: number[]|null;
};

const SliderCardsPromotions: React.FC<TSliderCardsPromotionsProps> = ({
  promotions,
  optional,
  reserved,
  makeReservationFunc,
  filterCategory,
  cancelPromotion,
  setRedeemPromotionSuccessName,
  setRedeemPromotionSuccess,
  setRedeemPromotionErr,
  setError,
  setCancelPromotionSuccess,
  setCancelPromotionSuccessName,
  setCancelPromotionErr,
  setCancelError,
  allPromoNotConfirmed,
}) => {
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
      className="sliderPromotionsScrollbar py-2 flex justify-start overflow-x-auto w-full max-w-[500px] px-4 space-x-2 "
      //ref={sliderRef}
      // className={`overflow-x-hidden flex space-x-4 py-2 scrollbar-hide w-[360px] ${
      //   isDragging ? 'cursor-grabbing' : 'cursor-grab'
      // } select-none`}
      //onMouseDown={handleMouseDown}
      onDragStart={e => e.preventDefault()}
    >
      {/* Render each CardPromotion */}
      {filterCategory && filterCategory.length > 0
        ? promotions
            .filter(promo => {
              if (promo.category) {
                if (filterCategory.find(i => i.id === promo.category.id))
                  return promo;
              }
            })
            .map((promo, index) => (
              <div key={index} className="flex-shrink-0">
                <CardPromotion
                  promotion={promo}
                  optional={optional}
                  reserved={reserved}
                  makeReservationFunc={makeReservationFunc}
                  cancelPromotion={cancelPromotion}
                  setRedeemPromotionSuccessName={setRedeemPromotionSuccessName}
                  setRedeemPromotionSuccess={setRedeemPromotionSuccess}
                  setRedeemPromotionErr={setRedeemPromotionErr}
                  setError={setError}
                  setCancelPromotionSuccess={setCancelPromotionSuccess}
                  setCancelPromotionSuccessName={setCancelPromotionSuccessName}
                  setCancelPromotionErr={setCancelPromotionErr}
                  setCancelError={setCancelError}
                  allPromoNotConfirmed={allPromoNotConfirmed}
                />
              </div>
            ))
        : promotions.map((promo, index) => (
            <div key={index} className="flex-shrink-0">
              <CardPromotion
                promotion={promo}
                optional={optional}
                reserved={reserved}
                makeReservationFunc={makeReservationFunc}
                cancelPromotion={cancelPromotion}
                setRedeemPromotionSuccessName={setRedeemPromotionSuccessName}
                setRedeemPromotionSuccess={setRedeemPromotionSuccess}
                setRedeemPromotionErr={setRedeemPromotionErr}
                setError={setError}
                setCancelPromotionSuccess={setCancelPromotionSuccess}
                setCancelPromotionSuccessName={setCancelPromotionSuccessName}
                setCancelPromotionErr={setCancelPromotionErr}
                setCancelError={setCancelError}
                allPromoNotConfirmed={allPromoNotConfirmed}
              />
            </div>
          ))}
    </div>
  );
};

export default SliderCardsPromotions;
