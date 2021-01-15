import React, {
  Reducer,
  ReducerState,
  useCallback,
  ReducerAction,
  createContext,
  useContext,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  Action,
  DispatchContextProps,
  ActionDispatcher,
  DispatchProps,
  ActionOrReducerAction,
  StateOrReducerState,
  PickReducer,
} from './types';
import useDispatchReducer from './useDispatchReducer';

const DispatchContext = createContext<DispatchProps<any>>(undefined as any);

export function DispatchContextProvider<
  TFirst,
  TActions extends Action<any, any> = ActionOrReducerAction<TFirst>,
  TState = StateOrReducerState<TFirst>,
  TReducer extends Reducer<any, any> = Reducer<TState, TActions>
>({
  initialState,
  reducer,
  children,
}: DispatchContextProps<PickReducer<TFirst, TReducer>>): JSX.Element {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);

  const providerValue = useDeepCompareMemo<DispatchProps<TReducer>>(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <DispatchContext.Provider value={providerValue}>
      {children}
    </DispatchContext.Provider>
  );
}

export function DispatchContextConsumer<R extends Reducer<any, any>>({
  children,
}: React.ConsumerProps<DispatchProps<R>>) {
  const render = useCallback(
    (state: DispatchProps<R>) => {
      return children(state);
    },
    [children]
  );

  return <DispatchContext.Consumer>{render}</DispatchContext.Consumer>;
}

export function useDispatchContext<R extends Reducer<any, any>>(): [
  ReducerState<R>,
  ActionDispatcher<R>
];
export function useDispatchContext<
  TState,
  TActions extends Action,
  R extends Reducer<TState, TActions> = Reducer<TState, TActions>
>(): [ReducerState<R>, ActionDispatcher<R>] {
  const { state, dispatch } = useContext<
    DispatchProps<Reducer<ReducerState<R>, ReducerAction<R>>>
  >(DispatchContext);
  return [state, dispatch];
}
