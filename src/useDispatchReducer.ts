import { useCallback, useReducer } from 'react';
import { Reducer, ReducerState } from 'react';

import { Action, DispatchActionArgs, DispatchFunction } from './types';

export function useDispatchReducer<TReducer extends Reducer<any, any>>(
  reducer: TReducer,
  initialArg: ReducerState<TReducer>
): [ReducerState<TReducer>, DispatchFunction<TReducer>];
export function useDispatchReducer<
  TState,
  TActions extends Action,
  TReducer extends Reducer<any, any> = Reducer<TState, TActions>
>(reducer: TReducer, initialArg: TState): [TState, DispatchFunction<TReducer>] {
  const [state, dispatchInternal] = useReducer<Reducer<any, any>>(
    reducer,
    initialArg
  );

  const dispatch = useCallback(
    ([type, payload]: DispatchActionArgs<TReducer>) => {
      if (payload) {
        dispatchInternal({ type: type, payload: payload });
      } else {
        dispatchInternal({ type: type });
      }
    },
    []
  );

  return [state, dispatch];
}

export default useDispatchReducer;
