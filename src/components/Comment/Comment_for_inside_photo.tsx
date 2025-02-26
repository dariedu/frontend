import React, {
  useState,
  // useContext
} from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';
// import RightArrowIcon from '../../assets/icons/arrow_right.svg?react';
// import Big_pencil from './../../assets/icons/big_pencil.svg?react';
// import { UserContext } from '../../core/UserContext';


type TComment = {
  onSave: (index: number, comment:string) => void
  index: number
  savedComment: string
  id:number
}

const Comment: React.FC<TComment> = ({onSave, index, savedComment, id }) => {

 
  // const { isIphone } = useContext(UserContext);

  const localeStorageName = `comment${id}`;
  type TComment = typeof localeStorageName;
  
  const [requestBody, setRequestBody] = useState({[`${localeStorageName}`]: localStorage.getItem(localeStorageName) ??  savedComment ?? "",});
  // const [buttonActive, setButtonActive] = useState(false)


  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TComment, value: string) {
    setRequestBody({
      ...requestBody,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }


  // function handleInfoInput() {
  //   if (requestBody[`${localeStorageName}`].length > 5) {
  //     setButtonActive(true)
  //   } else setButtonActive(false)
  // }

   ////поднимаем текстэриа в фокус пользователя для айфона
function handleFocus(e:React.FocusEvent<HTMLTextAreaElement, Element>) {
  e.target.scrollIntoView({ block: "center", behavior: "smooth" });
}

  return (
    <div className='bg-light-gray-1 dark:bg-light-gray-black rounded-2xl w-full max-w-[500px] h-fit flex flex-col items-center justify-start'>
      {/* <div className={`flex items-center mb-1  bg-light-gray-white dark:bg-light-gray-7-logo dark:text-light-gray-1 w-full max-w-[500px]  h-fit p-4 ${isIphone ? " rounded-b-2xl " : " rounded-2xl"}`}>
        <button onClick={onOpenChange} >
          <RightArrowIcon className='rotate-180 w-9 h-9 mr-[8px] stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer' />
        </button>
        <h2 className='text-light-gray-black dark:text-light-gray-1'>Комментарий о доставке по адресу {name}</h2>
      </div> */}
      <div className=" min-w-[360px] pb-10 w-full flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo"
        
      onClick={(e)=>e.stopPropagation()}>
        <Form.Root
           className=" flex flex-col items-center justify-center"
          // onSubmit={e => {
          //   e.preventDefault();
          //   onSave(index, requestBody[`${localeStorageName}`])
          // }}
         >
          <div  className='flex flex-col px-4 min-w-[328px] w-full max-w-[500px] '>
            <Form.Field name="comment" className="mt-4"> 
              <div className='flex items-center'>
              {/* <Big_pencil className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"/>  */}
              <Form.Label className="font-gerbera-sub2 pl-4 text-light-gray-4 line-clamp-3 dark:text-light-gray">В свободной форме поделитесь информацией о доставке (Заполняется по желанию или необходимости)</Form.Label>
              </div>
           
              <Form.Control asChild>
                <TextareaAutosize
                  onFocus={(e)=>handleFocus(e)}
                  maxRows={8}
                  className=" min-w-[96%] w-full  bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem(localeStorageName) ?? savedComment ?? ""}
                  onChange={e => {
                   handleFormFieldChange(localeStorageName, e.target.value);
                   
                  }}
                  onBlur={()=>onSave(index, requestBody[`${localeStorageName}`])}
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
        </Form.Root>
      </div>
    </div>
  );
};

export default Comment;
