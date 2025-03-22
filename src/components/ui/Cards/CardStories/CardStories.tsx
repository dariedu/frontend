import React, { useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { useState } from 'react';
import TextEdit, { findTextPosition } from '../../../TextEdit/TextEdit';

// Интерфейс пропсов для компонента CardStories
interface CardStoriesProps {
  imageSrc: string;
  title: string;
  onClick: () => void;
}

const CardStories: React.FC<CardStoriesProps> = ({
  imageSrc,
  title,
  onClick,
}) => {

  const [positionV, setPositionV] = useState<"top-[12px]" | "top-[55px]" | "bottom-[12px]" >("bottom-[12px]");
  const [positionH, setPositionH] = useState<"left" | "center" | "right" | "justify">('left');
  const [finalTitle, setFinalTitle] = useState<string>(title);


  // <vt> - наверху
  // <vm> - посередине
  
  ///определяем вертикальное позиционирование для этого компонента
function findTextVerticalPosition(text: string) {
  const match = text.match(/<(vt|vm)>/);
  let position: "top-[12px]" | "top-[55px]" | "bottom-[12px]"  = "bottom-[12px]" ;
  if (match) {
     position = match[0] == "<vm>" ? "top-[55px]" : match[0] == "<vt>" ? "top-[12px]" : "bottom-[12px]";
  }
  text.replace(/<(vt|vm)>/, "");
  setFinalTitle(text)
  setPositionV(position)
}

useEffect(() => {
  findTextVerticalPosition(title)
},[])
  

  useEffect(() => {
  findTextPosition(title, setPositionH)
},[])


  return (
    <div
      className="relative w-[116px] h-[160px] cursor-pointer overflow-hidden"
      onClick={onClick}>
      {/* Изображение */}
      <Avatar.Root className='inline-flex items-center justify-center align-middle overflow-hidden w-fit h-fit rounded-2xl'>
            <Avatar.Image src={imageSrc} decoding='async'  loading='lazy' className='w-[116px] h-[160px] rounded-2xl object-cover' />
            <Avatar.Fallback delayMs={1000} className='bg-light-gray-2 dark:bg-light-gray-5 w-[116px] h-[160px] rounded-2xl'>
          </Avatar.Fallback>
        </Avatar.Root>
      {/* Текст поверх картинки */}
      <div className={`absolute text-${positionH} ${positionV} px-[12px] font-gerbera-sub2 text-light-gray-white w-full h-fit whitespace-normal `}>
        <TextEdit text={finalTitle} />
      </div>
    </div>
  );
};

export default CardStories;
