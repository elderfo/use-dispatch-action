import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  useDispatchReducer,
  useDispatchAction,
  useDispatchContext,
  DispatchContextConsumer,
  DispatchContextProvider,
  DispatchProps,
} from '../dist';
import { Counter } from './Counter';
import { reducer } from './reducer';

const App = () => {
  return (
    <>
      <div>
        <UseDispatchAction />
      </div>
      <div>
        <UseDispatchReducer />
      </div>
      <div>
        <DispatchContext />
      </div>
      <div>
        <UseDispatchContext />
      </div>
    </>
  );
};

const initialState = { counter: 0 };

const UseDispatchAction = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const decrementOne = useDispatchAction(dispatch, 'decrement');
  const incrementOne = useDispatchAction(dispatch, 'increment');
  const increment = useDispatchAction(dispatch, 'addValue');

  return (
    <>
      <h1>useDispatchAction</h1>
      <Counter
        counter={state.counter}
        decrementOne={decrementOne}
        increment={increment}
        incrementOne={incrementOne}
      />
    </>
  );
};

const UseDispatchReducer = () => {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);
  return (
    <>
      <h1>useDispatchReducer</h1>
      <Counter
        counter={state.counter}
        decrementOne={() => dispatch(['decrement'])}
        increment={(num: number) => dispatch(['addValue', num])}
        incrementOne={() => dispatch(['increment'])}
      />
    </>
  );
};

const DispatchContext = () => {
  return (
    <>
      <h1>DispatchContext</h1>
      <DispatchContextProvider reducer={reducer} initialState={initialState}>
        <DispatchContextConsumer>
          {({ state, dispatch }: DispatchProps<typeof reducer>) => (
            <Counter
              counter={state.counter}
              decrementOne={() => dispatch(['decrement'])}
              increment={(num: number) => dispatch(['addValue', num])}
              incrementOne={() => dispatch(['increment'])}
            />
          )}
        </DispatchContextConsumer>
      </DispatchContextProvider>
    </>
  );
};

const UseDispatchContext = () => {
  return (
    <>
      <h1>useDispatchContext</h1>
      <DispatchContextProvider reducer={reducer} initialState={initialState}>
        <UseDispatchCounter />
      </DispatchContextProvider>
    </>
  );
};

const UseDispatchCounter = () => {
  const [state, dispatch] = useDispatchContext<typeof reducer>();

  return (
    <Counter
      counter={state.counter}
      decrementOne={() => dispatch(['decrement'])}
      increment={(num: number) => dispatch(['addValue', num])}
      incrementOne={() => dispatch(['increment'])}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
