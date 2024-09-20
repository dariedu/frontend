//import { useState, useEffect } from "react";
import * as Form from '@radix-ui/react-form';
import { PictuteUpload } from './../ui/PictureUpload/PictureUpload';
import './index.css';
import { Modal } from '../ui/Modal/Modal';
import { useState } from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';

export default function RegistrationForm() {
  // tg_id: number,
  // phone: string,
  // is_adult: boolean,
  // consent_to_personal_data: boolean
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Form.Root>
        <div className="flex flex-col justify-around items-center w-fit h-[764px]">
          <div className="font-gerbera-h1">Зарегистрироваться</div>

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
          <CheckboxElement>
            <label className="font-gerbera-sub2 text-light-gray-6 w-[261px] h-[21px]">
              Я подтверждаю свое согласие на{' '}
              <b className="text-light-brand-green font-normal">
                обработку персональных данных.
              </b>
            </label>
          </CheckboxElement>
          <div className="flex flex-col justify-between h-[152px]">
            <div className="flex justify-between place-items-start ">
              <div className="w-[235px] h-[72px] flex flex-col justify-between items-start">
                <h3 className="font-gerbera-h3 text-light-gray-black">
                  Загрузите свое фото
                </h3>
                <p className="font-gerbera-sub1 text-light-gray-6 text-left">
                  Для продолжения регистрации, пожалуйста, сфотографируйтесь или
                  загрузите ваше фото в формате jpg
                </p>
              </div>
              <img
                src="./../src/assets/icons/photo.svg"
                className="h-[35px] w-[38px] cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              ></img>
            </div>
            <button className="btn-B-GreenDefault">Отправить заявку</button>
          </div>
          <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <PictuteUpload
              text="Сфотографируйте согласие на обработку данных подписанное родителем"
            />
          </Modal>
        </div>
      </Form.Root>
    </>
  );
}
