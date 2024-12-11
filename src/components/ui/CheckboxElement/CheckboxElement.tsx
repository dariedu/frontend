import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import React from 'react';



type TCheckElementProps = {
  children: JSX.Element;
  onCheckedChange?: () => void;
  checked?: boolean;
};

export const CheckboxElement: React.FC<TCheckElementProps> = ({
  onCheckedChange,
  children,
  checked = false,
}) => {
  return (
    <>
      {checked ? (
        <div className="flex justify-start w-full items-center text-light-gray-5 space-x-4">
          <Checkbox.Root
            className="bg-light-gray-1 dark:bg-light-gray-6 rounded-full w-6 h-6 min-h-6 min-w-6 flex justify-center"
            onCheckedChange={onCheckedChange}
            defaultChecked
          >
            <Checkbox.Indicator>
              <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 min-h-6 min-w-6 bg-light-brand-green" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          {children}
        </div>
      ) : (
        <div className="flex justify-start w-full items-center text-light-gray-5 space-x-4">
          <Checkbox.Root
            className="bg-light-gray-1 dark:bg-light-gray-6 rounded-full w-6 h-6 min-h-6 min-w-6 flex justify-center"
            onCheckedChange={onCheckedChange}
          >
            <Checkbox.Indicator>
              <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 min-h-6 min-w-6 bg-light-brand-green" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          {children}
        </div>
      )}
    </>
  );
};
