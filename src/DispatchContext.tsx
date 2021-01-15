import React, { Reducer, useCallback, createContext, useContext } from 'react';
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

const DispatchContext = createContext<DispatchProps<any, any, any, any>>(
  undefined as any
);

export function DispatchContextProvider<
  TStateOrReducer,
  TAction extends Action = ActionOrReducerAction<TStateOrReducer>,
  TState = StateOrReducerState<TStateOrReducer>,
  TReducer extends Reducer<any, any> = Reducer<TState, TAction>
>({
  initialState,
  reducer,
  children,
}: DispatchContextProps<PickReducer<TStateOrReducer, TReducer>>): JSX.Element {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);

  const providerValue = useDeepCompareMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  ) as DispatchProps<TStateOrReducer>;

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

export function useDispatchContext<
  TStateOrReducer,
  TAction extends Action = ActionOrReducerAction<TStateOrReducer>,
  TState = StateOrReducerState<TStateOrReducer>,
  TReducer extends Reducer<any, any> = Reducer<TState, TAction>
>(): [TState, ActionDispatcher<PickReducer<TStateOrReducer, TReducer>>] {
  const { state, dispatch } = useContext<DispatchProps<TStateOrReducer>>(
    DispatchContext
  );
  return [
    state as TState,
    dispatch as ActionDispatcher<PickReducer<TStateOrReducer, TReducer>>,
  ];
}
