import {
  type IDelivery,
  getDeliveryById,
  TCuratorDelivery,
  postDeliveryComplete,
  postDeliveryActivate,
  type TVolunteerForDeliveryAssignments,
  type TDeliveryListConfirmedForCurator,
} from '../../api/apiDeliveries';
import { type IRouteSheet, getRouteSheetById } from '../../api/routeSheetApi';
import {
  // getRouteSheetAssignments,
  getRouteSheetAssignmentsByDeliveryId,
  type IRouteSheetAssignments,
} from '../../api/apiRouteSheetAssignments';
import { TDeliveryFilter } from './NearestDeliveryCurator';
import { IfilteredRouteSheet } from '../RouteSheetsCurator/helperFunctions';

function filterVolList(
  arrayListOfConfirmedVol: TDeliveryListConfirmedForCurator[] | null,
  curatorDelivery: TCuratorDelivery,
  setListOfConfirmedVol: React.Dispatch<React.SetStateAction<number[] | null>>,
) {
  if (arrayListOfConfirmedVol && arrayListOfConfirmedVol.length > 0) {
    const listOfVolForDel: number[] = [];
    const filtered: TDeliveryListConfirmedForCurator[] =
      arrayListOfConfirmedVol.filter(i => {
        return i.delivery == curatorDelivery.id_delivery;
      });
    filtered.forEach(i => {
      listOfVolForDel.push(i.volunteer[0]);
    });
    setListOfConfirmedVol(listOfVolForDel);
  }
}

async function requestMyDelivery(
  token: string | null,
  curatorDelivery: TCuratorDelivery,
  setDelivery: React.Dispatch<React.SetStateAction<IDelivery | undefined>>,
  setDeliveryDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  setListOfVolunteers: React.Dispatch<
    React.SetStateAction<TVolunteerForDeliveryAssignments[]>
  >,
) {
  if (token) {
    try {
      const result: IDelivery = await getDeliveryById(
        token,
        curatorDelivery.id_delivery,
      );
      if (result) {
        if (result.is_completed) {
          let timeDiff = Math.abs(+new Date() - +new Date(result.date));
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if (diffDays <= 5) {
            setDelivery(result);
          }
        } else {
          setDelivery(result);
        }
        setDeliveryDate(new Date(Date.parse(result.date) + 180 * 60000));
        curatorDelivery.volunteers.map(vol => {
          if (vol.photo && !vol.photo.includes('https')) {
            vol.photo = vol.photo.replace('http', 'https');
          }
        });
        setListOfVolunteers(curatorDelivery.volunteers);
      }
    } catch (err) {
      console.log('requestMyDelivery() NearestDeliveryCurator has failed');
    }
  }
}

////активация доставки куратором
async function requestDeliveryActivate(
  token: string | null,
  deliveryId: number,
  setCurrentStatus: React.Dispatch<React.SetStateAction<TDeliveryFilter>>,
  setActivateDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (token) {
    try {
      const result: IDelivery = await postDeliveryActivate(token, deliveryId);
      if (result) {
        setCurrentStatus('active');
        setActivateDeliverySuccess(true);
      }
    } catch (err) {
      console.log('requestDeliveryActivate, NearestDeliveryCurator has failed');
    }
  }
}

////завершение доставки куратором
async function requestDeliveryComplete(
  token: string | null,
  deliveryId: number,
  setCurrentStatus: React.Dispatch<React.SetStateAction<TDeliveryFilter>>,
  setCompleteDeliverySuccess: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (token) {
    try {
      const result: IDelivery = await postDeliveryComplete(token, deliveryId);
      if (result) {
        setCurrentStatus('completed');
        setCompleteDeliverySuccess(true);
      }
    } catch (err) {
      console.log('requestDeliveryComplete, NearestDeliveryCurator has failed');
    }
  }
}



//// 4. запрашиваем все маршрутные листы по отдельности только у активной или доставки в процессе
function requestEachMyRouteSheet(
  token: string | null,
  deliveryFilter: TDeliveryFilter,
  curatorDelivery: TCuratorDelivery,
  setRouteSheets: React.Dispatch<React.SetStateAction<IRouteSheet[]>>,
) {
  let routesArr: IRouteSheet[] = [];
  if (token && (deliveryFilter == 'active' || deliveryFilter == 'nearest')) {
    Promise.allSettled(
      curatorDelivery.id_route_sheet.map(routeS => {
        return getRouteSheetById(token, routeS);
      }),
    )
      .then(responses =>
        responses.forEach((result, num) => {
          if (result.status == 'fulfilled') {
            routesArr.push(result.value);
          }
          if (result.status == 'rejected') {
            console.log(`${num} routeSheet was not fetched`);
          }
        }),
      )
      .finally(() => {
        setRouteSheets(routesArr);
        //  console.log(routesArr, "routesArr")
      });
  }
}
// interface IRouteSheetAssignments {
//   id: number
//   route_sheet: number
//   volunteer: number[]
//   delivery: number
//   volunteersFullNames:string[]
//   telegramNiks:string[]
//   }

