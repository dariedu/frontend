import { useState, useEffect} from 'react';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import Filter from './../../assets/icons/filter.svg?react';
import { Modal } from '../ui/Modal/Modal';
import { IDelivery } from '../../api/apiDeliveries';
import { ITask } from '../../api/apiTasks';
import Bread from './../../assets/icons/bread.svg?react'
import { IPromotion } from '../../api/apiPromotions';
import { combineAllNotConfirmed } from './helperFunctions';


  type TNotificationInfo = {
    objType: "task" | "delivery" | "promo"
    nameOrMetro: string
    addressOrInfo: string
    stringStart: string
    id: string
    timeString:string
}
  
interface INotifications {
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  allNotConfirmedToday: IDelivery[]
  setAllNotConfirmedToday: React.Dispatch<React.SetStateAction<IDelivery[]>>
  allNotConfirmedTomorrow: IDelivery[]
  setAllNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<IDelivery[]>>
  allTasksNotConfirmedToday: ITask[]
  setAllTasksNotConfirmedToday: React.Dispatch<React.SetStateAction<ITask[]>>
  allTasksNotConfirmedTomorrow: ITask[]
  setAllTasksNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<ITask[]>>
  allPromoNotConfirmedToday:IPromotion[]
  setAllPromoNotConfirmedToday:React.Dispatch<React.SetStateAction<IPromotion[]>>
  allPromoNotConfirmedTomorrow:IPromotion[]
  setAllPromoNotConfirmedTomorrow: React.Dispatch<React.SetStateAction<IPromotion[]>>
}

const Notifications: React.FC<INotifications> = ({
  onClose,
  open,
  allNotConfirmedToday,
  setAllNotConfirmedToday,
  allNotConfirmedTomorrow,
  setAllNotConfirmedTomorrow,
  allTasksNotConfirmedToday,
  setAllTasksNotConfirmedToday,
  allTasksNotConfirmedTomorrow,
  setAllTasksNotConfirmedTomorrow,
  allPromoNotConfirmedToday,
  setAllPromoNotConfirmedToday,
  allPromoNotConfirmedTomorrow,
  setAllPromoNotConfirmedTomorrow
}) => {

  console.log(setAllNotConfirmedToday,  setAllNotConfirmedTomorrow, setAllTasksNotConfirmedToday,  setAllTasksNotConfirmedTomorrow, setAllPromoNotConfirmedToday,  setAllPromoNotConfirmedTomorrow)

  
  const [allMyNotificationsToday, setAllMyNotificationsToday] = useState<TNotificationInfo[]>([]);
  const [allMyNotificationsTomorrow, setAllMyNotificationsTomorrow] = useState<TNotificationInfo[]>([]);
 
  useEffect(() => {
    combineAllNotConfirmed(allNotConfirmedToday,  allNotConfirmedTomorrow, allTasksNotConfirmedToday, allTasksNotConfirmedTomorrow, allPromoNotConfirmedToday, allPromoNotConfirmedTomorrow, setAllMyNotificationsToday, setAllMyNotificationsTomorrow)
  },[allNotConfirmedToday,  allNotConfirmedTomorrow, allTasksNotConfirmedToday, allTasksNotConfirmedTomorrow, allPromoNotConfirmedToday, allPromoNotConfirmedTomorrow ])

  
  console.log(allMyNotificationsToday, "allMyNotificationsToday")
  console.log(allMyNotificationsTomorrow, "allMyNotificationsTomorrow")

  return (
    <Modal isOpen={open} onOpenChange={onClose}>
      <div
        className="bg-light-gray-1 dark:bg-light-gray-black rounded-b-2xl w-full max-w-[500px] h-full flex flex-col items-center justify-start overflow-x-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-[4px] bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-full rounded-b-2xl h-[60px] min-h-[60px] px-4">
          <button onClick={() => onClose(false)}>
            <RightArrowIcon className="rotate-180 w-9 h-9 stroke-[#D7D7D7] dark:stroke-[#575757]" />
          </button>
          <div className="flex justify-between w-full items-center">
            <h2 className="text-light-gray-black dark:text-light-gray-1 ml-2">
              Уведомления
            </h2>
            <Filter
              // onClick={() => {
              //   setOpenFilter(true);
              // }}
              className="cursor-pointer rounded-full bg-light-gray-1 fill-[#0A0A0A] dark:bg-light-gray-6 dark:fill-[#F8F8F8]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden w-full px-4">
          {allMyNotificationsToday.length > 0 || allMyNotificationsTomorrow.length > 0 ? (
            <div>
              {allMyNotificationsToday.length > 0 && (
                <div className='flex flex-col'>
                 <div
                 className="w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6" >
                  Сегодня
                  </div>
                  {allMyNotificationsToday.map((past) => {
                        return (
                          <div
                            key={past.id}
                            className="flex flex-col items-center w-full max-w-[500px]"
                          >
                            <div
                              className="text-light-gray-6 h-fit w-full min-w-[328px] bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                            >
                              <div className=" flex flex-col justify-between mb-[6px]">
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.nameOrMetro}
                                </p>
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.stringStart}
                                </p>
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.addressOrInfo}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  }
            </div>
              )}
              {allMyNotificationsTomorrow.length > 0 && (
                <div className='flex flex-col'>
                 <div
                 className="w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6" >
                  Сегодня
                  </div>
                  {allMyNotificationsTomorrow.map((past) => {
                        return (
                          <div
                            key={past.id}
                            className="flex flex-col items-center w-full max-w-[500px]"
                          >
                            <div
                              className="text-light-gray-6 h-fit w-full min-w-[328px] bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                            >
                              <div className=" flex flex-col justify-between mb-[6px]">
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.nameOrMetro}
                                </p>
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.stringStart}
                                </p>
                                <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                                  {past.addressOrInfo}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  }
            </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-[50%]">
              <Bread className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
              <p className="font-gerbera-h2 text-light-gray-black dark:text-light-gray-1 mt-7 text-center">
                Пока нет заявок<br/>требующих вашего внимания
              </p>
            </div>
          )}
        </div>
        {/* <Modal isOpen={openFilter} onOpenChange={setOpenFilter} zIndex={true}>
        <FilterPromotions
          categories={filterCategoryOptions}
          onOpenChange={setOpenFilter}
          setFilter={setFilterCategories}
          filtered={filterCategories}
          handleCategoryChoice={handleCategoryChoiceFunc}
        />
      </Modal> */}
      </div>
    </Modal>
  );
};

export type { TNotificationInfo }
export default Notifications;
