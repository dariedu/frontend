
import React, {useState, useEffect, useContext} from 'react'
import Points from "../../../components/ui/Points/Points";
//import ActionsVolunteer from "../../../components/ActionsVolunteer/ActionsVolunteer";
import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import FilterPromotions from "../../../components/FilterPromotions/FilterPromotions";
import { Modal } from '../../../components/ui/Modal/Modal';
import { getAllPromotions, getMyPromotions, getPromotionsCategories, postPromotionCancel, postPromotionRedeem, type IPromotion, type TPromotionCategory} from '../../../api/apiPromotions';
import { UserContext } from '../../../core/UserContext';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';


const BankTab:React.FC = () => {

  const [openFilter, setOpenFilter] = useState(false);
  const [promotionsAll, setPromotionsAll] = useState<IPromotion[]>([]); //// абсолютно все доступные промоушены
  const [promotionsMy, setPromotionsMy] = useState<IPromotion[]>([]); //// все мои забронированные промоушены
  const [sortedPromotions, setSortedPromotions]= useState<IPromotion[]>([]); //// promotionsAll минус promotionsMy
  const [promotionCategory, setPpromotionCategory] = useState<TPromotionCategory[]>([]) /// запрашиваем категории промоушенов
  const [filterCategories, setFilterCategories] = useState<TPromotionCategory[]>([]) /// устанавливаем категории для фильтра
  //записываем ошибку при бронировании поощрения
  const [redeemPromotionErr, setRedeemPromotionErr] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  ////// записываем результат бронирования поощрения
  const [redeemPromotionSuccess, setRedeemPromotionSuccess] = useState<boolean>(false);
  const [redeemPromotionSuccessName, setRedeemPromotionSuccessName] = useState<string>('');
  ////записываем результат отмены поощрения
  const [cancelPromotionSuccess, setCancelPromotionSuccess] = useState<boolean>(false);
  const [cancelPromotionSuccessName, setCancelPromotionSuccessName] = useState<string>('');

  //// функция вызывается при нажатии на фильтр
  function handleCategoryChoice(obj: TPromotionCategory) {
    let copy = Object.assign([], filterCategories);
    if (copy.includes(obj)) {
    let filtered = copy.filter(i=>{return i!=obj})
    setFilterCategories(filtered)
    } else {
      setFilterCategories([...filterCategories, obj])
    } 
  }

   ////// используем контекст юзера, чтобы вывести количество доступных баллов 
    const userValue = useContext(UserContext);
    const userPoints = userValue.currentUser?.point;
    const token = userValue.token;
   ////// используем контекст
  
  
  async function reqAllPromotions() {
     let allPromotinsArr: IPromotion[] = [];
    try {
      allPromotinsArr = await getAllPromotions();
    } catch (err) {
      console.error(err, 'reqAllPromotions has failed, BankTab');
    } finally {
      if (allPromotinsArr.length > 0) {
        let avaliableProm = allPromotinsArr.filter(i => i.available_quantity >= 1);
        let activeProm = avaliableProm.filter(i => i.is_active == true)
        setPromotionsAll(activeProm);
      }
    }
  }

  async function reqMyPromotions() {
    let allPromotinsArr: IPromotion[] = [];
   try {
     allPromotinsArr = await getMyPromotions(token);
   } catch (err) {
     console.error(err, 'reqMyPromotions has failed, BankTab');
   } finally {
     if (allPromotinsArr.length > 0) {
       let avaliableProm = allPromotinsArr.filter(i => i.available_quantity >= 1);
       let activeProm = avaliableProm.filter(i => i.is_active == true)
       setPromotionsMy(activeProm);
     }
    }
 }
 
  async function requestPromotionsCategories() {
    let categories: TPromotionCategory[] = [];
   try {
     categories = await getPromotionsCategories();
   } catch (err) {
     console.error(err, 'requestPromotionsCategories has failed, BankTab');
   } finally {
     if (categories.length > 0) {
      setPpromotionCategory(categories);
     }
   }
 }
  /////запрашиваем категории промоушенов один раз при загрузке страницы
  useEffect(() => {
    requestPromotionsCategories(); 
  }, []); 

 /////обновляем промоушены каждый раз при броинровании или отмене промоушена
  useEffect(() => {
    reqAllPromotions();
    reqMyPromotions();
  }, [redeemPromotionSuccessName, cancelPromotionSuccessName]); 

/////сортируем промоушены, когда получили их с сервера
  useEffect(() => {
    sortPromotions()
  }, [promotionsAll, promotionsMy]); 

  function sortPromotions() {
    let allAvaliableButWithoutBookedPromotions: IPromotion[] = [];
    if (promotionsAll.length > 0) {
      if (promotionsMy.length > 0) {
         let arr:number[] = [];
      promotionsMy.forEach(i => { arr.push(i.id) })
        allAvaliableButWithoutBookedPromotions = promotionsAll.filter(
          (prom) => {
            if (!arr.includes(prom.id)) { return prom }
          });
        setSortedPromotions(allAvaliableButWithoutBookedPromotions)
      } else {
        setSortedPromotions(promotionsAll)
      }
    }
  } 

 async function redeemPromotion(chosenId:number) {
  let promotionForReservation = promotionsAll.filter((prom) => prom.id == chosenId)
   let result: boolean = false;
   try {
     const response = await postPromotionRedeem(chosenId, promotionForReservation[0], token);
     if (response) {
       result = true;
       setRedeemPromotionSuccessName(promotionForReservation[0].name)
       setRedeemPromotionSuccess(true);
     }
   } catch (err) {
     if (err == "Error: Недостаточно баллов для приобретения"){
       setRedeemPromotionErr("Недостаточно баллов для приобретения")
       setError(true)
     } else {
       console.error(err, 'redeemPromotion has failed, BankTab');
       setRedeemPromotionErr("Что-то пошло не так, попробуйте позже")
       setError(true)
     }
   } finally {
     return result
   }
  }


  async function cancelPromotion(chosenId:number) {
    let promotionForCancellation = promotionsAll.filter((prom) => prom.id == chosenId)
    let result: boolean = false;
    try {
      const response = await postPromotionCancel(chosenId, promotionForCancellation[0], token);
      if (response) {
        setCancelPromotionSuccess(true)
        setCancelPromotionSuccessName(promotionForCancellation[0].name)
      }
    } catch (err) {
     console.error(err, 'cancelPromotion has failed, BankTab');
    } finally {
      return result
    }
  }


  
  return (
    <>
      <div className="mt-2 mb-4 flex flex-col pb-4 overflow-y-auto overflow-x-hidden">
        <div className="w-[360px] h-fit flex flex-col justify-between">
          {userPoints !== undefined || userPoints !== null ? (
          <Points points={Number(userPoints)} />
          ) : (<p className='flex items-center justify-between p-4 bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-white rounded-[16px] shadow w-[360px] h-[60px]'>
              Данные по заработанным баллам временно недоступны
          </p>)}
        {/* <ActionsVolunteer visibleActions={["Пригласить друга"]} showThemeToggle={false}/> */}
        </div>
        <div className='flex flex-col h-fit mb-16'>
          <div className='h-[258px] bg-light-gray-white rounded-2xl mt-1 px-4 dark:bg-light-gray-7-logo ' >
          <div className='flex justify-between ml-4 mr-[14px] pt-[20px]'>
            <h1 className="font-gerbera-h1 text-light-gray-black dark:text-light-gray-white">Обменять баллы</h1>
            {sortedPromotions.length == 0 || promotionCategory.length == 0 ? " " : (
              <img src='./../src/assets/icons/filter.svg' onClick={()=>{setOpenFilter(true)}} className='cursor-pointer'/>
            )}
          
          </div>
          {sortedPromotions.length == 0 ? (<div className='flex flex-col w-[300px] items-center mt-10 h-[100px] justify-between ml-4'>
            <img src="./../src/assets/icons/LogoNoTaskYet.svg" className='w-[100px]' />
            <p>Пока нет доступных поощрений</p>
          </div>) : (
             <SliderCardsPromotions filterCategory={filterCategories} promotions={sortedPromotions} optional={true} reserved={false} makeReservationFunc={redeemPromotion} /> 
          )}
        </div>
        <div className='h-[258px] bg-light-gray-white rounded-2xl mt-1 px-4 dark:bg-light-gray-7-logo' >
          <div className='flex justify-between ml-4 mr-[14px] pt-[20px]'>
            <h1 className="font-gerbera-h1 text-light-gray-black dark:text-light-gray-white">Мои планы</h1>
          </div>
          <SliderCardsPromotions promotions={promotionsMy} optional={false} reserved={true} cancelPromotion={cancelPromotion} />
          </div>
          </div>
 </div>
        
        <Modal isOpen={openFilter} onOpenChange={setOpenFilter}>
          <FilterPromotions categories={promotionCategory} onOpenChange={setOpenFilter} setFilter={setFilterCategories} filtered={filterCategories} handleCategoryChoice={handleCategoryChoice} />
        </Modal>
        <ConfirmModal isOpen={error} onOpenChange={setError} onConfirm={() => { setError(false); setRedeemPromotionErr("") }} title={redeemPromotionErr} description="" confirmText="Закрыть" isSingleButton={true} />
        <ConfirmModal isOpen={redeemPromotionSuccess} onOpenChange={setRedeemPromotionSuccess} onConfirm={() => { setRedeemPromotionSuccess(false); setRedeemPromotionSuccessName('') }} title={`Отлично! ${redeemPromotionSuccessName} у вас в календаре`} description="" confirmText="Закрыть" isSingleButton={true} />
        <ConfirmModal isOpen={cancelPromotionSuccess} onOpenChange={setCancelPromotionSuccess} onConfirm={() => { setCancelPromotionSuccess(false); setCancelPromotionSuccessName('') }} title={`Участие в мероприятии ${cancelPromotionSuccessName} успешно отменено`} description="" confirmText="Закрыть" isSingleButton={true} />
       
    </>
  )
}

export default BankTab