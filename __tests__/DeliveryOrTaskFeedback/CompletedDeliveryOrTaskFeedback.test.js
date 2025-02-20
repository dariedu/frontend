import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CompletedDeliveryOrTaskFeedback from '../../src/components/DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { TokenContext } from '../../src/core/TokenContext';
import { UserContext } from '../../src/core/UserContext';
import userEvent from '@testing-library/user-event'

// Моки для контекста
const mockUserContext = {
  isIphone: false,
};

const mockTokenContext = {
  token: 'mock-token',
};

// Мок для API
jest.mock('../../src/api/feedbackApi', () => ({
  submitFeedbackDeliveryoOrTask: jest.fn(),
}));

describe('CompletedDeliveryOrTaskFeedback', () => {
  const onOpenChangeMock = jest.fn();
  const onSubmitFidbackMock = jest.fn();

  const renderComponent = (volunteer = true, delivery = true, deliveryOrTaskId = 1) => {
    return render(
      <TokenContext.Provider value={mockTokenContext}>
        <UserContext.Provider value={mockUserContext}>
          <CompletedDeliveryOrTaskFeedback
            onOpenChange={onOpenChangeMock}
            onSubmitFidback={onSubmitFidbackMock}
            volunteer={volunteer}
            delivery={delivery}
            deliveryOrTaskId={deliveryOrTaskId}
          />
        </UserContext.Provider>
      </TokenContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly for volunteer delivery', () => {
    renderComponent(true, true);
    expect(screen.getByText('Расскажите в свободной форме')).toBeInTheDocument();
    expect(screen.getByText('На сколько приятным было общение с куратором?')).toBeInTheDocument();
    expect(screen.getByText('Как прошла доставка? Что Вам понравилось? Что бы Вы поменяли?')).toBeInTheDocument();
  });

  it('renders correctly for volunteer task', () => {
    renderComponent(true, false);
    expect(screen.getByText('Расскажите в свободной форме')).toBeInTheDocument();
    expect(screen.getByText('На сколько приятным было общение с куратором?')).toBeInTheDocument();
    expect(screen.getByText('Как прошло Ваше участие в добром деле? Что Вам понравилось? Что бы Вы поменяли?')).toBeInTheDocument();
  });

  it('renders correctly for curator delivery', () => {
    renderComponent(false, true);
    expect(screen.getByText('Поделитесь Вашими впечатлениями от курирования доставки')).toBeInTheDocument();
    expect(screen.getByText('Как прошла доставка? Что понравилось? А что хотели бы изменить и как?')).toBeInTheDocument();
  });

  it('renders correctly for curator task', () => {
    renderComponent(false, false);
    expect(screen.getByText('Поделитесь Вашими впечатлениями от курирования доброго дела')).toBeInTheDocument();
    expect(screen.getByText('Как прошло доброе дело? Что понравилось? А что хотели бы изменить и как?')).toBeInTheDocument();
  });

  it('updates feedback text on input change', () => {
    renderComponent();
    const textarea = screen.getAllByRole('textbox')[0];
    expect(textarea.value).not.toBe('New feedback text');
    fireEvent.change(textarea, { target: { value: 'New feedback text' } });
    expect(textarea.value).toBe('New feedback text');
  });

  it('submits the form successfully for volunteer delivery', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
    submitFeedbackDeliveryoOrTask.mockResolvedValue(true);

    renderComponent(true, true);
    const textarea = screen.getAllByRole('textbox')[0];
    await userEvent.type(textarea, 'New feedback text' );
   
    const submitButton = screen.getByText('Отправить');
    await userEvent.click(submitButton);

    expect(submitFeedbackDeliveryoOrTask).toHaveBeenCalledWith(
      'mock-token',
      true,
      'completed_delivery',
      'На сколько приятным было общение с куратором? Ответ: New feedback text, Как прошла доставка? Что Вам понравилось? Что бы Вы поменяли? Ответ: New feedback text',
      1
    );

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onSubmitFidbackMock).toHaveBeenCalledWith(true);
  });
  

  it('shows error modal on submission failure', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
    submitFeedbackDeliveryoOrTask.mockRejectedValue(new Error('Failed to submit'));

    renderComponent();
    const textarea = screen.getAllByRole('textbox')[0];
     await userEvent.type(textarea, 'New feedback text' );

    const submitButton = screen.getByText('Отправить');
    await userEvent.click(submitButton);
// screen.debug()
  // await screen.findByText('Упс, что-то пошло не так, попробуйте позже');
     expect(await screen.findByText('Упс, что-то пошло не так, попробуйте позже')).toBeInTheDocument();
  });

  // it('shows error modal on submission success', async () => {
  //   const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
  //   submitFeedbackDeliveryoOrTask.mockResolvedValue(true);

  //   renderComponent();
  //   const textarea = screen.getAllByRole('textbox')[0];
  //    await userEvent.type(textarea, 'New feedback text' );

  //   const submitButton = screen.getByText('Отправить');
  //   await userEvent.click(submitButton);

  //   await screen.findByText('Упс, что-то пошло не так, попробуйте позже');
  //   await expect(screen.getByText('Упс, что-то пошло не так, попробуйте позже')).toBeInTheDocument();
  // });
});