import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InputOptions from '../src/components/AboutMe/InputOptions';

const options = [
  [1, 'Developer'],
  [2, 'Designer'],
  [3, 'Manager'],
];

describe('InputOptions', () => {
  const setClickedMock = jest.fn();
  const setChoiceMadeMock = jest.fn();
  const setButtonActiveMock = jest.fn();

  const renderComponent = (clicked = false, choiceMade = 1) => {
    return render(
      <InputOptions
        options={options}
        clicked={clicked}
        setClicked={setClickedMock}
        choiceMade={choiceMade}
        setChoiceMade={setChoiceMadeMock}
        setButtonActive={setButtonActiveMock}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly', async() => {
     renderComponent();
    expect(screen.getByTestId('choice')).toBeInTheDocument();
    expect(screen.getByTestId('hiddenDiv')).toBeInTheDocument();
   await expect(screen.getByText('Manager')).toBeInTheDocument();

  });

  it('toggles options visibility on click', () => {
    renderComponent();
    const choiceDiv = screen.getByTestId('choice');
    fireEvent.click(choiceDiv);
    expect(setClickedMock).toHaveBeenCalledWith(true);
  });

  it('selects an option on click', () => {
    renderComponent(true);
    const option = screen.getByText('Designer');
    fireEvent.click(option);
    expect(setChoiceMadeMock).toHaveBeenCalledWith(2);
    expect(setButtonActiveMock).toHaveBeenCalledWith(true);
  });

});