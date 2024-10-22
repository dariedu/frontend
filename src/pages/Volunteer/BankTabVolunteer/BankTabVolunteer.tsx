// import MyPoints from "../../../components/MyPoints/MyPoints";
import Points from '../../../components/ui/Points/Points';
// import DetailedInfo from "../../../components/DetailedInfo/DetailedInfo";
// import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import SliderCardsPromotions from '../../../components/ui/Cards/CardPromotion/SliderCardsPromotions';
import inviteIcon from '../../../assets/icons/invite_friend.svg';

const BankTabVolunteer = () => {
  return (
    <>
      <div className="mt-2 mb-4 min-h-[80vh]">
        <div className="w-[360px] h-[130px] flex flex-col justify-between">
          <Points points={10} />

          {/* Блок "Пригласить друга" */}
          <a
            href="#"
            className="flex items-center justify-between p-4 bg-light-gray-white rounded-[16px] shadow hover:bg-gray-50 h-[66px]"
          >
            <div className="flex items-center space-x-4">
              <img
                src={inviteIcon}
                alt="Пригласить друга"
                className="w-[42px] h-[42px]"
              />
              <span className="font-gerbera-h3 text-light-gray-black m-0">
                Пригласить друга
              </span>
              <span className="font-gerbera-sub2 text-light-brand-green w-[129px]">
                +3 балла
              </span>
            </div>
          </a>
        </div>
        <SliderCardsPromotions />
      </div>
    </>
  );
};

export default BankTabVolunteer;
