import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import BecameCurator from '../src/components/BecameCurator/BecameCurator';
// import { createRequestMessage } from '../src/api/requestMessageApi';
import { TokenContext} from '../src/core/TokenContext';
import { UserContext } from '../src/core/UserContext';
import userEvent from '@testing-library/user-event';
// Мокируем API
jest.mock('../src/api/requestMessageApi', () => ({
  createRequestMessage: jest.fn(),
}));

// Мокируем контекст
const mockTokenContext = {
  token: 'mock-token',
};

const mockUserContext = {
  isIphone: false,
};

describe('BecameCurator component', () => {
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  it('should render the component with form fields and submit button', () => {

    expect(screen.queryByText('На какой локации вы бы хотели стать куратором и почему?')).toBeNull();
    expect(screen.queryByText('Готовы ли вы присутствовать на локации во время доставок?')).toBeNull();
    expect(screen.queryByText('Какой у вас график работы/ учёбы?')).toBeNull();
    expect(screen.queryByText('Отправить')).toBeNull();


    render(
      <TokenContext.Provider value={mockTokenContext}>
        <UserContext.Provider value={mockUserContext}>
          <BecameCurator onOpenChange={jest.fn()} />
        </UserContext.Provider>
      </TokenContext.Provider>
    );

    // Проверяем, что поля формы отображаются
    expect(screen.getByText('На какой локации вы бы хотели стать куратором и почему?')).toBeInTheDocument();
    expect(screen.getByText('Готовы ли вы присутствовать на локации во время доставок?')).toBeInTheDocument();
    expect(screen.getByText('Какой у вас график работы/ учёбы?')).toBeInTheDocument();
screen.debug()
    // Проверяем, что кнопка отправки отображается
    expect(screen.getByText('Отправить')).toBeInTheDocument();
  });


  it('should enable submit button when all fields are filled', async () => {
    render(
      <TokenContext.Provider value={mockTokenContext}>
        <UserContext.Provider value={mockUserContext}>
          <BecameCurator onOpenChange={jest.fn()} />
        </UserContext.Provider>
      </TokenContext.Provider>
    );

    expect(screen.getByText('Отправить')).toHaveStyle({backgroundColor: 'light-gray-3'})

    const locationTextarea = screen.getByLabelText('На какой локации вы бы хотели стать куратором и почему?');
    const presenceTextarea = screen.getByLabelText('Готовы ли вы присутствовать на локации во время доставок?');
    const worktimeTextarea = screen.getByLabelText('Какой у вас график работы/ учёбы?');
     const submitButton = screen.getByText('Отправить');
    
    expect(submitButton).toHaveClass('btn-B-GreenInactive');
    expect(submitButton).not.toHaveClass('btn-B-GreenDefault');

      expect(locationTextarea.value).not.toBe('Москва');
      expect(presenceTextarea.value).not.toBe('Да, готов');
      expect(worktimeTextarea.value).not.toBe('С 9 до 18');

    // Вводим текст в поля
    await userEvent.type(locationTextarea, 'Москва');
    await userEvent.type(presenceTextarea, 'Да, готов');
    await userEvent.type(worktimeTextarea, 'С 9 до 18');


      expect(await locationTextarea.value).toBe('Москва');
      expect(await presenceTextarea.value).toBe('Да, готов');
      expect(await worktimeTextarea.value).toBe('С 9 до 18');
    // Проверяем, что кнопка стала активной

    expect(submitButton).toHaveClass('btn-B-GreenDefault');

  });

  // it('should show success modal when form is submitted successfully', async () => {
  //   // Мокируем успешный ответ от API
  //   // (createRequestMessage as jest.Mock).mockResolvedValueOnce({});
  //   jest.spyOn(createRequestMessage, 'processData').mockResolvedValue({ })
  //   render(
  //     <TokenContext.Provider value={mockTokenContext}>
  //       <UserContext.Provider value={mockUserContext}>
  //         <BecameCurator onOpenChange={jest.fn()} />
  //       </UserContext.Provider>
  //     </TokenContext.Provider>
  //   );

  //   const locationTextarea = screen.getByLabelText('На какой локации вы бы хотели стать куратором и почему?');
  //   const presenceTextarea = screen.getByLabelText('Готовы ли вы присутствовать на локации во время доставок?');
  //   const worktimeTextarea = screen.getByLabelText('Какой у вас график работы/ учёбы?');
  //   const submitButton = screen.getByText('Отправить');

  //   // Вводим текст в поля
  //   fireEvent.change(locationTextarea, { target: { value: 'Москва' } });
  //   fireEvent.change(presenceTextarea, { target: { value: 'Да, готов' } });
  //   fireEvent.change(worktimeTextarea, { target: { value: 'С 9 до 18' } });

  //   // Отправляем форму
  //   fireEvent.click(submitButton);

  //   // Ожидаем, что модальное окно с успешным сообщением откроется
  //   await waitFor(() => {
  //     expect(screen.getByText('Отлично! Ваша заявка отправлена на рассмотрение!')).toBeInTheDocument();
  //   });
  // });

//   it('should show error modal when form submission fails', async () => {
//     // Мокируем ошибку от API
//     // (createRequestMessage as jest.Mock)
//     jest.spyOn(createRequestMessage, 'processData').mockRejectedValueOnce(new Error('Request failed'));

//     render(
//       <TokenContext.Provider value={mockTokenContext}>
//         <UserContext.Provider value={mockUserContext}>
//           <BecameCurator onOpenChange={jest.fn()} />
//         </UserContext.Provider>
//       </TokenContext.Provider>
//     );

//     const locationTextarea = screen.getByLabelText('На какой локации вы бы хотели стать куратором и почему?');
//     const presenceTextarea = screen.getByLabelText('Готовы ли вы присутствовать на локации во время доставок?');
//     const worktimeTextarea = screen.getByLabelText('Какой у вас график работы/ учёбы?');
//     const submitButton = screen.getByText('Отправить');

//     // Вводим текст в поля

//     await userEvent.type(locationTextarea, 'Москва Москва');
//     await userEvent.type(presenceTextarea, 'Да, готов Да, готов');
//     await userEvent.type(worktimeTextarea, 'С 9 до 18 С 9 до 18');


//   // Проверяем, что кнопка стала активной

//   expect(submitButton).toHaveClass('btn-B-GreenDefault');
//     // Отправляем форму
//     fireEvent.click(submitButton);
// screen.debug()
//     // Ожидаем, что модальное окно с ошибкой откроется
//       expect(await screen.findByText('Упс, что-то пошло не так!')).toBeInTheDocument();
//   });

});