
import React, {useState, useEffect} from 'react'
import Points from "../../../components/ui/Points/Points";
import ActionsVolunteer from "../../../components/ActionsVolunteer/ActionsVolunteer";
//import DetailedInfo from "../../../components/DetailedInfo/DetailedInfo";
//import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import FilterPromotions from "../../../components/FilterPromotions/FilterPromotions";
import { Modal } from '../../../components/ui/Modal/Modal';
import { getAllPromotions, type IPromotion } from '../../../api/apiPromotions';


// type TBankTabProps = {
//   role: "curator" | "volunteer"
// }

const BankTab:React.FC = () => {

  const [openFilter, setOpenFilter] = useState(false);
  const [promotionsAll, setPromotionsAll] = useState<IPromotion[]>([]); //// абсолютно все доступные промоушены

  async function reqAllPromotions() {
     let allPromotinsArr: IPromotion[] = [];
    try {
      allPromotinsArr = await getAllPromotions();
    } catch (err) {
      console.error(err, 'reqAllPromotions has failed, BankTab');
    } finally {
      if (allPromotinsArr.length > 0) {
        setPromotionsAll(allPromotinsArr);
      }
    }
  }
  /////запрашиваем города один раз при загрузке страницы
  useEffect(() => {
    reqAllPromotions();
  }, []); 


  return (
    <>
      <div className="mt-2 mb-4">
        <div className="w-[360px] h-[130px] flex flex-col justify-between">
        <Points points={10} />
        <ActionsVolunteer visibleActions={["Пригласить друга"]} showThemeToggle={false}/>
        </div>

        <div className='h-[258px] bg-light-gray-white rounded-2xl mt-1' >
          <div className='flex justify-between ml-4 mr-[14px] pt-[20px]'>
            <h1 className="font-gerbera-h1 text-light-gray-black">Обменять баллы</h1>
          <img src='src/assets/icons/filter.svg' onClick={()=>{setOpenFilter(true)}} className='cursor-pointer'/>
          </div>
          
           <SliderCardsPromotions promotions={promotionsAll}/>
        </div>
   
        <Modal isOpen={openFilter} onOpenChange={setOpenFilter}>
           <FilterPromotions onClose={()=>{}} onOpenDatePicker={()=>{}} />
        </Modal>

      
       </div>
    </>
  )
}

export default BankTab