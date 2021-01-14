import React, { useCallback } from 'react';
import type { Reducer, ReducerState, ReducerAction } from 'react';

import { ActionArguments, DispatchFunction } from './types';

export function useDispatchReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialArg: ReducerState<R>
): [ReducerState<R>, DispatchFunction<R>] {
  const [state, dispatchInternal] = React.useReducer(reducer, initialArg);

  const dispatch = useCallback(
    ([type, payload]: ActionArguments<ReducerAction<R>>) => {
      if (payload) {
        dispatchInternal({ type: type, payload: payload } as ReducerAction<R>);
      } else {
        dispatchInternal({ type: type } as ReducerAction<R>);
      }
    },
    [dispatchInternal]
  );

  return [state, dispatch];
}

export default useDispatchReducer;
