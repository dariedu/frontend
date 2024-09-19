//import { useState, useEffect } from "react";
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import './index.css';
export default function RegistrationForm() {
  // tg_id: number,
  // phone: string,
  // is_adult: boolean,
  // consent_to_personal_data: boolean

  return (
    <>
      <Form.Root>
        <div className="flex flex-col justify-around items-center w-fit h-[764px]">
          <div className='font-gerbera-h1'>Зарегистрироваться</div>

          <div className="w-fit h-[364px] flex flex-col justify-between">
            <div>
              <Form.Field name="last_name">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Фамилия"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="name">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Имя"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="surname">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Отчество"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="birthDate">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your birthDate
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Дата рождения"
                    type="date"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="email">
                {/* <Label>LastName</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Message match="typeMismatch">
                  Please provide a valid email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Email"
                    type="email"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="city">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Message match="typeMismatch">
                  Please provide a valid email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Город проживания"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </div>
          <div className="flex justify-around w-[336px]">
            <Checkbox.Root className="bg-light-gray-1 rounded-full w-6 h-6 flex justify-center items-center">
              <Checkbox.Indicator>
                <CheckIcon className="text-light-gray-white font-bold rounded-full w-6 h-6 bg-light-brand-green" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label className="font-gerbera-sub2 text-light-gray-6 w-[261px] h-[21px]">
              Я подтверждаю свое согласие на{' '}
              <b className="text-light-brand-green font-normal">
                обработку персональных данных.
              </b>
            </label>
          </div>
          <div className='flex flex-col justify-between h-[152px]'>
            <div>
              <div className='w-[235px] h-[72px] flex flex-col justify-between items-start'>
                <h3 className='font-gerbera-h3 text-light-gray-black' >Загрузите свое фото</h3>
                <p className='font-gerbera-sub1 text-light-gray-6 text-left' >Для продолжения регистрации, пожалуйста, сфотографируйтесь или загрузите ваше фото
                в формате jpg</p>
              </div>
            </div>
            <button className='btn-B-GreenDefault'>Отправить заявку</button>
          </div>
        </div>
      </Form.Root>
    </>
  );
}
