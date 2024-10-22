import React from "react";
import './index.css';

interface IInputOptionsProps{
  options: [number,string][]
  clicked: boolean
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
  choiceMade: number,
  setChoiceMade: React.Dispatch<React.SetStateAction<number>>
}


const InputOptions: React.FC<IInputOptionsProps> = ({ options, clicked, setClicked, choiceMade, setChoiceMade }) => {
function handleClick(clicked:boolean, setClicked:React.Dispatch<React.SetStateAction<boolean>>) {
    if (clicked == false) {
      setClicked(true)
    } else {
      setClicked(false)
    };
};
// 
  
  return (
    <div className={clicked ? "bg-light-gray-1 rounded-t-2xl z-100 " : "bg-light-gray-1 rounded-2xl"} onClick={(e) => { e.stopPropagation(); handleClick(clicked, setClicked) }}>
      <p className="px-4 py-[18px] w-[328px] h-[54px] text-light-gray-8-text font-gerbera-h3 text-left">{
        (options.filter((opt) => { if (opt[0] == choiceMade) return opt}))[0][1]}</p>
    <div className={clicked? "bg-light-gray-1 flex flex-col h-[108px] rounded-b-2xl overflow-y-scroll w-[328px] text-left absolute z-200" : "absolute hidden"}>
        {options.sort((a: [number, string], b: [number, string]) => {return (a[1].toLocaleLowerCase()).localeCompare(b[1].toLocaleLowerCase())})
          .map((opt: [number, string], i: number) => {
       return <li key={i} className={choiceMade == opt[0] ? "bgImageInputOptions pl-8 list-none py-[16px] rounded-2xl text-light-gray-8-text font-gerbera-h3" : "px-8 list-none py-[16px] w-[300px] rounded-2xl text-light-gray-8-text font-gerbera-h3"} onClick={() => setChoiceMade(opt[0])}>{opt[1]}</li>
        })
        }
    </div>
</div>
  )
}

 
export default InputOptions