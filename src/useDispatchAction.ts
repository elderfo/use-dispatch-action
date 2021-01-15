import { Dispatch, useCallback } from 'react';
import { Action, DispatchAction } from './types';

export const useDispatchAction = <
  TAction extends Action,
  TActionType extends TAction['type'] = TAction['type'],
  TActionPayload = TAction extends Action<TActionType, infer U> ? U : never
>(
  dispatch: Dispatch<TAction>,
  action: TActionType
): DispatchAction<TActionPayload> => {
  return useCallback(
    (payload?: TAction['payload']) => {
      // This is just to hide a TS issue
      const internalDispatch = dispatch as Dispatch<any>;

      if (payload) {
        internalDispatch({ type: action, payload });
      } else {
        internalDispatch({ type: action });
      }
    },
    [dispatch, action]
  ) as DispatchAction<TActionPayload>;
};

export default useDispatchAction;
