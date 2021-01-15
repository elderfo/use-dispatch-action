import { useCallback, useReducer } from 'react';
import { Reducer } from 'react';

import {
  Action,
  ActionOrReducerAction,
  DispatchActionArgs,
  ActionDispatcher,
  PickReducer,
  StateOrReducerState,
} from './types';

export function useDispatchReducer<
  TFirst,
  TAction extends Action = ActionOrReducerAction<TFirst>,
  TState = StateOrReducerState<TFirst>,
  TReducer extends Reducer<any, any> = Reducer<TState, TAction>
>(
  reducer: PickReducer<TFirst, TReducer>,
  initialArg: TState
): [TState, ActionDispatcher<TReducer>] {
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
