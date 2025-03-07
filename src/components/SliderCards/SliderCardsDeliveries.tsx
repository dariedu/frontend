import React from 'react';
import CardDelivery from '../ui/Cards/CardTask/CardDelivery';
import { type IDelivery } from '../../api/apiDeliveries';
import './../../components/ui/Cards/CardPromotion/SliderCardStyles.css'


type TSliderCardsDeliveriesProps = {
  deliveries: IDelivery[]
  myDeliveries: IDelivery[]
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  stringForModal: string
  takeDeliverySuccess: boolean
  setTakeDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>
  setTakeDeliverySuccessDateName:React.Dispatch<React.SetStateAction<string>>;
      setDeliveryForReservation:React.Dispatch<React.SetStateAction<IDelivery|undefined>>;
      setTakeDeliveryModal:React.Dispatch<React.SetStateAction<boolean>>;
}


const SliderCardsDeliveries: React.FC<TSliderCardsDeliveriesProps> = ({deliveries, myDeliveries, switchTab,  stringForModal, takeDeliverySuccess, setTakeDeliverySuccess, setTakeDeliverySuccessDateName, setDeliveryForReservation, setTakeDeliveryModal }) => {

  let arrOfMyDeliveriesId: number[] = [];
  myDeliveries.forEach(i => arrOfMyDeliveriesId.push(i.id));
  
  return (
    <div className="pt-3 w-full max-w-[500px]">
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-full max-w-[500px] pl-4 space-x-2 pr-4"
      >
    
        {deliveries.sort((a,b)=>{return +new Date(a.date)- +new Date(b.date)}).map((delivery: IDelivery) => {
          if (!arrOfMyDeliveriesId.includes(delivery.id)) {
            return <div key={delivery.id} className="">
            <CardDelivery delivery={delivery} canBook={true} switchTab={switchTab}  stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} setTakeDeliverySuccessDateName={setTakeDeliverySuccessDateName} setDeliveryForReservation={setDeliveryForReservation} setTakeDeliveryModal={setTakeDeliveryModal}  />
          </div>
          } else {
            return <div key={delivery.id} className="" >
            <CardDelivery delivery={delivery} canBook={false} switchTab={switchTab}  stringForModal={stringForModal} takeDeliverySuccess={takeDeliverySuccess} setTakeDeliverySuccess={setTakeDeliverySuccess} setTakeDeliverySuccessDateName={setTakeDeliverySuccessDateName} setDeliveryForReservation={setDeliveryForReservation} setTakeDeliveryModal={setTakeDeliveryModal}  />
          </div>
          }
        })}
      </div>
    </div>
  );
};

export default SliderCardsDeliveries;
