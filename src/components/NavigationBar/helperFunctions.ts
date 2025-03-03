import { getVolunteerDeliveries, type IDelivery, type IVolunteerDeliveries } from '../../api/apiDeliveries';
import { getMyTasksNoFilter,  type ITask } from '../../api/apiTasks';

////// используем контекст
 

async function getMyDeliveries(token:string, setMyCurrent:React.Dispatch<React.SetStateAction<IDelivery[]>>) {
  const current: IDelivery[] = [];
  try {
     if (token) {
       let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
       if (result) {
         result['мои активные доставки'].forEach(i => { current.push(i) });
        //  current.filter(del => {del.date  })
         setMyCurrent(current);
         console.log(result, 'result navigation')
       }
  }
  } catch (err) {
    console.log(err, "NavigationBar getMyDeliveries has failed")
  }
}


 async function getAllMyTasks(token: string, setAllMyTasks:React.Dispatch<React.SetStateAction<ITask[]>>) {
  try {
    if (token) {
      let result: ITask[] = await getMyTasksNoFilter(token);
      if (result) {
      //    let filtered = result.filter(task => {
      // let timeDiff = Math.abs(+new Date() - +new Date(task.end_date));
      //   })
        setAllMyTasks(result)
        console.log(result, 'result navigation tasks')
      }
    }
  } catch (err) {
    console.log(err, "NavigationBar getMyTasks has failed")
  }
}

export {getAllMyTasks, getMyDeliveries}