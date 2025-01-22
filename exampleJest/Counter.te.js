import React from 'react';
import { render, cleanup, fireEvent} from '@testing-library/react';
import Counter from '../Counter';
// import { afterEach } from 'node:test';

afterEach(cleanup);

it("increments counter", () => {
  const { getByTestId } = render(<Counter />)
  fireEvent.click(getByTestId("button_up"))
  expect(getByTestId('counter')).toHaveTextContent('1')
})

it('decrements counter',  ()=> {
  const { getByTestId } = render(<Counter />)
  fireEvent.click(getByTestId("button_down"))
  expect(getByTestId('counter')).toHaveTextContent("-1")
})