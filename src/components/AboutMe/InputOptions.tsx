import React from 'react';
import Tick from './../../assets/icons/greenTickForCalendar.svg?react'

export type T = number | string;

interface IInputOptionsProps {
  options: [number, string][] | string[][]
  clicked: boolean
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
  choiceMade: T
  setChoiceMade: React.Dispatch<React.SetStateAction<T>>
  setButtonActive:React.Dispatch<React.SetStateAction<boolean>>
}

const InputOptions: React.FC<IInputOptionsProps> = ({
  options,
  clicked,
  setClicked,
  choiceMade,
  setChoiceMade,
  setButtonActive
}) => {
  function handleClick(
    clicked: boolean,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (clicked == false) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }
  //

  return  (
    <div
      data-testid="hiddenDiv"
      className={
        clicked
          ? 'bg-light-gray-white dark:bg-light-gray-7-logo rounded-2xl '
          : 'bg-light-gray-white w-full dark:bg-light-gray-7-logo rounded-2xl '
      }
      onClick={e => {
        e.stopPropagation();
        handleClick(clicked, setClicked);
      }}
    >
      <p
        data-testid="choice"
        className={ 
        clicked
        ? 'px-4 py-[18px] h-[54px] text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3 text-left w-full bg-light-gray-1 dark:bg-light-gray-6 rounded-t-2xl'
        : 'px-4 py-[18px] h-[54px] text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3 text-left w-full bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl'
      }>
        {
          options.filter(opt => {
            if (opt[0] == choiceMade) return opt;
          })[0][1]
        }
      </p>
      <div
        className={
          clicked
            ? 'bg-light-gray-1 w-full dark:bg-light-gray-6 flex flex-col h-[230px] rounded-b-2xl overflow-y-scroll text-left mt-1 '
            : 'hidden'
        }
      >
        {options
          .sort(
            (
              a: [number, string] | string[],
              b: [number, string] | string[],
            ) => {
              return a[1]
                .toLocaleLowerCase()
                .localeCompare(b[1].toLocaleLowerCase());
            },
          )
          .map((opt: [number, string] | string[], i: number) => {
            return (
              choiceMade == opt[0] ? (
                <div  key={i} className= 'flex list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
                  <Tick />
                  <li
                    className='ml-4'
                    onClick={() => { setChoiceMade(opt[0]); setButtonActive(true) } }
                >   
                {opt[1]}
              </li>
                </div>
                
              ) : (
              <div  key={i} 
              className='ml-6 list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
                    <li className='ml-4' onClick={() => { setChoiceMade(opt[0]); setButtonActive(true) }}>
              {opt[1]}
              </li>  
              </div>
              )
             
            );
          })}
      </div>
    </div>
  );
};

export default InputOptions;
