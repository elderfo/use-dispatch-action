import { Reducer, ReducerAction, ReducerState } from 'react';

/**
 * Defines an action and optionally it's payload
 * @template T Name of the action
 * @template P (Optional) type for the payload
 */
export type Action<T extends string = string, P = never> = {
  type: T;
  payload?: P;
};

export type DispatchAction<T> = [T] extends [never]
  ? () => void
  : (payload: T) => void;

export type DispatchActionArgs<
  R extends Reducer<any, any>,
  T extends Action<any, any> = ReducerAction<R>
> = T extends Action<any, infer U>
  ? [U] extends [never]
    ? [T['type']]
    : T extends { payload: infer P }
    ? [T['type'], P]
    : [T['type']]
  : [T['type']];

export type ActionDispatcher<
  R extends Reducer<any, any>,
  A = DispatchActionArgs<R>
> = (args: A) => void;

export type DispatchProps<R extends Reducer<any, any>> = {
  dispatch: ActionDispatcher<R, DispatchActionArgs<R>>;
  state: ReducerState<R>;
};

export type DispatchContextProps<R extends Reducer<any, any>> = {
  initialState: ReducerState<R>;
  reducer: R;
} & Pick<React.ProviderProps<any>, 'children'>;

export type StateOrReducerState<TState> = TState extends Reducer<any, any>
  ? ReducerState<TState>
  : TState;

export type ActionOrReducerAction<
  TMaybeReducer,
  TAction extends Action<any, any> = { type: any; payload: any }
> = TMaybeReducer extends Reducer<any, any>
  ? ReducerAction<TMaybeReducer> extends Action<any, any>
    ? ReducerAction<TMaybeReducer>
    : TAction
  : TAction;

export type PickReducer<T, R extends Reducer<any, any>> = T extends Reducer<
  any,
  any
>
  ? T
  : R;
