import React from 'react';
import { CheckboxElementCurator } from '../ui/CheckboxElement/CheckboxElementCurator';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { TTaskCategory } from '../../api/apiTasks';

interface IFilterCuratorProps {
  categories: TTaskCategory[];
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: React.Dispatch<React.SetStateAction<number[]>>;
  filtered: number[];
}

const FilterCurator: React.FC<IFilterCuratorProps> = ({
  categories,
  onOpenChange,
  setFilter,
  filtered,
}) => {
  const handleCategoryChoice = (categoryId: number) => {
    setFilter(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <div
      className="w-full max-w-[500px] h-fit bg-light-gray-white rounded-t-2xl px-4 pt-6 pb-8 dark:bg-light-gray-7-logo"
      onClick={e => e.stopPropagation()}
    >
      <div className="h-fit flex flex-col justify-between">
        <div className="font-gerbera-sub2 flex justify-between items-center text-light-gray-black-text h-9 dark:text-light-gray-1">
          <span>За период</span>
          <ChevronRightIcon className="text-light-gray-2  w-6 h-6 cursor-pointer mr-7 dark:text-light-gray-5" />
        </div>
        <div className="filterPromotionsClass h-fit max-h-40 overflow-y-auto">
          {categories.map(cat => (
            <CheckboxElementCurator
              key={cat.id}
              obj={cat}
              onClickFunc={() => handleCategoryChoice(cat.id)}
              checked={filtered.includes(cat.id)}
            >
              <span className="font-gerbera-sub2 text-light-gray-black h-9 flex items-center dark:text-light-gray-1">
                {cat.name}
              </span>
            </CheckboxElementCurator>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          className="btn-B-GreenDefault"
          onClick={() => onOpenChange(false)}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default FilterCurator;
