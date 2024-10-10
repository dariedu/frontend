import React from 'react';
import { CheckboxElementRight } from '../ui/CheckboxElement/CheckboxElementRight';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface IFilterCuratorProps {
  onClose: () => void;
  onOpenDatePicker?: () => void;
}

const FilterCurator: React.FC<IFilterCuratorProps> = ({
  onClose,
  onOpenDatePicker,
}) => {
  return (
    <div>
      {/* Фильтры */}
      <div className="space-y-4 ">
        {/* Фильтр за период */}
        <div className="font-gerbera-sub2 flex justify-between items-center text-light-gray-black-text">
          <span>За период</span>
          {/* Открытие окна выбора даты по клику на иконку */}
          <ChevronRightIcon
            className="text-light-gray-5 w-6 h-6 cursor-pointer"
            onClick={onOpenDatePicker} // Открываем InputDate
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
        <button className="btn-B-GreenDefault" onClick={onClose}>
          Применить
        </button>
      </div>
    </div>
  );
};

export default FilterCurator;
