import React from 'react';
import './index.css';
import Tick from './../../assets/icons/greenTickForCalendar.svg?react'

export type T = number | string;

interface IInputOptionsProps {
  options: [number, string][] | string[][];
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  choiceMade: T;
  setChoiceMade: React.Dispatch<React.SetStateAction<T>>;
  style?: boolean;
}

const InputOptions: React.FC<IInputOptionsProps> = ({
  options,
  clicked,
  setClicked,
  choiceMade,
  setChoiceMade,
  style,
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

  return style ? (
    <div
      className={
        clicked
          ? 'bg-light-gray-1 dark:bg-light-gray-6 rounded-t-2xl z-100 w-[240px]'
          : 'bg-light-gray-1 dark:bg-light-gray-6 rounded-2xl w-[240px]'
      }
      onClick={e => {
        e.stopPropagation();
        handleClick(clicked, setClicked);
      }}
    >
      <p className="px-4 py-[18px] h-[54px] text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3 text-left">
        {
          options.filter(opt => {
            if (opt[0] == choiceMade) return opt;
          })[0][1]
        }
      </p>
      <div
        className={
          clicked
            ? 'bg-light-gray-1 dark:bg-light-gray-6 flex w-[240px] flex-col h-[108px] rounded-b-2xl overflow-y-scroll text-left z-200 absolute'
            : ' hidden'
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
                <div key={i} className= 'flex list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
                  <Tick />
                  <li
                    className='ml-4'
                onClick={() => setChoiceMade(opt[0])}
                >   
                {opt[1]}
              </li>
                </div>
                
              ) : (
              <div  key={i}
              className='ml-6 list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
              <li className='ml-4' onClick={() => setChoiceMade(opt[0])}>
              {opt[1]}
              </li>  
              </div>
              )
            );
          })}
      </div>
    </div>
  ) : (
    <div
      className={
        clicked
          ? 'bg-light-gray-1  dark:bg-light-gray-6 rounded-t-2xl z-100'
          : 'bg-light-gray-1 w-full dark:bg-light-gray-6 rounded-2xl'
      }
      onClick={e => {
        e.stopPropagation();
        handleClick(clicked, setClicked);
      }}
    >
      <p className="px-4 py-[18px] w-fit h-[54px] text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3 text-left">
        {
          options.filter(opt => {
            if (opt[0] == choiceMade) return opt;
          })[0][1]
        }
      </p>
      <div
        className={
          clicked
            ? 'bg-light-gray-1 w-full dark:bg-light-gray-6 flex flex-col h-[108px] rounded-b-2xl overflow-y-scroll text-left absolute z-200'
            : 'absolute hidden'
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
                <div key={i} className= 'flex list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
                  <Tick />
                  <li
                    className='ml-4'
                onClick={() => setChoiceMade(opt[0])}
                >   
                {opt[1]}
              </li>
                </div>
                
              ) : (
              <div  key={i}
              className='ml-6 list-none p-4 rounded-2xl text-light-gray-8-text dark:text-light-gray-white font-gerbera-h3'>
              <li className='ml-4' onClick={() => setChoiceMade(opt[0])}>
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
