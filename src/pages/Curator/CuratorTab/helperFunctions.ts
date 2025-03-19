import { getMyFeedbacks, type TMyFeedback } from '../../../api/feedbackApi';
import { getCuratorDeliveries, TCuratorDelivery, ICuratorDeliveries, getDeliveryListConfirmedForCurator, type TDeliveryListConfirmedForCurator  } from '../../../api/apiDeliveries';
import { getTasksCurator, type ITask, getTaskListConfirmedForCurator, type TTasksConfirmedForCurator } from '../../../api/apiTasks';
import { getRouteSheetAssignments, type IRouteSheetAssignments } from '../../../api/apiRouteSheetAssignments';


  ////активация доставки куратором
  async function requestTaskConfirmedList(token:string|null, setArrayListOfConfirmedVolTask:React.Dispatch<React.SetStateAction<TTasksConfirmedForCurator[]|null>>) {
    if (token) {
      try {
        const result: TTasksConfirmedForCurator[] = await getTaskListConfirmedForCurator(token);
        if (result) {
          console.log(result, "requestTaskConfirmedList curator tab")
          setArrayListOfConfirmedVolTask(result)
        }
      } catch (err) {
        console.log("requestTaskConfirmedList CuratorTab has failed")
     }
   } 
  }

   ////активация доставки куратором
   async function requestDeliveryConfirmedList(token:string|null, setArrayListOfConfirmedVol:React.Dispatch<React.SetStateAction<TDeliveryListConfirmedForCurator[]|null>>) {
    if (token) {
      try {
        const result: TDeliveryListConfirmedForCurator[] = await getDeliveryListConfirmedForCurator(token);
        if (result) {
          console.log(result , "requestDeliveryConfirmedList curator tab")
          setArrayListOfConfirmedVol(result)
        }
      } catch (err) {
        console.log("requestDeliveryConfirmedList CuratorTab has failed")
     }
   } 
  }

async function getMyCuratorDeliveries(token:string|null, setCuratorActiveDeliveries:React.Dispatch<React.SetStateAction<TCuratorDelivery[]>>, setCuratorInProcessDeliveries:React.Dispatch<React.SetStateAction<TCuratorDelivery[]>>, setCuratorCompletedDeliveries:React.Dispatch<React.SetStateAction<TCuratorDelivery[]>> ) {
  const activeDeliveries: TCuratorDelivery[] = [];
  const inProcessDeliveries: TCuratorDelivery[] = [];
  const myCompletedDeliveries: TCuratorDelivery[] = [];
  if (token) {
    try {
     let result: ICuratorDeliveries = await getCuratorDeliveries(token);
    if (result) { 
      result['активные доставки'].forEach((i: TCuratorDelivery) => { activeDeliveries.push(i) });
      setCuratorActiveDeliveries(activeDeliveries)/// запоминаем результат
      localStorage.setItem(`curator_active_del_for_curator_tab`, JSON.stringify(activeDeliveries))
     ////////////////////////
      result['выполняются доставки'].forEach((i: TCuratorDelivery) => { inProcessDeliveries.push(i) });
      setCuratorInProcessDeliveries(inProcessDeliveries)/// запоминаем результат
      localStorage.setItem(`curator_inProcess_del_for_curator_tab`, JSON.stringify(inProcessDeliveries))
      /////////////////////
      result['завершенные доставки'].forEach((i: TCuratorDelivery) => { myCompletedDeliveries.push(i) })
      setCuratorCompletedDeliveries(myCompletedDeliveries)
      localStorage.setItem(`curator_completed_del_for_curator_tab`, JSON.stringify(myCompletedDeliveries))
    }
}catch (err) {
  console.log(err, "getMyCuratorDeliveries CuratorPage fail")
}
    }
  }

  async function getMyCuratorTasks(token:string|null,  setCurtorTasks:React.Dispatch<React.SetStateAction<ITask[]>>) {
    if (token) {
      try {
        let result = await getTasksCurator(token);
        if (result) {
         let filtered = result.filter(task => {
            if (task.is_completed) {
            let timeDiff = Math.abs(+new Date() - +new Date(task.end_date));
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(diffDays <= 5) return task
            } else {
              return task
            }
         })
          setCurtorTasks(filtered)
          localStorage.setItem(`curator_tasks_for_curator_tab`, JSON.stringify(filtered))
        } 
      } catch (err) {
        console.log(err)
      }
    }
}
  
 async function getAllMyFeedbacks(token:string|null,  currentUser:any, setCompletedDeliveryFeedbacks:React.Dispatch<React.SetStateAction<number[]>>, setCompletedTaskFeedbacks:React.Dispatch<React.SetStateAction<number[]>> ) {
  if (token) {
    try {
      let result:TMyFeedback[] = await getMyFeedbacks(token);
      if (result) {
        let allMySubmitedFeedbacksForCompletedDeliveries: number[] = []
        let allMySubmitedFeedbacksForCompletedTasks: number[] = [];

        result.filter(i=>i.user == currentUser?.id).forEach(i => {
          if (typeof i.delivery == 'number' && i.type == 'completed_delivery_curator') {
            allMySubmitedFeedbacksForCompletedDeliveries.push(i.delivery)
          } else if (typeof i.task == 'number' && i.type == 'completed_task_curator') {
            allMySubmitedFeedbacksForCompletedTasks.push(i.task)
          }
        })
        setCompletedDeliveryFeedbacks(allMySubmitedFeedbacksForCompletedDeliveries)
        setCompletedTaskFeedbacks(allMySubmitedFeedbacksForCompletedTasks)
      }
    } catch (err) {
      console.log("getAllMyFeedbacks volunteer tab has failed")
  }
}
}


////запрашиваем все записанные на волонтеров маршрутные листы
async function requestAllRouteSheetsAssignments(
  token: string | null,
  setAllAssignedRouteSheets: React.Dispatch<
    React.SetStateAction<IRouteSheetAssignments[]>
  >,
) {
  if (token) {
    try {
      const response: IRouteSheetAssignments[] =
        await getRouteSheetAssignments(token);
      if (response) {
        // console.log(response, "requestAllRouteSheetsAssignments CuratorTab")
        setAllAssignedRouteSheets(response);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export {getMyCuratorDeliveries, getMyCuratorTasks, getAllMyFeedbacks, requestDeliveryConfirmedList, requestTaskConfirmedList, requestAllRouteSheetsAssignments}