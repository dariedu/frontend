
import React, {useState, useEffect, useContext} from 'react'
import Points from "../../../components/ui/Points/Points";
import SliderCardsPromotions from "../../../components/ui/Cards/CardPromotion/SliderCardsPromotions";
import FilterPromotions from "../../../components/FilterPromotions/FilterPromotions";
import { Modal } from '../../../components/ui/Modal/Modal';
import {  type IPromotion, type TPromotionCategory} from '../../../api/apiPromotions';
import { UserContext } from '../../../core/UserContext';
import ConfirmModal from '../../../components/ui/ConfirmModal/ConfirmModal';
import Filter from "./../../../assets/icons/filter.svg?react"
import { TokenContext } from '../../../core/TokenContext';
import Bread from './../../../assets/icons/bread.svg?react'
import { getPromoListNotConfirmed } from '../../../components/NavigationBar/helperFunctions';
import { reqAllPromotions, reqMyPromotions, redeemPromotion, requestPromotionsCategories, cancelPromotion} from './helperFunctions';


const BankTab:React.FC = () => {

  const [openFilter, setOpenFilter] = useState(false);
  const [promotionsAll, setPromotionsAll] = useState<IPromotion[]>([]); //// абсолютно все доступные промоушены не включая забронированные мной

  const [promotionsMy, setPromotionsMy] = useState<IPromotion[]>([]); //// все мои забронированные промоушены

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
   //записываем ошибку при отмене поощрения
  const [cancelPromotionErr, setCancelPromotionErr] = useState<string>('')
  const [cancelError, setCancelError] = useState<boolean>(false);
 
  const [allPromoNotConfirmed, setAllPromoNotConfirmed] = useState<number[]|null>(null)

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
   ///// используем контекст токена
   const {token} = useContext(TokenContext);
  //  const token = tokenContext.token;
  ////// используем контекст


  useEffect(() => {
    getPromoListNotConfirmed (token, setAllPromoNotConfirmed)
}, [])
  

  /////запрашиваем категории промоушенов один раз при загрузке страницы
  useEffect(() => {
    requestPromotionsCategories(token, setPpromotionCategory) 
  }, []); 

 /////обновляем промоушены каждый раз при броинровании или отмене промоушена
  useEffect(() => {
    reqAllPromotions(token, setPromotionsAll)
    reqMyPromotions(token, setPromotionsMy)
  }, [cancelPromotionSuccessName, redeemPromotionSuccessName]); 


  return (
    <>
      <div className="mt-1 mb-4 flex flex-col pb-4 overflow-y-auto overflow-x-hidden h-fit w-full max-w-[500px]">
        <div className="w-full max-w-[500px] h-fit flex flex-col justify-between ">
          {userPoints !== undefined && userPoints !== null? (
          <Points points={Number(userPoints)} />
          ) : (<p className='flex items-center justify-between p-4 bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-white rounded-[16px] shadow w-full max-w-[500px] h-[60px]'>
              Данные по заработанным баллам временно недоступны
          </p>)}
        {/* <ActionsVolunteer visibleActions={["Пригласить друга"]} showThemeToggle={false}/> */}
        </div>
        <div className='flex flex-col h-fit mb-16 '>
          <div className='h-[258px] bg-light-gray-white rounded-2xl mt-1  dark:bg-light-gray-7-logo ' >
          <div className='flex justify-between mr-[14px] pt-[20px]'>
            <h1 className="font-gerbera-h1 text-light-gray-black dark:text-light-gray-white px-4">Обменять баллы</h1>
              {promotionsAll.length == 0 || promotionCategory.length == 0 ? " " : (
                <Filter onClick={()=>{setOpenFilter(true)}} className='cursor-pointer rounded-full bg-light-gray-1 fill-[#0A0A0A] dark:bg-light-gray-6 dark:fill-[#F8F8F8]'/>
            )}
          
          </div>
            {promotionsAll.length == 0 ? (<div className='flex flex-col w-full items-center mt-[44px]'>
              <Bread className='fill-[#000000] dark:fill-[#F8F8F8] mb-3'/>
            <p className='dark:text-light-gray-1 w-56 '>Скоро тут появятся интересные предложения</p>
          </div>) : (
             <SliderCardsPromotions filterCategory={filterCategories} promotions={promotionsAll} optional={true} reserved={false} makeReservationFunc={redeemPromotion} setRedeemPromotionSuccessName={setRedeemPromotionSuccessName}
              setRedeemPromotionSuccess={setRedeemPromotionSuccess}
              setRedeemPromotionErr={setRedeemPromotionErr}
                  setError={setError}
                  setCancelPromotionSuccess={setCancelPromotionSuccess}
                  setCancelPromotionSuccessName={setCancelPromotionSuccessName}
                  setCancelPromotionErr={setCancelPromotionErr}
                  setCancelError={setCancelError}
                  allPromoNotConfirmed={allPromoNotConfirmed}
                /> 
          )}
        </div>
        <div className='h-[258px] bg-light-gray-white rounded-2xl mt-1  dark:bg-light-gray-7-logo' >
          <div className='flex justify-between  mr-[14px] pt-[20px]'>
            <h1 className="font-gerbera-h1 text-light-gray-black dark:text-light-gray-white px-4">Мои планы</h1>
            </div>{promotionsMy.length == 0 ? 
              (<div className='flex flex-col w-full items-center justify-center mt-16 '>
                <Bread className='fill-[#000000] dark:fill-[#F8F8F8] w-[100px]'/>
            </div>)
            : (<SliderCardsPromotions promotions={promotionsMy} optional={false} reserved={true} cancelPromotion={cancelPromotion} setRedeemPromotionSuccessName={setRedeemPromotionSuccessName}
              setRedeemPromotionSuccess={setRedeemPromotionSuccess}
              setRedeemPromotionErr={setRedeemPromotionErr}
                setError={setError}
                setCancelPromotionSuccess={setCancelPromotionSuccess}
                setCancelPromotionSuccessName={setCancelPromotionSuccessName}
                setCancelPromotionErr={setCancelPromotionErr}
                setCancelError={setCancelError}
                allPromoNotConfirmed={allPromoNotConfirmed}/>)}
          </div>
          </div>
 </div>
        <Modal isOpen={openFilter} onOpenChange={setOpenFilter}>
          <FilterPromotions categories={promotionCategory} onOpenChange={setOpenFilter} setFilter={setFilterCategories} filtered={filterCategories} handleCategoryChoice={handleCategoryChoice} />
        </Modal>
      <ConfirmModal isOpen={error} onOpenChange={setError} onConfirm={() => { setError(false); setRedeemPromotionErr("") }} title={redeemPromotionErr} description="" confirmText="Закрыть" isSingleButton={true} />
      <ConfirmModal isOpen={cancelError} onOpenChange={setCancelError} onConfirm={() => { setCancelError(false); setCancelPromotionErr("") }} title={cancelPromotionErr} description="" confirmText="Закрыть" isSingleButton={true} />
        <ConfirmModal isOpen={redeemPromotionSuccess} onOpenChange={setRedeemPromotionSuccess} onConfirm={() => { setRedeemPromotionSuccess(false); setRedeemPromotionSuccessName('') }} title={<p>Отлично! <br/>Вы забронировали {redeemPromotionSuccessName}.</p>} description="" confirmText="Закрыть" isSingleButton={true} />
        <ConfirmModal isOpen={cancelPromotionSuccess} onOpenChange={setCancelPromotionSuccess} onConfirm={() => { setCancelPromotionSuccess(false); setCancelPromotionSuccessName('') }} title={`Участие в мероприятии ${cancelPromotionSuccessName} успешно отменено`} description="" confirmText="Закрыть" isSingleButton={true} />
       
    </>
  )
}

export default BankTab