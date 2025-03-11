import { getAllPromotions, getMyPromotions, getPromotionsCategories, postPromotionCancel, postPromotionRedeem, type IPromotion, type TPromotionCategory } from '../../../api/apiPromotions';


  async function reqAllPromotions(token:string|null, setPromotionsAll:React.Dispatch<React.SetStateAction<IPromotion[]>>) {
    try {
      if (token) {
        const allPromotinsArr = await getAllPromotions(token);
        if (allPromotinsArr) {
          allPromotinsArr.map(i => {
            if (i.picture && !(i.picture?.includes('https'))) {
             return i.picture = i.picture.replace('http', 'https')
            }
          })
          const filtered = allPromotinsArr.filter(i => { return i.available_quantity !== 0 }).sort((a, b) => {return +new Date(a.start_date) - +new Date(b.start_date)})
        setPromotionsAll(filtered);
        }
      }
    } catch (err) {
      console.error(err, 'reqAllPromotions has failed, BankTab');
    } 
  }


async function reqMyPromotions(token:string|null, setPromotionsMy:React.Dispatch<React.SetStateAction<IPromotion[]>>) {
    let myPromotinsArr: IPromotion[] = [];
    try {
      if (token) {
        myPromotinsArr = await getMyPromotions(token);
        if (myPromotinsArr) {
          let filtered = myPromotinsArr.filter(prom => { if (prom.is_active) return prom }).sort((a, b) => { return +new Date(a.start_date) - +new Date(b.start_date) });
          filtered.map(i => {
            if (i.picture && !(i.picture?.includes('https'))) {
              return i.picture = i.picture.replace('http', 'https')
              };
            })
      setPromotionsMy(filtered)
        }
     }
   } catch (err) {
     console.error(err, 'reqMyPromotions has failed, BankTab');
   } 
}

 async function requestPromotionsCategories(token:string|null,setPpromotionCategory:React.Dispatch<React.SetStateAction<TPromotionCategory[]>>) {
    let categories: TPromotionCategory[] = [];
    try {
      if (token) {
       categories = await getPromotionsCategories(token); 
     }
   } catch (err) {
     console.error(err, 'requestPromotionsCategories has failed, BankTab');
   } finally {
     if (categories.length > 0) {
      setPpromotionCategory(categories);
     }
   }
}
 
 async function redeemPromotion(promotion: IPromotion, token:string|null, setRedeemPromotionSuccessName:React.Dispatch<React.SetStateAction<string>>,setRedeemPromotionSuccess:React.Dispatch<React.SetStateAction<boolean>>, userValue:any, setRedeemPromotionErr: React.Dispatch<React.SetStateAction<string>>,setError:React.Dispatch<React.SetStateAction<boolean>> ) {
   const chosenId = promotion.id;
   try {
     if (token) {
       const response = await postPromotionRedeem(chosenId, promotion, token);
       if (response) {
        setRedeemPromotionSuccessName(promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1))
         setRedeemPromotionSuccess(true);
         if (userValue && userValue.currentUser) {
            userValue.currentUser.point = userValue.currentUser.point-promotion.price
         }
      }
     }
   } catch (err) {
     if (err == "Error: Недостаточно баллов для приобретения"){
       setRedeemPromotionErr("Недостаточно баллов для приобретения")
       setError(true)
       setRedeemPromotionSuccess(false);
     } else if (err == "Error: Вы уже приобрели этот поощрение") { 
       setRedeemPromotionErr("Вы уже приобрели это поощрение")
       setError(true)
       setRedeemPromotionSuccess(false);
     } else {
       setRedeemPromotionErr("Что-то пошло не так, попробуйте позже")
       setError(true)
       setRedeemPromotionSuccess(false);
     }
   } 
  }


  async function cancelPromotion(promotion: IPromotion, token:string|null,setCancelPromotionSuccess:React.Dispatch<React.SetStateAction<boolean>>,setCancelPromotionSuccessName:React.Dispatch<React.SetStateAction<string>>, userValue:any,setCancelPromotionErr:React.Dispatch<React.SetStateAction<string>>,setCancelError:React.Dispatch<React.SetStateAction<boolean>> ) {
    const chosenId = promotion.id;
    try {
      if (token) {
        const response = await postPromotionCancel(chosenId, token);
        if (response) {
        setCancelPromotionSuccess(true)
          setCancelPromotionSuccessName(promotion.name.slice(0, 1).toUpperCase() + promotion.name.slice(1))
          if (userValue && userValue.currentUser && userValue.currentUser.point >=0) {
            userValue.currentUser.point +=promotion.price
         }
      }
      }
    } catch (err) {
      setCancelPromotionErr("Что-то пошло не так, попробуйте позже")
      setCancelError(true)
      setCancelPromotionSuccess(false)
    } 
  }
 
export {reqAllPromotions, reqMyPromotions, requestPromotionsCategories, redeemPromotion, cancelPromotion}