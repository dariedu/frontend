import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import { TPromotionCategory } from '../../../api/apiPromotions';

type TCheckElementProps = {
  onClickFunc: (obj: TPromotionCategory) => void;
  obj: TPromotionCategory;
  children: ReactNode;
  checked: boolean;
};

export const CheckboxElementRight: React.FC<TCheckElementProps> = ({
  onClickFunc,
  obj,
  children,
  checked,
}) => {
  return checked ? (
    <div className="flex justify-between w-full items-center text-light-gray-5 ">
      {children}
      <Checkbox.Root
        className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center dark:bg-light-gray-5"
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
    <div className="flex justify-between w-full items-center  ">
      {children}
      <Checkbox.Root
        className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center dark:bg-light-gray-5"
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
