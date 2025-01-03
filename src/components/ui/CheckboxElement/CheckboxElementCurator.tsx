import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import { TTaskCategory } from '../../../api/apiTasks';

type TCheckElementProps = {
  onClickFunc: (obj: TTaskCategory) => void;
  obj: TTaskCategory;
  children: ReactNode;
  checked: boolean;
};

export const CheckboxElementCurator: React.FC<TCheckElementProps> = ({
  onClickFunc,
  obj,
  children,
  checked,
}) => {
  return checked ? (
    <div className="flex justify-between w-[315px] items-center text-light-gray-5 ">
      {children}
      <Checkbox.Root
        className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center mr-4  dark:bg-light-gray-5"
        onClick={() => {
          onClickFunc(obj);
        }}
        defaultChecked
      >
        <Checkbox.Indicator>
          <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 bg-light-brand-green " />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  ) : (
    <div className="flex justify-between w-[315px] items-center  ">
      {children}
      <Checkbox.Root
        className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center mr-4 dark:bg-light-gray-5"
        onClick={() => {
          onClickFunc(obj);
        }}
      >
        <Checkbox.Indicator>
          <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 bg-light-brand-green" />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
};
