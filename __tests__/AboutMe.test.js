import  React from 'react';
import { render, fireEvent, screen, cleanup} from '@testing-library/react';
import AboutMe from '../src/components/AboutMe/AboutMe';
import { describe } from 'node:test';
import userEvent from '@testing-library/user-event';
import { patchUser } from '../src/api/userApi';
// import axios from "axios";

// jest.mock('axios');




describe('AboutMe.tsx', () => {

    beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

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
    expect(await screen.findByTestId('confirm-modal')).toBeInTheDocument();
  
  });

  it('onClick of inputOptions the options are shown; and onClick of one of the options the choice is made', () => {
    const { getByTestId, getByText } = render(<AboutMe />)
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "none" })
    fireEvent.click(getByTestId('choice'));
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "light-gray-1" })
    fireEvent.click(getByText('Работаю по найму'));
    expect(getByTestId('choice')).toHaveTextContent('Работаю по найму');
  });

//   it('shows success modal on successful save', async () => {
//     const mockUserContext = {
//       currentUser: {
//         id: '123',
//         metier: 'developer',
//         interests: 'I love coding',
//       },
//     };
//     const mockTokenContext = {
//       token: 'mock-token',
//     };

// render(
//       <UserContext.Provider value={mockUserContext}>
//         <TokenContext.Provider value={mockTokenContext}>
//           <AboutMe onClose={mockOnClose} />
//         </TokenContext.Provider>
//       </UserContext.Provider>
//     );
//     const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);
//     fireEvent.change(textarea, { target: { value: 'New about me text' } });
//     fireEvent.click(screen.getByText('Сохранить'));
//     expect(await screen.findByText(/Спасибо, что поделились!/)).toBeInTheDocument();
//     expect(await screen.findByTestId('confirm-modal')).toBeInTheDocument();
//   });
  

})