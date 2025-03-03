


interface INotifications{

}

const Notifications: React.FC<INotifications> = ({


     ////функция чтобы волонтер отменил взятое доброе дело
// async function cancelTakenTask(task:ITask) {
//   const id: number = task.id;
// try {
//    if (token) {
//      let result: ITask = await postTaskRefuse(id, token);
//      if (result) {
//        const taskDate = new Date(Date.parse(task.start_date) + 180* 60000);
//        const date = taskDate.getUTCDate();
//        const month = getMonthCorrectEndingName(taskDate);
//        const hours = taskDate.getUTCHours() < 10 ? '0' + taskDate.getUTCHours() : taskDate.getUTCHours();
//        const minutes = taskDate.getUTCMinutes() < 10 ? '0' + taskDate.getUTCMinutes() : taskDate.getUTCMinutes();
//        const finalString = `\"${task.name.slice(0, 1).toLocaleUpperCase()+task.name.slice(1)}\", ${date} ${month}, ${hours}:${minutes}`;
//        setCancelTaskSuccessString(finalString);
//        setCancelTaskId(id)
//        setCancelTaskSuccess(true)
//   }
// }
// } catch (err) {
//   setCancelDeliveryFail(true)
//   console.log(err, "CalendarTabVolunteer cancelTakenTask has failed")
// }
  //   }
  
   ////функция чтобы волонтер отменил взятую доставку
// async function cancelTakenDelivery(delivery:IDelivery) {
//   const id: number = delivery.id;
// try {
//    if (token) {
//      let result: IDelivery = await postDeliveryCancel(token, id, delivery);
//      if (result) {
//       const deliveryDate = new Date(Date.parse(delivery.date) + 180*60000);
//        const date = deliveryDate.getUTCDate();
//        const month = getMonthCorrectEndingName(deliveryDate);
//        const hours = deliveryDate.getUTCHours() < 10 ? '0' + deliveryDate.getUTCHours() : deliveryDate.getUTCHours();
//        const minutes = deliveryDate.getUTCMinutes() < 10 ? '0' + deliveryDate.getUTCMinutes() : deliveryDate.getUTCMinutes();    
//        const subway = getMetroCorrectName(delivery.location.subway)
//        const finalString = `м. ${subway}, ${date} ${month}, ${hours}:${minutes}`;
//        setCancelDeliverySuccessString(finalString);  
//        setCancelId(id)
//        setCancelDeliverySuccess(true)
//   }
// }
// } catch (err) {
//   setCancelDeliveryFail(true)
//   console.log(err, "CalendarTabVolunteer cancelTakenDelivery has failed")
// }
//   }

}) => {
  return (<div>Notifications</div>)
}

export default Notifications;