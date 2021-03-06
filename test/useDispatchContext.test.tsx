import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { DispatchContextProvider, useDispatchContext } from '../src';
import { Actions, reducer, State } from './reducer';

const ComponentWtihReducer = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <UseDispatchCounterWithReducer />
    </DispatchContextProvider>
  );
};

const UseDispatchCounterWithReducer = () => {
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

const ComponentWithStateAction = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <UseDispatchCounterWithStateAction />
    </DispatchContextProvider>
  );
};

const UseDispatchCounterWithStateAction = () => {
  const [state, dispatch] = useDispatchContext<State, Actions>();

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
  it('Reducer dispatches expected actions', async () => {
    render(<ComponentWtihReducer />);

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Two'));

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });

  it('State/Action dispatches expected actions', async () => {
    render(<ComponentWithStateAction />);

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTitle('counter')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByTitle('counter')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Two'));

    expect(screen.getByTitle('counter')).toHaveTextContent('2');
  });
});
