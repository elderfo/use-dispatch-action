import { Dispatch, useCallback } from 'react';

/**
 * Defines an action and optionally it's payload
 * @template T Name of the action
 * @template P (Optional) type for the payload
 */
export type Action<T extends string = string, P = never> = { type: T } & ([
  P
] extends [never]
  ? {}
  : { payload: P });

export type DispatchAction<T> = [T] extends [never]
  ? () => void
  : (payload: T) => void;

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
    [dispatch, name]
  ) as DispatchAction<T>;
};
