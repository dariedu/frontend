import {
  IRouteSheet,
  assignRouteSheet, unassignRouteSheet, type TRouteSheetRequest, type TRouteSheetUnassignRequest
} from '../../api/routeSheetApi';
// import { type TVolunteerForDeliveryAssignments} from '../../api/apiDeliveries';
// import { type IRouteSheetAssignments} from '../../api/apiRouteSheetAssignments';
import {
  getPhotoReportsByDeliveryId,
  type TServerResponsePhotoReport,
  
} from '../../api/apiPhotoReports';

interface IfilteredRouteSheet extends IRouteSheet{
  volunteerFullName?: string[]
  telegramNik?: string[]
}
// ////проверяем назначен ли волонтер на конкретный маршрутный лист и добавляем к объекту маршрутного листа volunteerFullName
// function findAssignedRouteSheets(routeSheetsData: IRouteSheet[],
//   assignedRouteSheets: IRouteSheetAssignments[],
//   listOfVolunteers: TVolunteerForDeliveryAssignments[],
//   setFiltered: React.Dispatch<React.SetStateAction<IfilteredRouteSheet[]>>,
//   setFilteredSuccess: React.Dispatch<React.SetStateAction<boolean>>) {
  
//    const routeSheetsWithVName: IfilteredRouteSheet[] = [];/// финальный массив который вернет этацункция
//   routeSheetsData.forEach(i => routeSheetsWithVName.push(i));//// переношу все маршрутные листы в отдельный массив для дальнейших модификаций

//   //// перебираем массив назначенным маршрутных листов, добавляю туда полные имена и телеграм айди волонтеров
//   assignedRouteSheets.forEach(route => {
//     route.volunteer.forEach(vol => {
//        listOfVolunteers.forEach(assVol => {
//         if (vol == assVol.id) {
//           !route.volunteersFullNames?.includes(`${assVol.name} ${assVol.last_name}`) && route.volunteersFullNames?.push(`${assVol.name} ${assVol.last_name}`)
//           !route.telegramNiks?.includes(assVol.tg_username) && route.telegramNiks?.push(assVol.tg_username)
//           }
//         })
//       })
//   })
  
// //// перебираем маршрутные листы добавляем к ним верные айди, полное имя и телеграм ник волонтера
//   routeSheetsWithVName.forEach(route => {
//     route.volunteers = [];//опустошаем аррэй с волонтерами до начала манипуляций
//     const correspRouteVol = assignedRouteSheets.find(i => i.route_sheet == route.id)
//     if (correspRouteVol?.volunteer && correspRouteVol.volunteersFullNames && correspRouteVol.telegramNiks) {
//       route.volunteers = correspRouteVol.volunteer;
//       route.volunteerFullName = correspRouteVol.volunteersFullNames;
//       route.telegramNik = correspRouteVol.telegramNiks;
//     }
//   });
//     //  console.log( routeSheetsWithVName, "routeSheetsData routeSheetsWithVName")
//     setFiltered(routeSheetsWithVName);
//     setFilteredSuccess(true)
//   // }
// }


///////// записываем маршрутный лист на волонтера
  async function onVolunteerAssign(volunteerIds: number[], deliveryId: number, routeSheetId: number,  token:string|null, setTitle:React.Dispatch<React.SetStateAction<string|JSX.Element>>, setOpenModal:React.Dispatch<React.SetStateAction<boolean>>, setAssignVolunteerSuccess:React.Dispatch<React.SetStateAction<boolean>>) {
    let object: TRouteSheetRequest = {
      volunteer_ids: volunteerIds,
      delivery_id: deliveryId,
      routesheet_id:routeSheetId
    }
    setAssignVolunteerSuccess(false)
    if (token) {
      try {
        let result = await assignRouteSheet(token, object)
        if (result == true) {
          if (volunteerIds.length == 2) {
            setTitle("Волонтёры успешно назначены на маршрут!")
           
          } else {
           setTitle("Волонтёр успешно назначен на маршрут!") 
          }
          //  requestRouteSheetsAssignments(token, curatorDelivery, setAssignedRouteSheets, setReqAssignedRouteSheetsSuccess);
          setOpenModal(true)
          setAssignVolunteerSuccess(true)
        }
      } catch (err) {
        setTitle("Упс, что - то пошло не так. Попробуйте позже")
       setOpenModal(true)
      }
    }
  }

