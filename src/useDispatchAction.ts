import { Dispatch, useCallback } from 'react';
import { Action, DispatchAction } from './types';

export const useDispatchAction = <
  A extends Action,
  K extends A['type'] = A['type'],
  T = A extends Action<K, infer U> ? U : never
>(
  dispatch: Dispatch<A>,
  name: K
): DispatchAction<T> => {
  return useCallback(
    (...args: any[]) => {
      // This is just to hide a TS issue
      const internalDispatch = dispatch as Dispatch<any>;

      if (args && args.length) {
        internalDispatch({ type: name, payload: args[0] as T });
      } else {
        internalDispatch({ type: name });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, name]
  ) as DispatchAction<T>;
};

export default useDispatchAction;
