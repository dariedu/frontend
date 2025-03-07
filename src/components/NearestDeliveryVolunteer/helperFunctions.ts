import { getRouteSheetById, type IRouteSheet } from '../../api/routeSheetApi';
import { getRouteSheetAssignments, type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import { IDelivery } from '../../api/apiDeliveries';

    ////запрашиваем все записанные на волонтеров маршрутные листы
    async function requestRouteSheetsAssignments(token:string|null, currentUser:any, delivery:IDelivery, setMyRouteSheet:React.Dispatch<React.SetStateAction<IRouteSheetAssignments[] | undefined>>) {
      if (token) {
        try {
          const response:IRouteSheetAssignments[] = await getRouteSheetAssignments(token);
          if (response) {
            let filtered = response.filter(i => i.volunteer == currentUser?.id && i.delivery == delivery.id && delivery.in_execution == true);
            if (filtered) {
              setMyRouteSheet(filtered)
           }
          }
        } catch (err) {
          console.log(err)
        }
      }
  }


     //// 4. запрашиваем все маршрутные листы по отдельности
  function requestEachMyRouteSheet(token:string|null, myRouteSheet:IRouteSheetAssignments[] | undefined, setRouteSheets: React.Dispatch<React.SetStateAction<IRouteSheet[] | undefined>>) {
  let routesArr: IRouteSheet[] = [];
    if (token && myRouteSheet) {
      Promise.allSettled(myRouteSheet.map(routeS => getRouteSheetById(token, routeS.route_sheet)))
        .then(responses => responses.forEach((result, num) => {
          if (result.status == "fulfilled") {
            routesArr.push(result.value)
          }
          if (result.status == "rejected") {
            console.log(`${num} routeSheet was not fetched`)
          }
        })).finally(() => { setRouteSheets(routesArr)}
        )
   }
 }


 export {requestRouteSheetsAssignments, requestEachMyRouteSheet}