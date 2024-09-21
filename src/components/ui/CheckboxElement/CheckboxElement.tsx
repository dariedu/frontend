
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';



type TCheckElementProps = {
  children: ReactNode
}


export const CheckboxElement: React.FC<TCheckElementProps> = ({children}) => {
  return (
    <div className="flex justify-center w-[336px] items-center text-light-gray-5 ">
            <Checkbox.Root className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center mr-4">
              <Checkbox.Indicator>
                <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 bg-light-brand-green" />
              </Checkbox.Indicator>
      </Checkbox.Root>
      {children}
          </div>
  )
}