import React, { useEffect, useContext, useState } from 'react';
import {   type IDelivery } from '../../api/apiDeliveries';
import {  type ITask } from '../../api/apiTasks';
import {  getBallCorrectEndingName,   getMetroCorrectName, } from '../helperFunctions/helperFunctions';
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
import LogoNoTaskYet from './../../assets/icons/LogoNoTaskYet.svg?react';
import { type IPromotion } from '../../api/apiPromotions';
import Filter from './../../assets/icons/filter.svg?react';
import { Modal } from '../ui/Modal/Modal';
import FilterPromotions from '../FilterPromotions/FilterPromotions';
import { TPromotionCategory } from '../../api/apiPromotions';
import { TokenContext } from '../../core/TokenContext';
import { getMyCuratorDeliveries, requestMyDelivery, getMyPastDeliveries, getMyPastTasks, getMyPastPromotions, combineAllPast, type IAllMyPast, filterCategoryOptions } from './helperFunctions';


interface IHistoryProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  isVolunteer: boolean;
}

const History: React.FC<IHistoryProps> = ({ onClose, isVolunteer }) => {


  let { token } = useContext(TokenContext); //// берем токен из токен контекст
  const [myPastDeliveries, setMyPastDeliveries] = useState<IDelivery[]>([]);
  const [myPastTasks, setMyPastTasks] = useState<ITask[]>([]);
  const [myPastPromotions, setMyPastPromotions] = useState<IPromotion[]>([]);
  const [allMyPastCombined, setAllMyPastCombined] = useState<IAllMyPast[]>(localStorage.getItem(`history`) !== null && localStorage.getItem(`history`) !== undefined ? JSON.parse(localStorage.getItem(`history`) as string) : []);
  const [mistakeDelivery, setMistakeDelivery] = useState(false);
  const [mistakeTask, setMistakeTask] = useState(false);
  const [mistakePromotion, setMistakePromotion] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [curatorCompletedDeliveries, setCuratorCompletedDeliveries] = useState<number[]>([]);
  const [curatorPastDeliveries, setCuratorPastDeliveries] = useState<IDelivery[]>([]);


  const [filterCategories, setFilterCategories] = useState<
    TPromotionCategory[]
  >([]); /// устанавливаем категории для фильтра

  //// функция вызывается при нажатии на фильтр
  function handleCategoryChoiceFunc(obj: TPromotionCategory) {
    let copy = Object.assign([], filterCategories);
    let idArr: number[] = [];
    if (copy && copy.length > 0) {
      copy.forEach((item: TPromotionCategory) => idArr.push(item.id));
    }
    if (idArr.includes(obj.id)) {
      let filtered = copy.filter((i: TPromotionCategory) => {
        if (i.id != obj.id) return i;
      });
      setFilterCategories(filtered);
    } else {
      setFilterCategories([...filterCategories, obj]);
    }
  }

  useEffect(() => {
    getMyCuratorDeliveries(token, isVolunteer, setCuratorCompletedDeliveries)
  }, [])

  
  useEffect(() => {
    requestMyDelivery(token, isVolunteer, curatorCompletedDeliveries, setCuratorPastDeliveries)
  }, [curatorCompletedDeliveries]);



  useEffect(() => {
    getMyPastDeliveries(token, setMyPastDeliveries, setMistakeDelivery);
  }, [mistakeDelivery]);

  useEffect(() => {
    getMyPastTasks(token, setMyPastTasks, setMistakeTask);
  }, [mistakeTask]);

  useEffect(() => {
    getMyPastPromotions(token, setMyPastPromotions, setMistakePromotion);
  }, [mistakePromotion]);

  useEffect(() => {
    combineAllPast(myPastPromotions, myPastDeliveries, curatorPastDeliveries, myPastTasks, setAllMyPastCombined);
    console.log(allMyPastCombined, "[allMyPastCombined")
  }, [myPastDeliveries, myPastTasks, curatorPastDeliveries]);

  return (
    <>
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
              История
            </h2>
            <Filter
              data-testid="filter"
              onClick={() => {
                setOpenFilter(true);
              }}
              className="cursor-pointer rounded-full bg-light-gray-1 fill-[#0A0A0A] dark:bg-light-gray-6 dark:fill-[#F8F8F8]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden w-full px-4">
          {allMyPastCombined.length > 0 ? (
            filterCategories && filterCategories.length > 0 ? (
              allMyPastCombined
                .filter(past => {
                  if (filterCategories.find(i => i.id == past.category.id))
                    return past;
                })
                .map((past, index) => {
                  return (
                    <div
                      key={index + 1000}
                      className="flex flex-col items-center w-full max-w-[500px]"
                    >
                      {index == 0 ? (
                        <div
                          key={index + past.dayMonthYearString}
                          className="w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6"
                        >
                          {past.dayMonthYearString}
                        </div>
                      ) : allMyPastCombined[index].dayMonthYearString ==
                        allMyPastCombined[index - 1].dayMonthYearString ? (
                        ''
                      ) : (
                        <div
                          key={index + past.dayMonthYearString}
                          className="w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6"
                        >
                          {past.dayMonthYearString}
                        </div>
                      )}

                      <div
                        className="text-light-gray-6 h-fit w-full min-w-[328px] bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                        key={past.id}
                      >
                        <div className="flex justify-between mb-[6px]">
                          <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                            {past.name}
                          </p>
                          <p
                            className={
                              past.plus
                                ? 'font-gerbera-sub2 text-light-brand-green'
                                : 'font-gerbera-sub2 text-light-error-red'
                            }
                          >
                            {past.plus ? '+ ' : '- '}
                            {past.points}{' '}
                            {getBallCorrectEndingName(past.points)}
                          </p>
                        </div>
                        {past.date ? (
                          <p className="font-gerbera-sub1 text-light-gray-5 mb-1 dark:text-light-gray-2">
                            {past.date}
                          </p>
                        ) : (
                          ''
                        )}
                        {past.subway ? (
                          <p className="font-gerbera-sub1  text-light-gray-5 dark:text-light-gray-2">
                            Ст. м. {getMetroCorrectName(past.subway)}
                          </p>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              allMyPastCombined.map((past, index) => {
                return (
                  <div
                    key={index + 1000}
                    className="flex flex-col items-center w-full max-w-[500px]"
                  >
                    {index == 0 ? (
                      <div
                        key={index + past.dayMonthYearString}
                        className="w-fit  flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6"
                      >
                        {past.dayMonthYearString}
                      </div>
                    ) : allMyPastCombined[index].dayMonthYearString ==
                      allMyPastCombined[index - 1].dayMonthYearString ? (
                      ''
                    ) : (
                      <div
                        key={index + past.dayMonthYearString}
                        className="w-fit flex justify-center items-center p-2 h-[21px] font-gerbera-sub1 rounded-2xl my-[10px] text-light-gray-8-text dark:text-light-gray-1 bg-light-gray-white dark:bg-light-gray-6"
                      >
                        {past.dayMonthYearString}
                      </div>
                    )}

                    <div
                      className="text-light-gray-6 h-fit w-full min-w-[328px] bg-light-gray-white rounded-2xl p-4 mb-4 dark:bg-light-gray-6"
                      key={past.id}
                    >
                      <div className="flex justify-between mb-[6px]">
                        <p className="font-gerbera-h3 dark:text-light-gray-1 w-[200px] h-fit">
                          {past.name}
                        </p>
                        <p
                          className={
                            past.plus
                              ? 'font-gerbera-sub2 text-light-brand-green'
                              : 'font-gerbera-sub2 text-light-error-red'
                          }
                        >
                          {past.plus ? '+ ' : '- '}
                          {past.points} {getBallCorrectEndingName(past.points)}
                        </p>
                      </div>
                      {past.date ? (
                        <p className="font-gerbera-sub1 text-light-gray-5 mb-1 dark:text-light-gray-2">
                          {past.date}
                        </p>
                      ) : (
                        ''
                      )}
                      {past.subway ? (
                        <p className="font-gerbera-sub1  text-light-gray-5 dark:text-light-gray-2">
                          Ст. м. {getMetroCorrectName(past.subway)}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-[50%]">
              <LogoNoTaskYet data-testid="logo_no_tasks_yet" className="fill-[#000000] dark:fill-[#F8F8F8] w-[100px]" />
              <p className="font-gerbera-h2 text-light-gray-black dark:text-light-gray-1 mt-7 text-center">
                Пока нет завершенных
                <br />
                добрых дел
              </p>
            </div>
          )}
        </div>
        <Modal isOpen={openFilter} onOpenChange={setOpenFilter} zIndex={true}>
          <FilterPromotions
            categories={filterCategoryOptions}
            onOpenChange={setOpenFilter}
            setFilter={setFilterCategories}
            filtered={filterCategories}
            handleCategoryChoice={handleCategoryChoiceFunc}
          />
        </Modal>
      </div>
    </>
  );
};

export default History;
