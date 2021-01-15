import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { DispatchContextConsumer, DispatchContextProvider } from '../src';
import { Actions, reducer, State } from './reducer';
import { DispatchProps } from '../src/types';

const ComponentWithReducer = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <DispatchContextConsumer>
        {props => <BodyWithReducer {...props} />}
      </DispatchContextConsumer>
    </DispatchContextProvider>
  );
};

const BodyWithReducer = ({
  state,
  dispatch,
}: DispatchProps<typeof reducer>) => {
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
      <DispatchContextConsumer>
        {props => <BodyWithStateAction {...props} />}
      </DispatchContextConsumer>
    </DispatchContextProvider>
  );
};

const BodyWithStateAction = ({
  state,
  dispatch,
}: DispatchProps<State, Actions>) => {
  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={() => dispatch(['increment'])}>Increment</button>
      <button onClick={() => dispatch(['decrement'])}>Decrement</button>
      <button onClick={() => dispatch(['addValue', 2])}>Add Two</button>
    </div>
  );
};

describe('DispatchContextConsumer', () => {
  it('Reducer dispatches expected actions', async () => {
    render(<ComponentWithReducer />);

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
