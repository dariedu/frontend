import React from 'react';
import { CheckboxElementRight } from '../ui/CheckboxElement/CheckboxElementRight';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { type TPromotionCategory } from '../../api/apiPromotions';
import './filterPromotionsStyles.css';

interface IFilterPromotions {
  categories: TPromotionCategory[];
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: React.Dispatch<React.SetStateAction<TPromotionCategory[]>>;
  filtered: TPromotionCategory[];
  handleCategoryChoice: (cat: TPromotionCategory) => void;
}

const FilterPromotions: React.FC<IFilterPromotions> = ({
  categories,
  onOpenChange,
  setFilter,
  filtered,
  handleCategoryChoice,
}) => {
  return (
    <div
      className="w-[360px] h-fit bg-light-gray-white rounded-t-2xl px-4 pt-6 pb-8 dark:bg-light-gray-7-logo"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {/* Фильтры */}
      <div className="h-fit flex flex-col justify-between">
        {/* Фильтр за период */}
        <div className="font-gerbera-sub2 flex justify-between items-center text-light-gray-black-text h-9 dark:text-light-gray-1">
          <span>За период</span>
          {/* Открытие окна выбора даты по клику на иконку */}
          <ChevronRightIcon
            className="text-light-gray-2  w-6 h-6 cursor-pointer mr-7 dark:text-light-gray-5"
            // onClick={onOpenDatePicker} // Открываем InputDate
          />
        </div>
        <div className="filterPromotionsClass h-fit max-h-40 overflow-y-auto">
          {categories.map((cat, index) => {
            if (filtered.find(i => i.id == cat.id)) {
              return (
                <CheckboxElementRight
                  obj={cat}
                  onClickFunc={handleCategoryChoice}
                  checked={true}
                  key={index}
                >
                  <span
                    className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center dark:text-light-gray-1"
                    key={cat.id}
                  >
                    {cat.name.slice(0, 1).toUpperCase() + cat.name.slice(1)}
                  </span>
                </CheckboxElementRight>
              );
            } else {
              return (
                <CheckboxElementRight
                  obj={cat}
                  onClickFunc={handleCategoryChoice}
                  checked={false}
                  key={index}
                >
                  <span
                    className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center dark:text-light-gray-1"
                    key={cat.id}
                  >
                    {cat.name.slice(0, 1).toUpperCase() + cat.name.slice(1)}
                  </span>
                </CheckboxElementRight>
              );
            }
          })}
        </div>
      </div>
      {/* Кнопка Применить */}
      <div className="mt-6 flex justify-center">
        <button
          className="btn-B-GreenDefault"
          onClick={() => {
            onOpenChange(false);
            setFilter(filtered);
          }}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default FilterPromotions;
