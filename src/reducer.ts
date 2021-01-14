import React, { useCallback } from 'react';
import { Reducer, ReducerState, ReducerAction } from 'react';
import { Action } from '.';

type ActionArguments<T extends Action> = T extends Action<any, infer U>
  ? [U] extends [never]
    ? [T['type']]
    : T extends { payload: infer P }
    ? [T['type'], P]
    : [T['type']]
  : [T['type']];

type DispatchFunction<
  R extends Reducer<any, any>,
  A = ActionArguments<ReducerAction<R>>
> = (args: A) => void;

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
