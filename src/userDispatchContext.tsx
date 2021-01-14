import React, {
  Reducer,
  ReducerState,
  useCallback,
  ReducerAction,
  createContext,
  useContext,
  Context,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { DispatchFunction, ActionArguments } from './types';
import useDispatchReducer from './useDispatchReducer';

type DispatchContextState<R extends Reducer<any, any>> = {
  dispatch: DispatchFunction<R, ActionArguments<ReducerAction<R>>>;
  state: ReducerState<R>;
};

type ContextProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
};

const Context = createContext<DispatchContextState<any>>(undefined as any);

type DispatchProviderProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
} & Pick<React.ProviderProps<any>, 'children'>;

export function DispatchProvider<R extends Reducer<any, any>>({
  initialState,
  reducer,
  children,
}: DispatchProviderProps<R>) {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);

  const providerValue = useDeepCompareMemo<DispatchContextState<R>>(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

export function DispatchConsumer<C extends ContextProps<any>>({
  children,
}: React.ConsumerProps<C['initialState']>) {
  const render = useCallback(
    (state: DispatchContextState<C['reducer']>) => {
      return children(state.state);
    },
    [children]
  );

  return <Context.Consumer>{render}</Context.Consumer>;
}

export function useDispatchContext<C extends ContextProps<any>>(): [
  C['initialState'],
  DispatchFunction<C['reducer']>
] {
  const { state, dispatch } = useContext<
    DispatchContextState<
      Reducer<C['initialState'], ReducerAction<C['reducer']>>
    >
  >(Context);
  return [state, dispatch];
}

type Actions =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addValue'; payload: number };

type State = { counter: number };

export const reducer = (state: State, action: Actions): State => {
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

const CounterProps: ContextProps<typeof reducer> = {
  reducer: reducer,
  initialState: { counter: 0 },
};

const [, launch] = useDispatchContext<typeof CounterProps>();
launch(['increment']);
launch(['decrement']);
launch(['addValue', 1]);

export const Pee = () => {
  return <DispatchProvider initialState></DispatchProvider>;
};
