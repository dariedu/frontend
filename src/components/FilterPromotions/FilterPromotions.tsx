import React from 'react';
import { CheckboxElementRight } from '../ui/CheckboxElement/CheckboxElementRight';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface IFilterPromotions {
  onClose: () => void;
  onOpenDatePicker?: () => void;
}

const FilterPromotions: React.FC<IFilterPromotions> = ({
  onClose,
  onOpenDatePicker,
}) => {
  return (
    <div className='w-[360px] h-[330px] bg-light-gray-white rounded-t-2xl px-4 pt-6 pb-8' onClick={e=>{e.stopPropagation()}}>
      {/* Фильтры */}
      <div className="h-[212px] flex flex-col justify-between">
        {/* Фильтр за период */}
        <div className="font-gerbera-sub2 flex justify-between items-center text-light-gray-black-text h-9">
          <span>За период</span>
          {/* Открытие окна выбора даты по клику на иконку */}
          <ChevronRightIcon
            className="text-light-gray-2  w-6 h-6 cursor-pointer mr-3"
            onClick={onOpenDatePicker} // Открываем InputDate
          />
        </div>

  
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center">
          Кино
          </span>
        </CheckboxElementRight>

  
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center">
          Экскурсии
          </span>
        </CheckboxElementRight>


        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center">
          Концерты
          </span>
        </CheckboxElementRight>

        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center">
          Медиа
          </span>
        </CheckboxElementRight>

        
      </div>

      {/* Кнопка Применить */}
      <div className="mt-6 flex justify-center">
        <button className="btn-B-GreenDefault" onClick={onClose}>
          Применить
        </button>
      </div>
    </div>
  );
};

export default FilterPromotions;
