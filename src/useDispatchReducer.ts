import { useCallback, useReducer } from 'react';
import { Reducer, ReducerState, ReducerAction } from 'react';

import { DispatchActionArgs, DispatchFunction } from './types';

export function useDispatchReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialArg: ReducerState<R>
): [ReducerState<R>, DispatchFunction<R>] {
  const [state, dispatchInternal] = useReducer(reducer, initialArg);

  const dispatch = useCallback(([type, payload]: DispatchActionArgs<R>) => {
    if (payload) {
      dispatchInternal({ type: type, payload: payload } as ReducerAction<R>);
    } else {
      dispatchInternal({ type: type } as ReducerAction<R>);
    }
  }, []);

  return [state, dispatch];
}

export default useDispatchReducer;
