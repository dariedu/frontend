import React from 'react';
import CardDelivery from '../ui/Cards/CardTask/CardDelivery';
import { type IDelivery } from '../../api/apiDeliveries';
import './../../components/ui/Cards/CardPromotion/SliderCardStyles.css'


type TSliderCardsDeliveriesProps = {
  deliveries: IDelivery[]
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getDelivery: (delivery: IDelivery) =>{}
  stringForModal: string
  takeDeliverySuccess: boolean
  setTakeDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>
}


const SliderCardsDeliveries: React.FC<TSliderCardsDeliveriesProps> = ({deliveries, switchTab, getDelivery, stringForModal, takeDeliverySuccess, setTakeDeliverySuccess}) => {
  // Начальные позиции для перетаскивания
  // const [dragStart, setDragStart] = useState<number>(0);
  // const [scrollLeft, setScrollLeft] = useState<number>(0);
  // const [isDragging, setIsDragging] = useState<boolean>(false);

  // Реф на контейнер слайдера
  //const sliderRef = useRef<HTMLDivElement | null>(null);

  // Обработчик начала перетаскивания
  // const handleMouseDown = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  //   setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
  //   setScrollLeft(sliderRef.current?.scrollLeft || 0);
  // };

  // Обработчик движения мыши
  // const handleMouseMove = (e: React.MouseEvent) => {
  //   if (e.buttons !== 1) return; // Только при зажатой левой кнопке мыши
  //   e.preventDefault();
  //   const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
  //   const walk = x - dragStart;

  //   // Если перемещение больше 5 пикселей, считаем это перетаскиванием
  //   if (Math.abs(walk) > 5 && !isDragging) {
  //     setIsDragging(true);
  //   }

  //   if (sliderRef.current) {
  //     sliderRef.current.scrollLeft = scrollLeft - walk;
  //   }
  // };

  // Обработчик окончания перетаскивания
  // const handleMouseUp = () => {
  //   setTimeout(() => {
  //     setIsDragging(false);
  //   }, 0);
  // };

  // Обработчики для touch-событий (мобильные устройства)
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   setIsDragging(false);
  //   setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
  //   setScrollLeft(sliderRef.current?.scrollLeft || 0);
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
  //   const walk = x - dragStart;

  //   if (Math.abs(walk) > 5 && !isDragging) {
  //     setIsDragging(true);
  //   }

  //   if (sliderRef.current) {
  //     sliderRef.current.scrollLeft = scrollLeft - walk;
  //   }
  // };

  // const handleTouchEnd = () => {
  //   setTimeout(() => {
  //     setIsDragging(false);
  //   }, 0);
  // };

  return (
    <div className="pt-3 w-[360px]">
      {/* Заголовок - отображается только если showTitle === true */}
    
        {/* <h2 className="font-gerbera-h1 text-light-gray-black text-left pl-4">
          Другие добрые дела
        </h2> */}
    

      {/* Слайдер для карточек */}
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-[360px] pl-4 space-x-2"
        // ref={sliderRef}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        // style={{ cursor: 'grab', whiteSpace: 'nowrap' }}
      >
        {/* Отображение карточек через map */}
    
        {deliveries.map((delivery:IDelivery) => (
          <div key={delivery.id} className="">
            <CardDelivery delivery={delivery} switchTab={switchTab} getDelivery={getDelivery} stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCardsDeliveries;
