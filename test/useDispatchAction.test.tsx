import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { useDispatchAction } from '../src';
import { reducer } from './reducer';

const Component = () => {
  const [state, dispatch] = React.useReducer(reducer, { counter: 0 });
  const increment = useDispatchAction(dispatch, 'increment');
  const decrement = useDispatchAction(dispatch, 'decrement');
  const addValue = useDispatchAction(dispatch, 'addValue');

  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={() => increment()}>Increment</button>
      <button onClick={() => decrement()}>Decrement</button>
      <button onClick={() => addValue(2)}>Add Two</button>
    </div>
  );
};

describe('useDispatchAction', () => {
  it('dispatches expected actions', async () => {
    render(<Component />);

    await act(async () => {
      fireEvent.click(screen.getByText('Increment'));
    });

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    await act(async () => {
      fireEvent.click(screen.getByText('Decrement'));
    });

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    await act(async () => {
      fireEvent.click(screen.getByText('Add Two'));
    });

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });
});
