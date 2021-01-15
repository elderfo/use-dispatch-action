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
useDispatchAction(
    dispatch: React.Dispatch<any>,
    action: string
) : <TPayload>(payload: TPayload) => void | () => void
```

### Arguments

- `dispatch: React.Dispatch<any>` - A dispatch method retured from `React.useReducer`
- `action: string` - The name of the action to create. Actions names come from the second argument of the reducer function _if it is typed_.

### Returns

- `<TPayload>(payload: TPayload) => void` - Function that accepts typed payload, if a payload is defined
- `() => void` - When an action has no `payload`, a function with no arguments will be returned

### Example

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
useDispatchReducer<
  TState,
  TActions extends Action> (
   reducer: React.Reducer<TState, TAction>,
   initialState: TState
) : [state: TState, ActionDispatcher<TAction>]
```

Or

```typescript
useDispatchReducer<
  TReducer exends Reducer<infer TState, infer TAction>
> (
   reducer: React.Reducer<TState, TAction>,
   initialState: TState
) : [state: TState, ActionDispatcher<TAction>]
```

### Arguments

- `reducer: React.Reducer<TState, TAction>` - Reducer to be passed to
- `initialState: TState` - State to initialize the reducer with. A note, `userDispatchReducer` does not implement lazy loading the state

### Returns

A tuple with:

- `state: TState` - State of the reducer
- `ActionDispatcher<TAction>` - Function to dispatch actions.
  ```typescript
  // For actions without a payload
  ([type: string]) => void
  // For actions with a payload
  ([type: string, payload: action]) => void
  ```

### Examples

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

Know the State and Action types?

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

Only know the State type? The Action type will be inferred from the reducer, if possible.

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
export type DispatchContextProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
};
```

Or

```typescript
export type DispatchContextProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
};
```

###

### Example

```typescript
type Actions =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addValue'; payload: number };

export const reducer = (state: { counter: number }, action: Actions): State => {
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

const DispatchContext = () => {
  return (
    <DispatchContextProvider reducer={reducer} initialState={initialState}>
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
