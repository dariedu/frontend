import  React from 'react';
import { render, fireEvent, screen, cleanup} from '@testing-library/react';
import AboutMe from '../src/components/AboutMe/AboutMe';
import { describe } from 'node:test';
import userEvent from '@testing-library/user-event';
// import axios from 'axios';

jest.mock('axios');

describe('AboutMe.tsx', () => {

  it("renders AboutMe.ts",  () => {
    render(<AboutMe />)
    expect(screen.getByText(/Обо мне/)).toBeInTheDocument();
    expect(screen.getByText(/Выберите ваш род деятельности/)).toBeInTheDocument();
  });

  it("renders inpit in AboutMe.ts", async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const { getByTestId } = render(<AboutMe />)
    expect(screen.queryByText(/qwertyuiop/)).toBeNull();   
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(await screen.findByText(/qwertyuiop/)).toBeInTheDocument()
  })

  it('function handleRequestSubmit() fails and shown fail ConfirmModal', async () => {
    const { getByTestId } = render(<AboutMe />)
    expect(screen.queryByText(/Упс, что-то пошло не так!/)).toBeNull();
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(screen.getByText('Сохранить')).toHaveStyle({backgroundColor: "light-brand-green"})
    fireEvent.click(screen.getByText('Сохранить'));
    expect(await screen.findByText(/Упс, что-то пошло не так!/)).toBeInTheDocument();
  });
  // test('function handleRequestSubmit() fails and shown fail ConfirmModal', async () => {
 

  //   render(<AboutMe />)
  //      const setRequestAboutMeSuccess = jest.fn();
  //   const useStateMock = (useState) => [useState, setRequestAboutMeSuccess];
  //   jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  //   expect(screen.queryByText(/Спасибо, что поделились!/)).toBeNull();
  //   // expect(requestAboutMeSuccess).toBe(false);
  //   // fireEvent.click(screen.getByText('Сохранить'));
  //   //expect(await screen.findByText(/Спасибо, что поделились!/)).toBeInTheDocument();
  // });

  it('onClick of inputOptions the options are shown; and onClick of one of the options the choice is made', () => {
    const { getByTestId, getByText } = render(<AboutMe />)
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "none" })
    fireEvent.click(getByTestId('choice'));
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "light-gray-1" })
    fireEvent.click(getByText('Работаю по найму'));
    expect(getByTestId('choice')).toHaveTextContent('Работаю по найму');
  });


  // it('AboutMe toMatchSnapshot ', () => {
  // render(<AboutMe />)
  // expect(screen.getByTestId('maindiv')).toMatchSnapshot()
  // });

})

// import React from 'react';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// // import AboutMe from './AboutMe';
// import { TokenContext } from '../src/core/TokenContext'; 
// import { UserContext } from '../src/core/UserContext'; 
// // import ConfirmModal from '../ui/ConfirmModal/ConfirmModal'; 

// // Моки для контекста
// const mockUserContext = {
//   currentUser: {
//     id: 1,
//     metier: 'developer',
//     interests: 'I love coding',
//   },
// };

// const mockTokenContext = {
//   token: 'mock-token',
// };

// // Мок для ConfirmModal
// // jest.mock('../ui/ConfirmModal/ConfirmModal', () => ({
// //   __esModule: true,
// //   default: jest.fn(({ isOpen, onConfirm }) => (
// //     <div data-testid="confirm-modal">
// //       {isOpen && <button onClick={onConfirm}>Confirm</button>}
// //     </div>
// //   ),
// // }));

// // Мок для patchUser
// // jest.mock('../../api/userApi', () => ({
// //   patchUser: jest.fn(() => Promise.resolve({})),
// // }));

// describe('AboutMe Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     localStorage.clear();
//   });

//   it('renders correctly', () => {
//     render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={jest.fn()} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );

//     expect(screen.getByText('Обо мне')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Кто вы по профессии/)).toBeInTheDocument();
//     expect(screen.getByText('Сохранить')).toBeInTheDocument();
//   });

//   it('updates textarea value on change', () => {
//     render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={jest.fn()} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );

//     const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);
//     fireEvent.change(textarea, { target: { value: 'New about me text' } });

//     expect(textarea).toHaveValue('New about me text');
//   });

//   it('enables save button when text is entered', () => {
//     render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={jest.fn()} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );

//     const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);
//     fireEvent.change(textarea, { target: { value: 'New about me text' } });

//     const saveButton = screen.getByText('Сохранить');
//     expect(saveButton).not.toHaveClass('btn-B-GreenInactive');
//   });

//   it('shows success modal on successful save', async () => {
//     render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={jest.fn()} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );

//     const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);
//     fireEvent.change(textarea, { target: { value: 'New about me text' } });

//     const saveButton = screen.getByText('Сохранить');
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
//     });
//   });

//   it('shows error modal on failed save', async () => {
//     jest.spyOn(require('../../api/userApi'), 'patchUser').mockRejectedValueOnce(new Error('Failed to save'));

//     render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={jest.fn()} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );

//     const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);
//     fireEvent.change(textarea, { target: { value: 'New about me text' } });

//     const saveButton = screen.getByText('Сохранить');
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
//     });
//   });
// });