//    /////// записываем маршрутный лист на волонтера
   async function onVolunteerUnassign(volunteerIds: number[], deliveryId: number, routeSheetId: number, token:string|null, setTitle:React.Dispatch<React.SetStateAction<string|JSX.Element>>, setOpenModal:React.Dispatch<React.SetStateAction<boolean>>, setUnassignVolunteerSuccess:React.Dispatch<React.SetStateAction<boolean>>) {
    setUnassignVolunteerSuccess(false)
       const fullFilledArr: boolean[] = [];
     if (token) {
       Promise.allSettled(  
         volunteerIds.map((id) => {
          let object: TRouteSheetUnassignRequest = {
            volunteer_id: id,
            delivery_id: deliveryId,
            routesheet_id:routeSheetId
          }
             return unassignRouteSheet(token, object);
           }),
         )
           .then(responses =>
             responses.forEach((result, num) => {
               if (result.status == 'fulfilled') {
                fullFilledArr.push(result.value);
               }
               if (result.status == 'rejected') {
                 console.log(`${volunteerIds[num]} was not usassigned`);
               }
             }),
           )
         .finally(() => {
           if (volunteerIds.length == 2 && fullFilledArr.length == 2) {
            setTitle("Оба волонтера успешно сняты с маршрута!")
             setOpenModal(true)
             setUnassignVolunteerSuccess(true);
           } else if (volunteerIds.length == 1 && fullFilledArr.length == 1) {
            setTitle("Волотнтёр успешно снят с маршрута!")
            setOpenModal(true)
            setUnassignVolunteerSuccess(true)
           } else if ((volunteerIds.length == 2 && fullFilledArr.length == 0) || (volunteerIds.length == 1 && fullFilledArr.length == 0)) {
             setTitle("Упс, что - то пошло не так. Попробуйте позже.")
             setOpenModal(true)
           } else if (volunteerIds.length == 2 && fullFilledArr.length == 1) {
             setUnassignVolunteerSuccess(true)
             setTitle("Упс, что - то пошло не так. Одного из волонтёров не удалось снять с маршрута. Обновите страницу и попробуйте позже.")
             setOpenModal(true)
            }
          //  console.log(fullFilledArr, "fullFilledArr")
           });
       }
  //    } else {
       
  //  }
    //  let object:TRouteSheetUnassignRequest = {
    //   volunteer_ids: volunteerIds,
    //   delivery_id: deliveryId,
    //   routesheet_id:routeSheetId
    // }
    // if (token) {
    //   try {
    //     let result = await unassignRouteSheet(token, object)
    //     if (result == true) {
    //       setTitle("Волонтер успешно снят с маршрута!")
    //       setOpenModal(true)
    //       setUnassignVolunteerSuccess(true)
    //     }
    //   } catch (err) {
    //     setTitle("Упс, что - то пошло не так. Попробуйте позже")
    //     setOpenModal(true)
    //   }
    // }
  }

async function requestPhotoReports(token: string|null, deliveryId:number, setMyPhotoReports:React.Dispatch<React.SetStateAction<TServerResponsePhotoReport[]>>) {
      if (token) {
        try {
          let result = await getPhotoReportsByDeliveryId(token, deliveryId);
          // console.log(result, `photo report by deliveryid ${deliveryId}`)
          setMyPhotoReports(result);
          localStorage.setItem(`curator_del_${deliveryId}`, JSON.stringify(result))
        } catch (err) {
          console.log(err, 'getPhotoReports has failed RouteSheetCurator');
        }
      }
    }
  
  
export {
  // findAssignedRouteSheets,
  onVolunteerAssign, onVolunteerUnassign, requestPhotoReports, type IfilteredRouteSheet
}