///проверяем назначен ли волонтер на конкретный маршрутный лист и добавляем к объекту маршрутного листа volunteerFullName
function findAssignedRouteSheets(
  routeSheetsData: IRouteSheet[],
  assignedRouteSheets: IRouteSheetAssignments[],
  listOfVolunteers: TVolunteerForDeliveryAssignments[],
  setFiltered: React.Dispatch<React.SetStateAction<IfilteredRouteSheet[]>>,
  // setFilteredSuccess: React.Dispatch<React.SetStateAction<boolean>>
) {
  
   const routeSheetsWithVName: IfilteredRouteSheet[] = [];/// финальный массив который вернет этацункция
  routeSheetsData.forEach(i => routeSheetsWithVName.push(i));//// переношу все маршрутные листы в отдельный массив для дальнейших модификаций

  //// перебираем массив назначенным маршрутных листов, добавляю туда полные имена и телеграм айди волонтеров
  assignedRouteSheets.forEach(route => {
    route.volunteer.forEach(vol => {
       listOfVolunteers.forEach(assVol => {
        if (vol == assVol.id) {
          !route.volunteersFullNames?.includes(`${assVol.name} ${assVol.last_name}`) && route.volunteersFullNames?.push(`${assVol.name} ${assVol.last_name}`)
          !route.telegramNiks?.includes(assVol.tg_username) && route.telegramNiks?.push(assVol.tg_username)
          }
        })
      })
  })
  
//// перебираем маршрутные листы добавляем к ним верные айди, полное имя и телеграм ник волонтера
  routeSheetsWithVName.forEach(route => {
    route.volunteers = [];//опустошаем аррэй с волонтерами до начала манипуляций
    const correspRouteVol = assignedRouteSheets.find(i => i.route_sheet == route.id)
    if (correspRouteVol?.volunteer && correspRouteVol.volunteersFullNames && correspRouteVol.telegramNiks) {
      route.volunteers = correspRouteVol.volunteer;
      route.volunteerFullName = correspRouteVol.volunteersFullNames;
      route.telegramNik = correspRouteVol.telegramNiks;
    }
  });
    //  console.log( routeSheetsWithVName, "routeSheetsData routeSheetsWithVName")
    setFiltered(routeSheetsWithVName);
    // setFilteredSuccess(true)
  // }
}

////запрашиваем все записанные на волонтеров маршрутные листы
async function requestRouteSheetsAssignmentsByDelivery(
  token: string | null,
  curatorDelivery: TCuratorDelivery,
  setAssignedRouteSheets: React.Dispatch<
    React.SetStateAction<IRouteSheetAssignments[]>
  >,
  // setReqAssignedRouteSheetsSuccess: React.Dispatch<
  //   React.SetStateAction<boolean>
  // >,
) {
// console.log("request requestRouteSheetsAssignmentsByDelivery")
  if (token) {
    try {
      const response: IRouteSheetAssignments[] = await getRouteSheetAssignmentsByDeliveryId(token, curatorDelivery.id_delivery);
      if (response) {
      //  console.log(response, 'route assignments by id')
        let filtered = response
          .filter(i => {
            return i.volunteer.length > 0;
          })
          .sort((a, b) => {
            return a.route_sheet - b.route_sheet;
          });
        
        //сортируем массив так, чтобы не было повторяющихся экземпляров записей волонтера,
        // запихиваем всех волонтеров в один экземпляр по айди маршрутного листа на конкретной доставке
        const arrWithArrayOfVolunteers: IRouteSheetAssignments[] = [];
        if (filtered.length > 0) {
          for (let i = 0; i <= filtered.length - 1; i++) {
            if (i == 0) {
              filtered[i].volunteersFullNames = [];
              filtered[i].telegramNiks =[]
              arrWithArrayOfVolunteers.push(filtered[i]);
            } else {
              if (arrWithArrayOfVolunteers[arrWithArrayOfVolunteers.length - 1].route_sheet == filtered[i].route_sheet) {
                arrWithArrayOfVolunteers[arrWithArrayOfVolunteers.length - 1].volunteer.push(filtered[i].volunteer[0]);
              } else {
                filtered[i].volunteersFullNames = [];
                filtered[i].telegramNiks =[]
                arrWithArrayOfVolunteers.push(filtered[i]);
              }
            }
          }
        }

        setAssignedRouteSheets(arrWithArrayOfVolunteers);
        // findAssignedRouteSheets(routeSheets, arrWithArrayOfVolunteers, listOfVolunteers, setFiltered, 
        //   setFilteredSuccess
        // );
        // setReqAssignedRouteSheetsSuccess(true);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export {
  requestMyDelivery,
  requestDeliveryActivate,
  requestDeliveryComplete,
  requestEachMyRouteSheet,
  requestRouteSheetsAssignmentsByDelivery,
  filterVolList,
  findAssignedRouteSheets
};
