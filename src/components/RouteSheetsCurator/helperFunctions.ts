import {
  IRouteSheet,
  assignRouteSheet, unassignRouteSheet, type TRouteSheetRequest
} from '../../api/routeSheetApi';
import { type TVolunteerForDeliveryAssignments} from '../../api/apiDeliveries';
import { type IRouteSheetAssignments } from '../../api/apiRouteSheetAssignments';
import {
  getPhotoReportsByDeliveryId,
  type TServerResponsePhotoReport,
  
} from '../../api/apiPhotoReports';

interface IfilteredRouteSheet extends IRouteSheet{
  volunteerFullName?: string
  telegramNik?: string
}
////проверяем назначен ли волонтер на конкретный маршрутный лист и добавляем к объекту маршрутного листа volunteerFullName
function findAssignedRouteSheets(routeSheetsData: IRouteSheet[],
  assignedRouteSheets: IRouteSheetAssignments[],
  listOfVolunteers: TVolunteerForDeliveryAssignments[],
  setFiltered: React.Dispatch<React.SetStateAction<IfilteredRouteSheet[]>>,
  setFilteredSuccess: React.Dispatch<React.SetStateAction<boolean>>) {
 
  let filteredRouteSId: number[] = [];
  const routeSheetsWithVName: IfilteredRouteSheet[]=[];
  routeSheetsData.forEach(i => routeSheetsWithVName.push(i));
  routeSheetsData.forEach((item) => filteredRouteSId.push(item.id));

  let final: { id: number, volunteerId: number[], volunteerFullName: string, telegramNik: string }[] = [];
  
  for (let i = 0; i < filteredRouteSId.length; i++){
    assignedRouteSheets.forEach(r => {
      if (r.route_sheet == filteredRouteSId[i])
        final.push({ id: r.route_sheet, volunteerId: r.volunteer, volunteerFullName: "", telegramNik:"" })
    });

    final.forEach(i => {
      listOfVolunteers.forEach(y => {
        if (y.id == i.volunteerId[0]) {
          i.volunteerFullName = `${y.name} ${y.last_name}`
          i.telegramNik = y.tg_username
        }
      })
    });
    
    final.forEach((i) => {
      routeSheetsWithVName.forEach((y => {
        if (y.id == i.id) {
          y.volunteerFullName = i.volunteerFullName
          y.telegramNik = i.telegramNik
     }
   }))
 })
    setFiltered(routeSheetsWithVName);
    setFilteredSuccess(true)
  }
}


// /////// записываем маршрутный лист на волонтера
  async function onVolunteerAssign(volunteerId: number, deliveryId: number, routeSheetId: number,  token:string|null, setAssignVolunteerSuccess:React.Dispatch<React.SetStateAction<boolean>>, setAssignVolunteerFail:React.Dispatch<React.SetStateAction<boolean>>) {
    let object:TRouteSheetRequest = {
      volunteer_id: volunteerId,
      delivery_id: deliveryId,
      routesheet_id:routeSheetId
    }
    if (token) {
      try {
        let result = await assignRouteSheet(token, object)
        if (result == true) {
        //  requestRouteSheetsAssignments(token, curatorDelivery, setAssignedRouteSheets, setReqAssignedRouteSheetsSuccess);
          setAssignVolunteerSuccess(true)
        }
      } catch (err) {
       setAssignVolunteerFail(true)
      }
    }
  }

//    /////// записываем маршрутный лист на волонтера
   async function onVolunteerUnassign(volunteerId: number, deliveryId: number, routeSheetId: number, token:string|null, setUnassignVolunteerSuccess:React.Dispatch<React.SetStateAction<boolean>>, setUnassignVolunteerFail:React.Dispatch<React.SetStateAction<boolean>>) {
    let object:TRouteSheetRequest = {
      volunteer_id: volunteerId,
      delivery_id: deliveryId,
      routesheet_id:routeSheetId
    }
    if (token) {
      try {
        let result = await unassignRouteSheet(token, object)
        if (result == true) {
        // requestRouteSheetsAssignments(token, curatorDelivery, setAssignedRouteSheets, setReqAssignedRouteSheetsSuccess);
        setUnassignVolunteerSuccess(true)
        }
      } catch (err) {
        setUnassignVolunteerFail(true)
      }
    }
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
  findAssignedRouteSheets,
  onVolunteerAssign, onVolunteerUnassign, requestPhotoReports, type IfilteredRouteSheet
}