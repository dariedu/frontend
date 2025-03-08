import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterPromotions from '../src/components/FilterPromotions/FilterPromotions';


describe('FilterPromotions', () => {

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  const mockCategories = [
    {
      id: 1,
      name: 'первая категория'
    },
    {
      id: 2,
      name: 'вторая категория'
    },
    {
      id: 3,
      name: 'третья категория'
    },
  ]
  
  const mockOnOpenChange = jest.fn();
  const mockSetFilter = jest.fn();
  const mockHandleCategoryChoice = jest.fn();
  const mockFiltered = [{
    id: 3,
    name: 'третья категория'
  }]

  const renderComponent = () => {
    return render(
      <FilterPromotions
        categories={mockCategories}
        onOpenChange={mockOnOpenChange}
        setFilter={mockSetFilter}
        filtered={mockFiltered}
        handleCategoryChoice={mockHandleCategoryChoice}
      />
    );
  };
  

  it('should render component correctly', () => {
    renderComponent();

    expect(screen.getByText('Первая категория')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByText('Вторая категория')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[1]).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByText('Третья категория')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[2]).toHaveAttribute('data-state', 'checked')
    expect(screen.getByText("Применить")).toBeInTheDocument();
        
  })

  it('when checkbox checked data-state changed from unchecked status to checked and another way around', () => {
    renderComponent();

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getAllByRole('checkbox')[2])
   
    expect(screen.getAllByRole('checkbox')[1]).toHaveAttribute('data-state', 'checked')
    expect(screen.getAllByRole('checkbox')[2]).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('data-state', 'checked')
        
  })

  it('calls handleCategoryChoice when a category is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(mockHandleCategoryChoice).toHaveBeenCalledWith(mockCategories[0]);  
  })


  it('calls setFilter and onOpenChange when apply button is clicked', () => {
    renderComponent();
    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);
    expect(mockSetFilter).toHaveBeenCalledWith(mockFiltered);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

})