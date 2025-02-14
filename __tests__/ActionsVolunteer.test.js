import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ActionsVolunteer from '../src/components/ActionsVolunteer/ActionsVolunteer';
import { getVolunteerDeliveries } from '../src/api/apiDeliveries';
import { TokenContext } from '../src/core/TokenContext';

// Мокируем API
jest.mock('../src/api/apiDeliveries', () => ({
  getVolunteerDeliveries: jest.fn(),
}));

// Мокируем контекст
const mockTokenContext = {
  token: 'mock-token',
};

describe('ActionsVolunteer component', () => {
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('should render the component with visible actions', () => {
    const visibleActions = ['История', 'Обо мне'];

    expect(screen.queryByText('История')).toBeNull();
    expect(screen.queryByText('Обо мне')).toBeNull();
    expect(screen.queryByText('Пригласить друга')).toBeNull();

    const { getByText } = render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={visibleActions}
          showThemeToggle={true}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );

    // Проверяем, что действия отображаются

    expect(getByText('История')).toBeInTheDocument();
    expect(getByText('Обо мне')).toBeInTheDocument();
    expect(screen.queryByText('Пригласить друга')).toBeNull();

  });

  it('should render the theme toggle when showThemeToggle is true', () => {
    const { getByText } = render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={[]}
          showThemeToggle={true}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );
    // Проверяем, что переключатель темы отображается
    expect(getByText('Системная')).toBeInTheDocument();

  });

  it('should call getVolunteerDeliveries on mount', async () => {
    // Мокируем успешный ответ от API
    (getVolunteerDeliveries).mockResolvedValueOnce({
      'мои завершенные доставки': [{ id: 1 }, { id: 2 }],
    });

    render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={[]}
          showThemeToggle={false}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );

    // Ожидаем, что getVolunteerDeliveries был вызван
    await waitFor(() => {
      expect(getVolunteerDeliveries).toHaveBeenCalledWith('mock-token');
    });

  });

  it('should open the support modal when clicking on the support action', () => {
    const visibleActions = ['Вопросы и предложения'];
    expect(screen.queryByText('Поделитесь Вашими вопросами и предложениями')).toBeNull();
    const { getByText } = render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={visibleActions}
          showThemeToggle={false}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );
    // Находим кнопку "История" и кликаем по ней
    fireEvent.click(getByText('Вопросы и предложения'));
    // Проверяем, что модальное окно истории открылось
    expect(screen.getByText('Поделитесь Вашими вопросами и предложениями')).toBeInTheDocument();
  });

  it('should open the about me modal when clicking on the about me action', () => {
    const visibleActions = ['Обо мне'];
    expect(screen.queryByText('Выберите ваш род деятельности')).toBeNull();
    const { getByText } = render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={visibleActions}
          showThemeToggle={false}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );

    // Находим кнопку "Обо мне" и кликаем по ней
    fireEvent.click(getByText('Обо мне'));
    // Проверяем, что модальное окно "Обо мне" открылось
    expect(screen.getByText('Выберите ваш род деятельности')).toBeInTheDocument();
  });

  it('should show not enough points modal when trying to become a curator with less than 3 deliveries', async () => {

    // (getVolunteerDeliveries).mockResolvedValueOnce({
    //   'мои завершенные доставки': [{ id: 1 }, { id: 2 }],
    // });

    const visibleActions = ['Подать заявку на должность куратора'];
    // screen.getByTestId('confirm-modal').toBeInTheDocument();
    expect(screen.queryByTestId('confirm-modal')).toBeNull();

    const {getByText } = render(
      <TokenContext.Provider value={mockTokenContext}>
        <ActionsVolunteer
          visibleActions={visibleActions}
          showThemeToggle={false}
          isVolunteer={true}
        />
      </TokenContext.Provider>
    );
    // Находим кнопку "Подать заявку на должность куратора" и кликаем по ней
    fireEvent.click(getByText('Подать заявку на должность куратора'));

    // Ожидаем, что модальное окно с сообщением о недостаточном количестве доставок откроется
  expect(await screen.findByTestId('confirm-modal')).toBeInTheDocument();

  });

});