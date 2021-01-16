# use-dispatch-action

Typed utilities for improving the experience with `useReducer`.

![npm](https://img.shields.io/npm/v/use-dispatch-action)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/elderfo/use-dispatch-action/CI)
![node-current](https://img.shields.io/node/v/use-dispatch-action)
![npm bundle size](https://img.shields.io/bundlephobia/min/use-dispatch-action)
![NPM](https://img.shields.io/npm/l/use-dispatch-action)

## Problem

When using `useReducer`

- Dispatching actions are not type safe
- Action creators, while testable, introduce additional boilerplate code
- Changing an action type can lead to a reducer to no longer work properly, if you don't have tests

## Solution

`use-dispatch-action` is a collection of utilities to improve the experience when using the `useReducer` hook.

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
import { useDispatchAction } from 'use-dispatch-action';

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

# API

## type `Action`

A utilty type for defining actions

```typescript
type Action<TActionType extends string, TPayload = never> = {
  type: TActionType;
  payload?: TPayload;
};
```

### Example

```typescript
type Actions = Action<'incrementOne'> | Action<'increment', number>;
```

## `useDispatchAction`

Creates type safe dispatch functions for the specified action

```typescript
useDispatchAction<TAction>(
    dispatch: React.Dispatch<TAction>,
    action: string
) : DispatchAction<TActionPayload>
```

### Arguments

- `dispatch: React.Dispatch<TAction>` - A dispatch method retured from `React.useReducer`
- `action: string` - The type of the action

### Returns

- `DispatchAction<TActionPayload>` - Function to dispatch action

```typescript
// For actions without a payload
() => void;
// For actions with a payload
(payload: TPayload) => void;
```

### Example ([types/reducer](#types-and-reducer-for-examples))

```typescript
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
```

## `useDispatchReducer`

Creates a reducer with a type safe dispatch method

```typescript
useDispatchReducer<TState, TAction> (
   reducer: React.Reducer<TState, TAction>,
   initialState: TState
) : [state: TState, ActionDispatcher<TAction>]
```

`TState` and `TAction` can be infered by providing the type of a reducer.

```typescript
useDispatchReducer<TReducer>(
   reducer: TReducer,
   initialState: TState
) : [state: TState, ActionDispatcher<TAction>]
```

### Arguments

- `reducer: React.Reducer<TState, TAction>` - The reducer
- `initialState: TState` - State to initialize the reducer with. A note, `useDispatchReducer` does not implement lazy loading the state

### Returns

A tuple with:

- `state: TState` - State of the reducer
- `ActionDispatcher<TAction>` - Function to dispatch actions in the form of tuples
  ```typescript
  // For actions without a payload
  ([type: string]) => void;
  // For actions with a payload
  ([type: string, payload: TPayload]) => void;
  ```

### Examples ([types/reducer](#types-and-reducer-for-examples))

With type inference

```typescript
const Component = () => {
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
```

With known State and Action types

```typescript
const Component = () => {
  const [state, dispatch] = useDispatchReducer<State, Action>(reducer, {
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
```

Only know the State type? The Action type can be inferred from the reducer as long as the actions are typed.

```typescript
const Component = () => {
  const [state, dispatch] = useDispatchReducer<State>(reducer, { counter: 0 });
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
```

## DispatchContext

A context based dispatcher used to prevent prop drilling

```typescript
export type DispatchContextProps = {
  initialState: TState;
  reducer: React.Reducer<TState, TAction>;
};
```

### props

- `initialState: TState` - state to initialize the reducer with
- `reducer: React.Reducer<TState, TAction>` - The reducer

### Examples ([types/reducer](#types-and-reducer-for-examples))

Using a consumer

```typescript
const DispatchContext = () => {
  return (
    <DispatchContextProvider reducer={reducer} initialState={{ counter: 0 }}>
      <DispatchContextConsumer>
        {({ state, dispatch }: DispatchProps<typeof reducer>) => (
          <div>
            <div title="counter">{state.counter}</div>
            <button onClick={() => dispatch(['increment'])}>Increment</button>
            <button onClick={() => dispatch(['decrement'])}>Decrement</button>
            <button onClick={() => dispatch(['addValue', 2])}>Add Two</button>
          </div>
        )}
      </DispatchContextConsumer>
    </DispatchContextProvider>
  );
};
```

Using `useDispatchContext`

```typescript
const Component = () => {
  return (
    <DispatchContextProvider initialState={{ counter: 0 }} reducer={reducer}>
      <Counter />
    </DispatchContextProvider>
  );
};

const Counter = () => {
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
```

## Types and reducer for examples

```typescript
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
```
