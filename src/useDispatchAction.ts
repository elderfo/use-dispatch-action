import { Dispatch, useCallback } from 'react';
import { Action, DispatchAction } from './types';

export const useDispatchAction = <
  TAction extends Action,
  TActionType extends TAction['type'] = TAction['type'],
  TActionPayload = TAction extends Action<TActionType, infer U> ? U : never
>(
  dispatch: Dispatch<TAction>,
  actionType: TActionType
): DispatchAction<TActionPayload> => {
  return useCallback(
    (...args: any[]) => {
      // This is just to hide a TS issue
      const internalDispatch = dispatch as Dispatch<any>;

      if (args && args.length) {
        internalDispatch({
          type: actionType,
          payload: args[0] as TActionPayload,
        });
      } else {
        internalDispatch({ type: actionType });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, actionType]
  ) as DispatchAction<TActionPayload>;
};

export default useDispatchAction;
