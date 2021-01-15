import React, {
  Reducer,
  ReducerState,
  useCallback,
  ReducerAction,
  createContext,
  useContext,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { DispatchFunction, ActionArguments } from './types';
import useDispatchReducer from './useDispatchReducer';

export type ReducerProps<R extends Reducer<any, any>> = {
  dispatch: DispatchFunction<R, ActionArguments<ReducerAction<R>>>;
  state: ReducerState<R>;
};

type ReducerContextProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
} & Pick<React.ProviderProps<any>, 'children'>;

const ReducerContext = createContext<ReducerProps<any>>(undefined as any);

export function ReducerContextProvider<R extends Reducer<any, any>>({
  initialState,
  reducer,
  children,
}: ReducerContextProps<R>) {
  const [state, dispatch] = useDispatchReducer(reducer, initialState);

  const providerValue = useDeepCompareMemo<ReducerProps<R>>(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <ReducerContext.Provider value={providerValue}>
      {children}
    </ReducerContext.Provider>
  );
}

export function ReducerContextConsumer<R extends Reducer<any, any>>({
  children,
}: React.ConsumerProps<ReducerProps<R>>) {
  const render = useCallback(
    (state: ReducerProps<R>) => {
      return children(state);
    },
    [children]
  );

  return <ReducerContext.Consumer>{render}</ReducerContext.Consumer>;
}

export function useReducerContext<R extends Reducer<any, any>>(): [
  ReducerState<R>,
  DispatchFunction<R>
] {
  const { state, dispatch } = useContext<
    ReducerProps<Reducer<ReducerState<R>, ReducerAction<R>>>
  >(ReducerContext);
  return [state, dispatch];
}
