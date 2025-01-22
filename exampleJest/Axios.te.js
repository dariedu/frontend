import * as React from 'react';
import axios from 'axios';
import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Axios from '../Axios';

jest.mock('axios');

describe("Axios", () => {
  it('fetches stories from an API and displays them', async () => {
    const stories = [
      { objectID: "1", title: "Hello" },
      { objectID: "2", title: "React" },
    ]
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { hits: stories } })
  )
    render(<Axios />);
    await userEvent.click(screen.getByRole('button'));
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('fetches stories from API and fails', async () => {
    
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error())
    );
    render(<Axios />);
    await userEvent.click(screen.getByRole('button'));
    const message = await screen.findByText(/Something went wrong/);
    expect(message).toBeInTheDocument();
  })
})

describe("Axios2", () => {

  it('fetches stories from an API and displays them', async () => {
    const stories = [
      { objectID: '1', title: 'Hello' },
      { objectID: '2', title: 'React' },
    ];

    const promise = Promise.resolve({ data: { hits: stories } });

    axios.get.mockImplementationOnce(() => promise);

    render(<Axios />);

    await userEvent.click(screen.getByRole('button'));

    waitFor(() => promise);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

})

