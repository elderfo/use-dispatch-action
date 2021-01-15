import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDispatchReducer } from '../src';
import { Actions, reducer, State } from './reducer';

const ComponentWithReducer = () => {
  const [state, dispatch] = useDispatchReducer(reducer, { counter: 0 });
  const increment = () => dispatch(['increment']);
  const decrement = () => dispatch(['decrement']);
  const addValue = (number: number) => dispatch(['addValue', number]);

  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => addValue(2)}>Add Two</button>
    </div>
  );
};

const ComponentWtihStateAction = () => {
  const [state, dispatch] = useDispatchReducer<State, Actions>(reducer, {
    counter: 0,
  });
  const increment = () => dispatch(['increment']);
  const decrement = () => dispatch(['decrement']);
  const addValue = (number: number) => dispatch(['addValue', number]);

  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => addValue(2)}>Add Two</button>
    </div>
  );
};

describe('useDispatchReducer', () => {
  it('dispatches expected actions', async () => {
    render(<ComponentWithReducer />);

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Two'));

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });

  it('dispatches expected actions', async () => {
    render(<ComponentWtihStateAction />);

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Two'));

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });
});
