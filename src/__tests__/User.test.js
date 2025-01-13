import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import User from '../User';
import { describe } from 'node:test';
import userEvent from '@testing-library/user-event';


describe('User', () => {
  it('renders User component', async () => {
    React.act(() => {
     render(<User />);
    });
    expect(screen.queryByText(/Signed in as/)).toBeNull();
    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();
  })
})

describe('User', () => {
  it('renders User component', async () => {
    render(<User />);
  await screen.findByText(/Signed in as/)
    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();
    await userEvent.type(screen.getByRole('textbox'), 'JavaScript');
  //  fireEvent.change(screen.getByRole('textbox'), {
  //     target: { value: 'JavaScript' },
  //   });
    waitFor(() => {
   expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();
 })

  })
})
