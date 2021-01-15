import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { DispatchContextProvider, useDispatchContext } from '../src';
import { reducer } from './reducer';

const Component = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <UseDispatchCounter />
    </DispatchContextProvider>
  );
};

const UseDispatchCounter = () => {
  const [state, dispatch] = useDispatchContext<typeof reducer>();

  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={() => dispatch(['increment'])}>Increment</button>
      <button onClick={() => dispatch(['decrement'])}>Decrement</button>
      <button onClick={() => dispatch(['addValue', 2])}>Add Two</button>
    </div>
  );
};

describe('useDispatchContext', () => {
  it('dispatches expected actions', async () => {
    render(<Component />);

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Two'));

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });
});
