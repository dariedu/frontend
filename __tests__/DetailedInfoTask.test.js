import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { DetailedInfoTask } from '../src/components/DetailedInfoDeliveryTask/DetailedInfoTask';



describe('DetailedInfoTask', () => {

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });


const category = {
  id: 1,
  name: 'раздача листовок',
  icon: ""
};

const task = {
  id: 2,
  city: {
    id: 1,
    city: 'Мосвка'
  },
  category: category,
  curator: {
    id: 5,
    tg_id: '111',
    tg_username: "mgdata",
    last_name: "Петрова",
    name: "Мария",
    surname: "Геворговна",
    phone: '89086777777',
    photo: '',
    photo_view: null,
  },
  name: 'раздать листовки',
  volunteer_price: 2,
  curator_price: 4,
  description: 'описание доброго дела',
  start_date: "2025-02-09T17:00:00+03:00",
  end_date: "2025-07-09T17:00:00+03:00",
  volunteers_needed: 5,
  volunteers_taken: 1,
  is_active: true,
  is_completed: false,
  volunteers: [2]
}
  const mockOnOpenChange = jest.fn();
  const mockSwitchTab = jest.fn();
  const mockGetTask = jest.fn();
  const mockStringForModal = 'строка для модального окна'
  const mockTakeTaskSuccess = false;
  const mockSetTakeTaskSuccess = jest.fn();
  const mockCanBook = true
  const mockCateg = [{ icon: <p>icon</p>, id: 2, name: 'листовки', icon_full_view: <p>full icon</p> }]
    
  const renderComponent = () => {
    return render(
      <DetailedInfoTask
      tasksCateg={mockCateg}
      canBook={mockCanBook}
      task={task}
      onOpenChange={mockOnOpenChange}
      switchTab={mockSwitchTab}
      getTask={mockGetTask}
      stringForModal={mockStringForModal}
      takeTaskSuccess={mockTakeTaskSuccess}
      setTakeTaskSuccess={mockSetTakeTaskSuccess}
      />    
    );
  };
  it('should render component if task just last one day and no description', async () => {
    const task2 = {
      id: 2,
      city: {
        id: 1,
        city: 'Мосвка'
      },
      category: category,
      curator: {
        id: 5,
        tg_id: '111',
        tg_username: "mgdata",
        last_name: "Петрова",
        name: "Мария",
        surname: "Геворговна",
        phone: '89086777777',
        photo: '',
        photo_view: null,
      },
      name: 'раздать листовки',
      volunteer_price: 2,
      curator_price: 4,
      description: '',
      start_date: "2025-02-09T17:00:00+03:00",
      end_date: "2025-02-09T19:00:00+03:00",
      volunteers_needed: 5,
      volunteers_taken: 1,
      is_active: true,
      is_completed: false,
      volunteers: [2]
    }

    render(
      <DetailedInfoTask
      tasksCateg={mockCateg}
      canBook={mockCanBook}
      task={task2}
      onOpenChange={mockOnOpenChange}
      switchTab={mockSwitchTab}
      getTask={mockGetTask}
      stringForModal={mockStringForModal}
      takeTaskSuccess={true}
      setTakeTaskSuccess={mockSetTakeTaskSuccess}
      />    
    );
    expect(screen.getByText('Время начала')).toBeInTheDocument();
    expect(screen.getByText('9 февр. в 17:00')).toBeInTheDocument();
    expect(screen.queryByText('Подробности')).toBeNull();
  })

  it('should render component correctly', () => {
    
    renderComponent();
     const button = screen.getByText('Записаться');
        expect(screen.getByText('Даты')).toBeInTheDocument();
        expect(screen.getByText("Начисление баллов")).toBeInTheDocument();
        expect(screen.getByText('Куратор')).toBeInTheDocument();
        expect(screen.getByText('Мария')).toBeInTheDocument();
        expect(screen.getByText('9 февр. - 9 июль')).toBeInTheDocument();
        expect(screen.getByText('описание доброго дела')).toBeInTheDocument();
        expect(button).toHaveClass('btn-B-GreenDefault');
  })

  it('should render component if this user already signed up for this task', () => {
    
    render(
      <DetailedInfoTask
      tasksCateg={mockCateg}
      canBook={false}
      task={task}
      onOpenChange={mockOnOpenChange}
      switchTab={mockSwitchTab}
      getTask={mockGetTask}
      stringForModal={mockStringForModal}
      takeTaskSuccess={mockTakeTaskSuccess}
      setTakeTaskSuccess={mockSetTakeTaskSuccess}
      />    
    )
     const button = screen.getByText('Вы уже записались');
     expect(button).toHaveClass('btn-B-WhiteDefault');
  })

  it('should render component if this user already signed up for this task', async () => {

    renderComponent();
    const button = screen.getByText('Записаться');
    fireEvent.click(button);
    expect(await mockGetTask).toHaveBeenCalledWith(task);
    // screen.debug()
  })

  it('should render component if task was just booked by user, shows confirm modal', async () => {

    render(
      <DetailedInfoTask
      tasksCateg={mockCateg}
      canBook={mockCanBook}
      task={task}
      onOpenChange={mockOnOpenChange}
      switchTab={mockSwitchTab}
      getTask={mockGetTask}
      stringForModal={mockStringForModal}
      takeTaskSuccess={true}
      setTakeTaskSuccess={mockSetTakeTaskSuccess}
      />    
    );
    expect(screen.getByText(`Доброе дело строка для модального окна в календаре`)).toBeInTheDocument();
    expect(screen.getByText('В календарь')).toBeInTheDocument();
  })
  
  
})