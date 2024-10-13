//import MyPoints from "../../../components/MyPoints/MyPoints";
import Points from "../../../components/ui/Points/Points";
import ActionsVolunteer from "../../../components/ActionsVolunteer/ActionsVolunteer";
//import DetailedInfo from "../../../components/DetailedInfo/DetailedInfo";
//import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";


const BankTabVolunteer = () => {
  return (
    <>
      <div className="mt-2 mb-4">
        <div className="w-[360px] h-[130px] flex flex-col justify-between">
        <Points points={10} />
        <ActionsVolunteer visibleActions={["Пригласить друга"]} showThemeToggle={false}/>
        </div>
       <SliderCardsPromotions/>
       </div>
    </>
  )
}

export default BankTabVolunteer