import * as React from 'react';
import { render, fireEvent, screen, waitFor, } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'
import App from '../src/App';
// import VolunteerPage from '../pages/Volunteer/VolunteerPage';
// import CuratorPage from '../pages/Curator/CuratorPage';
// import RegistrationPage from '../pages/Registration/RegistrationPage';
// import { UserContext } from '../core/UserContext';
import { describe } from 'node:test';
// import NavigationBar from '../components/NavigationBar/NavigationBar';

describe('App.tsx', () => {
  
  it("renders App.tsx if deviceType is desktop => Пожалуйста, откройте приложение через Telegram", () => {
    // const app = jest.fn()
    // window.Telegram.webApp = {};
    render(<App />)
    expect(screen.getByText(/Пожалуйста, откройте приложение на мобильном устройстве/)).toBeInTheDocument();
  });

  it("renders loader in App.tsx if deviceType is mobile and isLoading", () => {
    // window.Telegram.webApp =  {};
  //  const deviceType = 'mobile'
  //  const isLoading = true;
    const { getByTestId } = render(<App />)
    waitFor(() => expect(getByTestId("loading")).toBeInTheDocument());
})


})

