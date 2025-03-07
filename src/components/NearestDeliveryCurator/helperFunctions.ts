import { type IDelivery,  getDeliveryById, TCuratorDelivery, postDeliveryComplete, postDeliveryActivate, type TVolunteerForDeliveryAssignments, type TDeliveryListConfirmedForCurator} from '../../api/apiDeliveries';
import { type IRouteSheet, getRouteSheetById} from '../../api/routeSheetApi';
import { getRouteSheetAssignments, type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import {TDeliveryFilter} from './NearestDeliveryCurator'




  function filterVolList(arrayListOfConfirmedVol:TDeliveryListConfirmedForCurator[]|null, curatorDelivery:TCuratorDelivery,  setListOfConfirmedVol:React.Dispatch<React.SetStateAction<number[]|null>>) {
    if (arrayListOfConfirmedVol && arrayListOfConfirmedVol.length > 0) {
      console.log(arrayListOfConfirmedVol, "arrayListOfConfirmedVol nearestDeliveryCurator")
      const filtered: TDeliveryListConfirmedForCurator[] = arrayListOfConfirmedVol.filter(i => { return i.delivery == curatorDelivery.id_delivery });
      setListOfConfirmedVol(filtered[0]?.volunteer)
    }
  }


  async function requestMyDelivery(token:string|null, curatorDelivery:TCuratorDelivery, setDelivery:React.Dispatch<React.SetStateAction<IDelivery | undefined>>, setDeliveryDate:React.Dispatch<React.SetStateAction<Date | undefined>>,setListOfVolunteers:React.Dispatch<React.SetStateAction<TVolunteerForDeliveryAssignments[]>> ) { 
     if (token) {
       try {
         const result: IDelivery = await getDeliveryById(token, curatorDelivery.id_delivery);      
         if (result) {
          if (result.is_completed) { 
            let timeDiff = Math.abs(+new Date() - +new Date(result.date));
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays <= 5) { setDelivery(result) }
          } else {
             setDelivery(result)
          }
           setDeliveryDate(new Date(Date.parse(result.date) + 180 * 60000))
           curatorDelivery.volunteers.map(vol => {
             if (vol.photo && !vol.photo.includes('https')) {
               vol.photo = vol.photo.replace('http', 'https')
             }
           })
           setListOfVolunteers(curatorDelivery.volunteers)
         }
       } catch (err) {
         console.log("requestMyDelivery() NearestDeliveryCurator has failed")
          }
     }
}
  

   ////активация доставки куратором
    async function requestDeliveryActivate(token:string|null, deliveryId:number, setCurrentStatus:React.Dispatch<React.SetStateAction<TDeliveryFilter>>, setActivateDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>) {
      if (token) {
        try {
          const result: IDelivery = await postDeliveryActivate(token, deliveryId);
          if (result) {
            setCurrentStatus('active')
            setActivateDeliverySuccess(true)
          }
        } catch (err) {
          console.log("requestDeliveryActivate, NearestDeliveryCurator has failed")
       }
     } 
    }

    ////завершение доставки куратором
      async function requestDeliveryComplete(token:string|null,  deliveryId:number, setCurrentStatus:React.Dispatch<React.SetStateAction<TDeliveryFilter>>,setCompleteDeliverySuccess:React.Dispatch<React.SetStateAction<boolean>>) {
        if (token) {
          try {
            const result: IDelivery = await postDeliveryComplete(token, deliveryId);
            if (result) {
              setCurrentStatus('completed')
              setCompleteDeliverySuccess(true)
            }
          } catch (err) {
            console.log("requestDeliveryComplete, NearestDeliveryCurator has failed")
         }
       } 
}
      


 //// 4. запрашиваем все маршрутные листы по отдельности только у активной или доставки в процессе
 function requestEachMyRouteSheet(token:string|null,  deliveryFilter:TDeliveryFilter, curatorDelivery: TCuratorDelivery,setRouteSheets:React.Dispatch<React.SetStateAction<IRouteSheet[]>> ) {
   let routesArr: IRouteSheet[] = [];
   if (token &&(deliveryFilter == 'active' || deliveryFilter == "nearest")) {
     Promise.allSettled(curatorDelivery.id_route_sheet.map(routeS => { return getRouteSheetById(token, routeS) }))
         .then(responses => responses.forEach((result, num) => {
           if (result.status == "fulfilled") {
             routesArr.push(result.value)
           }
           if (result.status == "rejected") {
             console.log(`${num} routeSheet was not fetched`)
           }
         })).finally(() => {
           setRouteSheets(routesArr);
          //  console.log(routesArr, "routesArr")
         }
         )
   }
  
}
  

  ////запрашиваем все записанные на волонтеров маршрутные листы
    async function requestRouteSheetsAssignments(token:string|null, curatorDelivery: TCuratorDelivery,setAssignedRouteSheets:React.Dispatch<React.SetStateAction<IRouteSheetAssignments[]>>, setAssignedRouteSheetsSuccess:React.Dispatch<React.SetStateAction<boolean>>) {
      if (token) {
        try {
          const response:IRouteSheetAssignments[] = await getRouteSheetAssignments(token);
          if (response) {
            let filtered = response.filter(i => i.delivery == curatorDelivery.id_delivery)
            setAssignedRouteSheets(filtered)
            setAssignedRouteSheetsSuccess(true);
          }
        } catch (err) {
          console.log(err)
        }
      }
}
    
export {requestMyDelivery, requestDeliveryActivate,requestDeliveryComplete, requestEachMyRouteSheet, requestRouteSheetsAssignments, filterVolList}