import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Comment from '../src/components/Comment/Comment';
import userEvent from '@testing-library/user-event';

describe('Comment component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();
  const name = 'Адрес доставки';
  const index = 1;
  const savedComment = '';
  const id = 123;


  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  it('should render the component with form and save button', () => {
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={savedComment}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );
    // Проверяем, что заголовок отображается
    expect(screen.getByText(`Комментарий о доставке по адресу ${name}`)).toBeInTheDocument();
    // Проверяем, что текстовое поле отображается
    expect(screen.getByLabelText('В свободной форме поделитесь информацией о доставке')).toBeInTheDocument();
    // Проверяем, что кнопка сохранения отображается
    expect(screen.getByText('Сохранить')).toBeInTheDocument();
  });

  it('should update state when typing in the textarea', () => {
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={savedComment}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );

    const textarea = screen.getByLabelText('В свободной форме поделитесь информацией о доставке');
    // Вводим текст в текстовое поле
    fireEvent.change(textarea, { target: { value: 'Новый комментарий' } });
    // Проверяем, что состояние обновилось
    expect(textarea.value).toBe('Новый комментарий');
  });

  it('should call onSave with correct arguments when form is submitted', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={''}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );

    const textarea = screen.getByLabelText('В свободной форме поделитесь информацией о доставке');
    const saveButton = screen.getByText('Сохранить');
    // Вводим текст в текстовое поле
    await userEvent.type(textarea, 'Новый комментарий');
    // Отправляем форму
    await userEvent.click(saveButton);
    // Проверяем, что onSave был вызван с правильными аргументами
    expect(mockOnSave).toHaveBeenCalledWith(index, 'Новый комментарий');
  });

  it('should enable save button when textarea has more than 5 characters', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={''}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );

    const textarea = screen.getByLabelText('В свободной форме поделитесь информацией о доставке');
    const saveButton = screen.getByText('Сохранить');

    // Вводим текст в текстовое поле
    await userEvent.type(textarea, '1234568');
    // Проверяем, что кнопка стала активной
    expect(saveButton).not.toHaveClass('btn-B-GreenInactive');
    expect(saveButton).toHaveClass('btn-B-GreenDefault');
  });



  it('should show error message when textarea has less than 10 characters', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={''}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );

    expect(screen.queryByText('Сообщение слишком короткое, минимальное количество символов 10')).toBeNull();
    const textarea = screen.getByLabelText('В свободной форме поделитесь информацией о доставке');
    const saveButton = screen.getByText('Сохранить');
    // Вводим текст в текстовое поле
    await userEvent.type(textarea, '1234568');
    await userEvent.click(saveButton);
    // screen.debug()
    // Проверяем, что сообщение об ошибке отображается
    expect(await screen.findByText('Сообщение слишком короткое, минимальное количество символов 10')).toBeInTheDocument();
  });

    it('save button should be desabled when textarea has less than 5 characters', async () => {
    render(
      <Comment
        name={name}
        onSave={mockOnSave}
        index={index}
        savedComment={savedComment}
        onOpenChange={mockOnOpenChange}
        id={id}
      />
    );

    const textarea = screen.getByLabelText('В свободной форме поделитесь информацией о доставке');
    const saveButton = screen.getByText('Сохранить');

    // Вводим текст в текстовое поле
    await userEvent.type(textarea, '1234');
    // Проверяем, что кнопка осталась неактивной
    expect(saveButton).toHaveClass('btn-B-GreenInactive');
    expect(saveButton).not.toHaveClass('btn-B-GreenDefault');
  });
});