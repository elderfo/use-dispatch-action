# use-dispatch-action

![npm](https://img.shields.io/npm/v/use-dispatch-action)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/elderfo/use-dispatch-action/CI)
![node-current](https://img.shields.io/node/v/use-dispatch-action)
![npm bundle size](https://img.shields.io/bundlephobia/min/use-dispatch-action)
![NPM](https://img.shields.io/npm/l/use-dispatch-action)

This library is a simple utility function to use along side React's `useReducer` to create callback typed dispatch functions.

## Getting started

Install

```bash
yarn add use-dispatch-action
```

Or

```bash
npm install use-dispatch-action
```

## Usage

```typescript
import * as React from 'react';
import useDispatchAction from 'use-dispatch-action';

type Actions =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addValue'; payload: number };

type State = { counter: number };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, counter: state.counter + 1 };
    case 'decrement':
      return { ...state, counter: state.counter - 1 };
    case 'addValue':
      return { ...state, counter: state.counter + action.payload };
    default:
      return state;
  }
};

const Component = () => {
  const [state, dispatch] = React.useReducer(reducer, { counter: 0 });
  const increment = useDispatchAction(dispatch, 'increment');
  const decrement = useDispatchAction(dispatch, 'decrement');
  const addValue = useDispatchAction(dispatch, 'addValue');

  return (
    <div>
      <div title="counter">{state.counter}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => addValue(2)}>Add Two</button>
    </div>
  );
};
```
