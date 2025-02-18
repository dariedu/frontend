import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CancelledDeliveryOrTaskFeedback from '../../src/components/DeliveryOrTaskFeedback/CancelledDeliveryOrTaskFeedback';
import { TokenContext } from '../../src/core/TokenContext';
import { UserContext } from '../../src/core/UserContext';
// import userEvent from '@testing-library/user-event';

// Моки для контекста
const mockTokenContext = {
  token: 'mock-token',
};

const mockUserContext = {
  isIphone: false,
};

// Мок для API
jest.mock('../../src/api/feedbackApi', () => ({
  submitFeedbackDeliveryoOrTask: jest.fn(),
}));

describe('CancelledDeliveryOrTaskFeedback', () => {
  const onOpenChangeMock = jest.fn();
  const onSubmitFidbackMock = jest.fn();

  const renderComponent = (delivery = true, deliveryOrTaskId = 1) => {
    return render(
      <TokenContext.Provider value={ mockTokenContext }>
        <UserContext.Provider value={ mockUserContext }>
          <CancelledDeliveryOrTaskFeedback
            onOpenChange={onOpenChangeMock}
            onSubmitFidback={onSubmitFidbackMock}
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

  it('renders correctly for delivery', () => {
    renderComponent(true);
    expect(screen.getByText('Поделитесь, пожалуйста, почему вы отказались от участия в доставке?')).toBeInTheDocument();
  });

  it('renders correctly for task', () => {
    renderComponent(false);
    expect(screen.getByText('Поделитесь, пожалуйста, почему вы отказались от участия в добром деле?')).toBeInTheDocument();
  });

  it('updates feedback text on input change', () => {
    renderComponent();
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });
    expect(textarea.value).toBe('Test feedback');
  });

  it('submits feedback for delivery', async () => {
    const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
    submitFeedbackDeliveryoOrTask.mockResolvedValue(true);

    renderComponent(true);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });

    const submitButton = screen.getByText('Отправить');
    fireEvent.click(submitButton);

    expect(submitFeedbackDeliveryoOrTask).toHaveBeenCalledWith(
      'mock-token',
      true,
      'canceled_delivery',
      'Поделитесь, пожалуйста, почему вы отказались от участия в доставке? Ответ: Test feedback',
      1
    );

    await screen.findByText('Отправить'); // Ждем завершения асинхронных операций
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onSubmitFidbackMock).toHaveBeenCalledWith(true);
  });

  it('submits feedback for task', async () => {
    const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
    submitFeedbackDeliveryoOrTask.mockResolvedValue(true);

    renderComponent(false);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });

    const submitButton = screen.getByText('Отправить');
    fireEvent.click(submitButton);

    expect(submitFeedbackDeliveryoOrTask).toHaveBeenCalledWith(
      'mock-token',
      false,
      'canceled_task',
      'Поделитесь, пожалуйста, почему вы отказались от участия в добром деле? Ответ: Test feedback',
      1
    );

    await screen.findByText('Отправить'); // Ждем завершения асинхронных операций
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onSubmitFidbackMock).toHaveBeenCalledWith(true);
  });

  it('shows error modal on submission failure', async () => {
    const { submitFeedbackDeliveryoOrTask } = require('../../src/api/feedbackApi');
    submitFeedbackDeliveryoOrTask.mockRejectedValue(new Error('Failed to submit'));

    expect(screen.queryByText('Упс, что-то пошло не так')).toBeNull();

    renderComponent();
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });

    const submitButton = screen.getByText('Отправить');
    fireEvent.click(submitButton);

    await screen.findByText('Упс, что-то пошло не так');
    expect(screen.getByText('Упс, что-то пошло не так')).toBeInTheDocument();
  });
});