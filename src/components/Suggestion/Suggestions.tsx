import React, { useState, useContext } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';
import Big_pencil from './../../assets/icons/big_pencil.svg?react'
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import { TokenContext } from '../../core/TokenContext';
import { submitFeedbackSuggestion} from '../../api/feedbackApi';

type TSuggestions = {
  onClose: React.Dispatch<React.SetStateAction<boolean>>,
}

const Suggestions:React.FC<TSuggestions> = ({onClose}) => {

  const {token}= useContext(TokenContext);
  const [requestBody, setRequestBody] = useState({
    suggestion: localStorage.getItem('suggestion') ?? "",
  });

  const [buttonActive, setButtonActive] = useState(false)
  const [requestSuggestionFail, setRequestSuggestionFail] = useState(false)
  const [requestSuggestionSuccess, setRequestSuggestionSuccess] = useState(false)

   
  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(value: string) {
    setRequestBody({
      ...requestBody,
   ['suggestion'] : value,
    });
    localStorage.setItem('suggestion', value);
  }

  async function handleRequestSubmit() {
    if (token) {
      let suggestionString = `Поделитесь Вашими вопросами и предложениями: Ответ: ${requestBody.suggestion}`
      try {
        let result = await submitFeedbackSuggestion(token, 'suggestion', suggestionString) ;
        if (result) {
          setRequestSuggestionSuccess(true);
          localStorage.removeItem('suggestion');
          setRequestBody({
            ...requestBody,
         ['suggestion'] : "",
          });

        }
      } catch (err) {
        console.log(err)
        setRequestSuggestionFail(true)
       }
     }
   }

  function handleInfoInput() {
    if (requestBody.suggestion.length > 5) {
      setButtonActive(true)
    } else setButtonActive(false)
    }
    
   ////поднимаем текстэриа в фокус пользователя для айфона
function handleFocus(e:React.FocusEvent<HTMLTextAreaElement, Element>) {
  e.target.scrollIntoView({ block: "center", behavior: "smooth" });
}

  return (
    <div className="bg-light-gray-white -webkit-sticky pb-10 dark:bg-light-gray-7-logo rounded-2xl w-full max-w-[500px] overflow-y-auto flex flex-col items-center justify-start overflow-x-hidden" onClick={(e)=>e.stopPropagation()}>
      <div className=" flex items-center self-start mt-[25px] mx-4">
          <Big_pencil className=" w-[32px] h-[32px] min-h-[32px] min-w-[32px] fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"/>
          <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray-1">
          Поделитесь Вашими вопросами и предложениями
          </p>
        </div>
      <div className="z-[51] w-full max-w-[500px] flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo"
      onClick={(e)=>e.stopPropagation()}>
        <Form.Root
           className=" flex flex-col items-center justify-center"
          onSubmit={e => {
            e.preventDefault();
            handleRequestSubmit()
          }}
         >
          <div className='flex flex-col px-4 w-full  max-w-[500]'>
              <Form.Field name="about_presence" className="mt-4">           
                <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray-3 ml-3">Расскажите в свободной форме</Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  onFocus={(e)=>handleFocus(e)}
                  maxRows={8}
                  className="w-full min-w-[328px] bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('suggestion') ??  ""}
                  onChange={e => {
                   handleFormFieldChange(e.target.value);
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
          >Отправить</button>
        </Form.Root>
      </div>
      <ConfirmModal
        isOpen={requestSuggestionFail}
        onOpenChange={setRequestSuggestionFail}
        onConfirm={() => {setRequestSuggestionFail(false);}}
        title={<p>
          Упс, что-то пошло не так!<br />
          Попробуйте позже
        </p>}
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
      />
      <ConfirmModal
        isOpen={requestSuggestionSuccess}
        onOpenChange={setRequestSuggestionSuccess}
        onConfirm={() => {setRequestSuggestionSuccess(false); onClose(false)}}
        title={"Спасибо, что поделились!"}
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
      />

    </div>
  );
};

export default Suggestions;
