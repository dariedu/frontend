import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';
//import Big_pencil from './../../assets/icons/big_pencil.svg?react'
import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';


type TComment = {
  name:string
  onSave: (index: number, address: string, comment:string) => void
  index: number
  savedComment:string
}

const Comment: React.FC<TComment> = ({ onSave, name, index, savedComment }) => {

  type TComment= keyof typeof requestBody;



  const [requestBody, setRequestBody] = useState({comment: localStorage.getItem('comment') ??  savedComment ?? "",});
  const [buttonActive, setButtonActive] = useState(false)


  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TComment, value: string) {
    setRequestBody({
      ...requestBody,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }


  function handleInfoInput() {
    if (requestBody.comment.length > 5) {
      setButtonActive(true)
    } else setButtonActive(false)
  }

  return (
    <div className="bg-light-gray-1 dark:bg-light-gray-black rounded-[16px] w-[360px] h-fit flex flex-col items-center justify-start overflow-x-hidden" onClick={((e)=>e.stopPropagation())}>
      <div className="flex items-center mb-[4px] bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-[360px] rounded-b-2xl h-[60px]">
        <button onClick={()=>{}} className="mr-2">
          <RightArrowIcon className='rotate-180 w-9 h-9 mr-[8px] stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer' />
        </button>
        <h2 className='text-light-gray-black dark:text-light-gray-1'>Комментарий о доставке по адресу {name}</h2>
      </div>
      <div className="z-[51] w-[360px] flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo"
        
      onClick={(e)=>e.stopPropagation()}>
        <Form.Root
           className=" flex flex-col items-center justify-center"
          onSubmit={e => {
            e.preventDefault();
            onSave(index, name, requestBody.comment)
          }}
         >
          <div  className='flex flex-col px-4'>
              <Form.Field name="comment" className="mt-4">           
              <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray">В свободной форме поделитесь информацией о доставке</Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={15}
                  className="w-[328px] bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('comment') ?? savedComment ?? ""}
                  onChange={e => {
                   handleFormFieldChange('comment', e.target.value);
                   handleInfoInput()
                  }}
                />
              </Form.Control>
              <Form.Message
                match={(value) => value.length < 10}
                className="font-gerbera-sub2 text-light-error-red line-clamp-3"
              >
                Сообщение слишком короткое, минимальное количество символов 10
              </Form.Message>
            </Form.Field>

          </div>
          <button className={`${buttonActive ? "btn-B-GreenDefault" : "btn-B-GreenInactive dark:bg-light-gray-5 dark:text-light-gray-4"} mt-4 mb-4 `}
            onClick={(e) => {
              if (buttonActive) {

              } else e.preventDefault();
          }}
          >Сохранить</button>
        </Form.Root>
      </div>
    </div>
  );
};

export default Comment;
