import React from 'react';
import CardDelivery from '../ui/Cards/CardTask/CardDelivery';
import { type IDelivery } from '../../api/apiDeliveries';
import './../../components/ui/Cards/CardPromotion/SliderCardStyles.css'


type TSliderCardsDeliveriesProps = {
  deliveries: IDelivery[]
  myDeliveries: IDelivery[]
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getDelivery: (delivery: IDelivery) =>{}
  stringForModal: string
  takeDeliverySuccess: boolean
  setTakeDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>
}


const SliderCardsDeliveries: React.FC<TSliderCardsDeliveriesProps> = ({deliveries, myDeliveries, switchTab, getDelivery, stringForModal, takeDeliverySuccess, setTakeDeliverySuccess}) => {

  let arrOfMyDeliveriesId: number[] = [];
  myDeliveries.forEach(i => arrOfMyDeliveriesId.push(i.id));
  
  return (
    <div className="pt-3 w-[360px]">
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-[360px] pl-4 space-x-2"
      >
    
        {deliveries.map((delivery: IDelivery) => {
          if (!arrOfMyDeliveriesId.includes(delivery.id)) {
            return <div key={delivery.id} className="">
            <CardDelivery delivery={delivery} canBook={true} switchTab={switchTab} getDelivery={getDelivery} stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
          </div>
          } else {
            return <div key={delivery.id} className="">
            <CardDelivery delivery={delivery} canBook={false} switchTab={switchTab} getDelivery={getDelivery} stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} />
          </div>
          }
        })}
      </div>
    </div>
  );
};

export default SliderCardsDeliveries;
