import React, {
  Reducer,
  ReducerState,
  useCallback,
  ReducerAction,
  createContext,
  useContext,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { DispatchContextProps, DispatchFunction, DispatchProps } from './types';
import useDispatchReducer from './useDispatchReducer';

const DispatchContext = createContext<DispatchProps<any>>(undefined as any);

export function DispatchContextProvider<R extends Reducer<any, any>>({
  initialState,
  reducer,
  children,
}: DispatchContextProps<R>) {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);

  const providerValue = useDeepCompareMemo<DispatchProps<R>>(
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
  DispatchFunction<R>
] {
  const { state, dispatch } = useContext<
    DispatchProps<Reducer<ReducerState<R>, ReducerAction<R>>>
  >(DispatchContext);
  return [state, dispatch];
}
