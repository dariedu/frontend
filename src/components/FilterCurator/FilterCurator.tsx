import React, { useState } from 'react';
import { CheckboxElementRight } from '../ui/CheckboxElement/CheckboxElementRight';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface FilterCuratorProps {
  onClose: () => void;
}

const FilterCurator: React.FC<FilterCuratorProps> = ({ onClose }) => {
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleApplyFilters = () => {
    setFiltersApplied(true);
    console.log('Фильтры применены');

    onClose();
  };

  return (
    <div>
      {/* Фильтры */}
      <div className="space-y-4 ">
        {/* Фильтр за период */}
        <div className="font-gerbera-sub2 flex justify-between items-center text-light-gray-black-text">
          <span>За период</span>
          {/* Закрытие окна по клику на иконку */}
          <ChevronRightIcon
            className="text-light-gray-5 w-6 h-6 cursor-pointer"
            // onClick={onClose}
          />
        </div>

        {/* Фильтр Благотворительные доставки */}
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black">
            Благотворительные доставки
          </span>
        </CheckboxElementRight>

        {/* Фильтр Другие добрые дела */}
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black">
            Другие добрые дела
          </span>
        </CheckboxElementRight>

        {/* Фильтр Мероприятия */}
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black">
            Мероприятия
          </span>
        </CheckboxElementRight>

        {/* Фильтр По локации */}
        <CheckboxElementRight>
          <span className="font-gerbera-sub2 text-light-gray-black">
            По локации
          </span>
        </CheckboxElementRight>
      </div>

      {/* Кнопка Применить */}
      <div className="mt-6 flex justify-center">
        <button className="btn-B-GreenDefault" onClick={handleApplyFilters}>
          Применить
        </button>
      </div>
    </div>
  );
};

export default FilterCurator;
