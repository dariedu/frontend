import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';

type TComment = {
  onSave: (index: number, comment: string) => void;
  index: number;
  savedComment: string;
  id: number;
};

const Comment: React.FC<TComment> = ({ onSave, index, savedComment, id }) => {
  const localeStorageName = `comment${id}`;
  type TComment = typeof localeStorageName;

  const [requestBody, setRequestBody] = useState({
    [`${localeStorageName}`]:
      localStorage.getItem(localeStorageName) ?? savedComment ?? '',
  });

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TComment, value: string) {
    setRequestBody({
      ...requestBody,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }

  ////поднимаем текстэриа в фокус пользователя для айфона
  function handleFocus(e: React.FocusEvent<HTMLTextAreaElement, Element>) {
    e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  return (
    <Form.Root className=" flex flex-col items-center justify-center w-full">
      <div className="flex flex-col min-w-[328px] w-full max-w-[500px] ">
        <Form.Field name="comment">
          <Form.Control asChild>
            <TextareaAutosize
              onFocus={e => handleFocus(e)}
              maxRows={8}
              className=" min-w-[96%] w-full  bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-3 "
              placeholder="Оставьте комментарий, если это необходимо"
              defaultValue={
                localStorage.getItem(localeStorageName) ?? savedComment ?? ''
              }
              onChange={e => {
                handleFormFieldChange(localeStorageName, e.target.value);
              }}
              onBlur={() => onSave(index, requestBody[`${localeStorageName}`])}
            />
          </Form.Control>
        </Form.Field>
      </div>
    </Form.Root>
  );
};

export default Comment;
