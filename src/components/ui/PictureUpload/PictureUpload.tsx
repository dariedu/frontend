import React from 'react';
import { CheckboxElement } from '../CheckboxElement/CheckboxElement';

interface IPictureUpload {
  text: string,
  absent?: boolean
}

////// Любой попап с загрузкой фото, text  это тот текст что будет под значком загрузки фото,
// absent  нужен чтобы добавить чекбокс для отпетки, что благополучателя нет на месте, по умолчанию false
export const PictuteUpload: React.FC<IPictureUpload> = ({text, absent=false}) => {
  return (
    <>
      
      <div className="flex flex-col items-center p-6 h-max-[343px] bg-light-gray-white rounded-t-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="h-[142px] w-[140px] bg-light-gray-1 rounded-full flex justify-center items-center mb-8">
          <img
            src="./../src/assets/icons/photo.svg"
            className="h-[72px] w-[72px] cursor-pointer"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute opacity-0 h-[142px] w-[140px] rounded-full"
          />
        </div>
        <p className='block text-center max-w-[280px] pb-8 font-gerbera-h2'>
        {text}<br/>
        </p>
        <p>
          {absent ? <CheckboxElement><p className='font-gerbera-sub2'>Благополучателя нет на месте</p></CheckboxElement> : ""}
        </p>
        
      </div>
  
        
    
      
    </>
  );
};
