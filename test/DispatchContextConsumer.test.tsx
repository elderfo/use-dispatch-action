import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { DispatchContextConsumer, DispatchContextProvider } from '../src';
import { reducer } from './reducer';
import { DispatchProps } from '../src/types';

const Component = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <DispatchContextConsumer>
        {props => <Body {...props} />}
      </DispatchContextConsumer>
    </DispatchContextProvider>
  );
};

const Body = ({ state, dispatch }: DispatchProps<typeof reducer>) => {
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
